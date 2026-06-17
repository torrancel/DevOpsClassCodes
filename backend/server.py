from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
SENDER_NAME = os.environ.get('SENDER_NAME', 'Let It Go AI')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', '')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Existing health models ----------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# ---------- Waitlist ----------
AUDIENCE_COPY = {
    "kids":          {"label": "Kids beta",                "hello": "for the little feelers in your life"},
    "individual":    {"label": "Individual beta",          "hello": "for your inner life"},
    "team":          {"label": "Team beta",                "hello": "for the team you hold"},
    "professional":  {"label": "Professional beta",        "hello": "for the people who hold others"},
    "watch":         {"label": "Wrist beta",               "hello": "for the pulse beneath your day — Apple Watch & Wear OS"},
    "doctors":       {"label": "Doctors mode beta",        "hello": "for the calm after the shift"},
    "attorneys":     {"label": "Attorneys mode beta",      "hello": "for the quiet after the courtroom"},
    "teachers":      {"label": "Teachers mode beta",       "hello": "for the breath after the bell"},
    "managers":      {"label": "Managers mode beta",       "hello": "for the steadiness behind every 1:1"},
}


class WaitlistCreate(BaseModel):
    email: EmailStr
    audience: Optional[str] = None
    platform: Optional[str] = None  # 'apple' | 'android' (only meaningful when audience='watch')
    source: Optional[str] = None  # e.g. "hero", "pricing", "cta"


class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    audience: Optional[str] = None
    platform: Optional[str] = None
    source: Optional[str] = None
    created_at: datetime
    email_sent: bool = False


def _render_email_html(audience: Optional[str], platform: Optional[str] = None) -> tuple[str, str]:
    """Return (subject, html_body) tailored to audience + platform."""
    info = AUDIENCE_COPY.get(audience or "", None)

    # Watch-specific platform openers override the generic one
    if audience == "watch" and platform in ("apple", "android"):
        if platform == "apple":
            subject = "Welcome to the Wrist beta — Apple Watch edition"
            opener = (
                "You're on the list — <em>Wrist beta, Apple Watch edition</em>. "
                "A whisper-soft companion for watchOS is being built, and your seat is saved."
            )
        else:
            subject = "Welcome to the Wrist beta — Wear OS edition"
            opener = (
                "You're on the list — <em>Wrist beta, Wear OS edition</em>. "
                "A whisper-soft companion for Galaxy / Pixel is being built, and your seat is saved."
            )
    elif info:
        subject = f"Welcome to the {info['label']} — Let It Go AI"
        opener = (
            f"You're on the list — <em>{info['label']}</em>. "
            f"A quiet space {info['hello']} is being built, and your seat is saved."
        )
    else:
        subject = "Welcome to the Let It Go beta — quietly saved"
        opener = (
            "You're on the list. A quiet operating system for the inner life "
            "is being built — and your seat is saved."
        )

    html = f"""
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#050208;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050208;padding:48px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:linear-gradient(160deg,#0B0613 0%,#1A0930 60%,#2A1140 100%);border:1px solid rgba(255,255,255,0.10);border-radius:24px;padding:48px;">
            <tr><td>
              <div style="font-size:11px;letter-spacing:0.35em;text-transform:uppercase;background:linear-gradient(90deg,#5E8BFF,#8A4DFF,#FF6FD3);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:24px;">
                Let It Go AI
              </div>
              <h1 style="font-family:Georgia,serif;font-weight:400;font-size:36px;line-height:1.1;color:#F4EEFF;margin:0 0 24px 0;">
                You can let it go now.
              </h1>
              <p style="font-size:16px;line-height:1.6;color:#B5A8CC;margin:0 0 16px 0;">
                {opener}
              </p>
              <p style="font-size:16px;line-height:1.6;color:#B5A8CC;margin:0 0 24px 0;">
                We won't write often. No marketing, no drip campaigns — just one more email when your cohort opens.
              </p>
              <div style="height:1px;background:rgba(255,255,255,0.10);margin:32px 0;"></div>
              <p style="font-size:14px;line-height:1.6;color:#B5A8CC;margin:0 0 8px 0;">
                In the meantime, two slow breaths. Shoulders down.
              </p>
              <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:#F4EEFF;margin:0;">
                — The Let It Go team
              </p>
            </td></tr>
          </table>
          <p style="font-size:11px;color:#544966;margin-top:24px;letter-spacing:0.1em;">
            © Let It Go AI · An instrument for the inner life
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
""".strip()
    return subject, html


