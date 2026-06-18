from fastapi import FastAPI, APIRouter, HTTPException, Header, Cookie, Response, Request, Depends
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
import httpx
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
    # Per-audience counts (used by founding-seat counters on the marketing pages).
    pipeline = [
        {"$group": {"_id": "$audience", "count": {"$sum": 1}}},
    ]
    rows = await db.waitlist.aggregate(pipeline).to_list(100)
    by_audience: Dict[str, int] = {(r["_id"] or "unspecified"): r["count"] for r in rows}
    return {
        "count": n,
        "watch_apple": apple,
        "watch_android": android,
        "by_audience": by_audience,
    }


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


# Include the router in the main app — MOVED to end of file so all @api_router decorators register first

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


# ---------- Auth (Emergent Google OAuth) ----------
EMERGENT_AUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"


class AuthUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


async def _resolve_user_from_token(token: str) -> Optional[AuthUser]:
    if not token:
        return None
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        return None
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    if isinstance(user_doc.get("created_at"), str):
        user_doc["created_at"] = datetime.fromisoformat(user_doc["created_at"])
    return AuthUser(**user_doc)


async def require_user(
    session_token: Optional[str] = Cookie(default=None),
    authorization: Optional[str] = Header(default=None),
) -> AuthUser:
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
    user = await _resolve_user_from_token(token or "")
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    return user


class SessionExchange(BaseModel):
    session_id: str


@api_router.post("/auth/session")
async def auth_session(payload: SessionExchange, response: Response):
    """Exchange session_id from Emergent OAuth fragment for a user + persistent session."""
    async with httpx.AsyncClient(timeout=10.0) as cx:
        r = await cx.get(EMERGENT_AUTH_URL, headers={"X-Session-ID": payload.session_id})
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Emergent session.")
    data = r.json()
    email = (data.get("email") or "").lower()
    if not email:
        raise HTTPException(status_code=502, detail="Auth provider returned no email.")

    # Upsert user
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if user:
        user_id = user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": data.get("name") or user.get("name"),
                      "picture": data.get("picture") or user.get("picture")}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": data.get("name") or email.split("@")[0],
            "picture": data.get("picture"),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    session_token = data.get("session_token") or str(uuid.uuid4())
    expires = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    response.set_cookie(
        key="session_token",
        value=session_token,
        max_age=7 * 24 * 3600,
        path="/",
        httponly=True,
        secure=True,
        samesite="none",
    )
    return {"user_id": user_id, "email": email, "name": data.get("name"),
            "picture": data.get("picture"), "session_token": session_token}


@api_router.get("/auth/me")
async def auth_me(user: AuthUser = Depends(require_user)):
    return user.model_dump()


@api_router.post("/auth/logout")
async def auth_logout(response: Response,
                      session_token: Optional[str] = Cookie(default=None),
                      authorization: Optional[str] = Header(default=None)):
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}


# ---------- Check-ins ----------
SIGNALS = ["calm", "focus", "stress", "anxiety", "depression", "warmth"]


class CheckInCreate(BaseModel):
    calm: int = Field(ge=0, le=100)
    focus: int = Field(ge=0, le=100)
    stress: int = Field(ge=0, le=100)
    anxiety: int = Field(ge=0, le=100)
    depression: int = Field(ge=0, le=100)
    warmth: int = Field(ge=0, le=100)
    reflection: Optional[str] = None


class CheckIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    calm: int
    focus: int
    stress: int
    anxiety: int
    depression: int
    warmth: int
    eq: int  # composite: ((calm+focus+warmth)/3) - ((stress+anxiety+depression)/3) shifted to 0-100
    reflection: Optional[str] = None
    suggestion: Optional[str] = None
    created_at: datetime


def _compute_eq(c: Dict[str, int]) -> int:
    positive = (c["calm"] + c["focus"] + c["warmth"]) / 3.0
    negative = (c["stress"] + c["anxiety"] + c["depression"]) / 3.0
    score = (positive - negative + 100) / 2.0  # maps -100..100 -> 0..100
    return max(0, min(100, int(round(score))))


async def _generate_suggestion(check: Dict[str, Any]) -> str:
    """Use Claude via emergentintegrations for a one-sentence regulation suggestion."""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        key = os.environ.get("EMERGENT_LLM_KEY") or "sk-emergent-527E64a7a837aAaE0A"
        chat = (LlmChat(
            api_key=key,
            session_id=f"checkin-{check['id']}",
            system_message=(
                "You are Let It Go AI, a contemplative emotional-regulation companion. "
                "Given a 6-signal affective snapshot (calm/focus/stress/anxiety/depression/warmth, 0-100) "
                "and optional reflection, respond with EXACTLY one short, kind, embodied co-regulation "
                "suggestion (under 25 words, no preamble, no list, no quotes, no emojis). "
                "Soft, literary, never clinical. Address the person directly."
            ),
        ).with_model("anthropic", "claude-sonnet-4-6"))
        snapshot = ", ".join(f"{k}={check[k]}" for k in SIGNALS)
        ref = check.get("reflection") or ""
        prompt = f"Snapshot: {snapshot}\nReflection: {ref}\n\nOne sentence, please."
        resp = await chat.send_message(UserMessage(text=prompt))
        return (resp if isinstance(resp, str) else str(resp)).strip().strip('"').strip("'")
    except Exception as e:
        logger.warning(f"Suggestion generation failed: {e}")
        # Soft fallback that still feels in-brand.
        if check["stress"] > 60 or check["anxiety"] > 60:
            return "Two slow breaths, shoulders down. You're carrying more than you realize. Let it go."
        return "You're doing fine. Notice one thing in the room that's soft. Rest there for a breath."


@api_router.post("/checkins", response_model=CheckIn)
async def create_checkin(payload: CheckInCreate, user: AuthUser = Depends(require_user)):
    now = datetime.now(timezone.utc)
    data = payload.model_dump()
    entry = {
        "id": str(uuid.uuid4()),
        "user_id": user.user_id,
        **{k: int(data[k]) for k in SIGNALS},
        "eq": _compute_eq(data),
        "reflection": payload.reflection,
        "suggestion": None,
        "created_at": now.isoformat(),
    }
    entry["suggestion"] = await _generate_suggestion(entry)
    await db.checkins.insert_one({**entry})
    entry["created_at"] = now
    return CheckIn(**entry)


@api_router.get("/checkins", response_model=List[CheckIn])
async def list_checkins(days: int = 30, user: AuthUser = Depends(require_user)):
    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    rows = await db.checkins.find(
        {"user_id": user.user_id, "created_at": {"$gte": cutoff}},
        {"_id": 0},
    ).sort("created_at", -1).to_list(500)
    out = []
    for r in rows:
        if isinstance(r.get("created_at"), str):
            r["created_at"] = datetime.fromisoformat(r["created_at"])
        out.append(CheckIn(**r))
    return out


@api_router.get("/checkins/latest")
async def latest_checkin(user: AuthUser = Depends(require_user)):
    doc = await db.checkins.find_one(
        {"user_id": user.user_id}, {"_id": 0}, sort=[("created_at", -1)]
    )
    if not doc:
        return {"latest": None}
    if isinstance(doc.get("created_at"), str):
        doc["created_at"] = datetime.fromisoformat(doc["created_at"])
    return {"latest": CheckIn(**doc).model_dump()}

app.include_router(api_router)