async def _send_confirmation_email(to_email: str, audience: Optional[str], platform: Optional[str] = None) -> bool:
    if not resend.api_key:
        logger.warning("RESEND_API_KEY missing — skipping email send.")
        return False
    subject, html = _render_email_html(audience, platform)
    params = {
        "from": f"{SENDER_NAME} <{SENDER_EMAIL}>",
        "to": [to_email],
        "subject": subject,
        "html": html,
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Sent waitlist email to {to_email} (audience={audience}, platform={platform}) id={result.get('id')}")
        return True
    except Exception as e:
        logger.error(f"Resend send failed for {to_email}: {e}")
        return False


@api_router.post("/waitlist", response_model=WaitlistEntry)
async def create_waitlist_entry(payload: WaitlistCreate):
    audience = (payload.audience or "").strip().lower() or None
    if audience and audience not in AUDIENCE_COPY:
        audience = None

    platform = (payload.platform or "").strip().lower() or None
    if platform not in ("apple", "android"):
        platform = None
    if audience != "watch":
        platform = None  # platform only meaningful for watch audience

    now = datetime.now(timezone.utc)

    # Idempotent on (email, audience, platform)
    existing = await db.waitlist.find_one(
        {"email": payload.email.lower(), "audience": audience, "platform": platform},
        {"_id": 0},
    )
    if existing:
        # Backfill platform field on legacy records that lack it
        existing.setdefault("platform", None)
        return WaitlistEntry(**existing)

    entry = WaitlistEntry(
        id=str(uuid.uuid4()),
        email=payload.email.lower(),
        audience=audience,
        platform=platform,
        source=payload.source,
        created_at=now,
        email_sent=False,
    )

    doc = entry.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()

    await db.waitlist.insert_one(doc)

    sent = await _send_confirmation_email(entry.email, entry.audience, entry.platform)
    if sent:
        await db.waitlist.update_one(
            {"id": entry.id},
            {"$set": {"email_sent": True}},
        )
        entry.email_sent = True

    return entry


@api_router.get("/waitlist/count")
async def waitlist_count():
    n = await db.waitlist.count_documents({})
    apple = await db.waitlist.count_documents({"audience": "watch", "platform": "apple"})
    android = await db.waitlist.count_documents({"audience": "watch", "platform": "android"})
    return {"count": n, "watch_apple": apple, "watch_android": android}


# ---------- Admin analytics ----------
def _check_admin(authorization: Optional[str]) -> None:
    if not ADMIN_TOKEN:
        raise HTTPException(status_code=503, detail="Admin not configured.")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token.")
    token = authorization.split(" ", 1)[1].strip()
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid admin token.")


@api_router.get("/admin/analytics")
async def admin_analytics(authorization: Optional[str] = Header(default=None)):
    _check_admin(authorization)

    total = await db.waitlist.count_documents({})
    emailed = await db.waitlist.count_documents({"email_sent": True})

    # Per-audience breakdown
    audience_pipeline = [
        {"$group": {"_id": "$audience", "count": {"$sum": 1}, "emailed": {"$sum": {"$cond": ["$email_sent", 1, 0]}}}},
        {"$sort": {"count": -1}},
    ]
    by_audience_raw = await db.waitlist.aggregate(audience_pipeline).to_list(100)
    by_audience = [
        {"audience": (r["_id"] or "unspecified"), "count": r["count"], "emailed": r["emailed"]}
        for r in by_audience_raw
    ]

    # Per-source breakdown
    source_pipeline = [
        {"$group": {"_id": "$source", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    by_source_raw = await db.waitlist.aggregate(source_pipeline).to_list(100)
    by_source = [{"source": (r["_id"] or "unspecified"), "count": r["count"]} for r in by_source_raw]

    # Watch platform split
    platform_pipeline = [
        {"$match": {"audience": "watch"}},
        {"$group": {"_id": "$platform", "count": {"$sum": 1}}},
    ]
    plat_raw = await db.waitlist.aggregate(platform_pipeline).to_list(20)
    by_platform = [{"platform": (r["_id"] or "unspecified"), "count": r["count"]} for r in plat_raw]

    # Daily timeline (last 30 days). created_at is stored as ISO string, so prefix match works.
    now = datetime.now(timezone.utc)
    timeline = []
    for i in range(29, -1, -1):
        day = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        c = await db.waitlist.count_documents({"created_at": {"$regex": f"^{day}"}})
        timeline.append({"day": day, "count": c})

    # Recent signups (latest 25, redacted email)
    recent_raw = await db.waitlist.find({}, {"_id": 0}).sort("created_at", -1).to_list(25)

    def _redact(email: str) -> str:
        if not email or "@" not in email:
            return email
        local, _, domain = email.partition("@")
        if len(local) <= 2:
            return f"{local[0]}*@{domain}"
        return f"{local[0]}{'*' * (len(local) - 2)}{local[-1]}@{domain}"

    recent = [
        {
            "email": _redact(r.get("email", "")),
            "audience": r.get("audience"),
            "platform": r.get("platform"),
            "source": r.get("source"),
            "created_at": r.get("created_at"),
            "email_sent": r.get("email_sent", False),
        }
        for r in recent_raw
    ]

    return {
        "total": total,
        "emailed": emailed,
        "send_rate": (emailed / total) if total else 0.0,
        "by_audience": by_audience,
        "by_source": by_source,
        "by_platform": by_platform,
        "timeline": timeline,
        "recent": recent,
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
