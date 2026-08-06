from fastapi import FastAPI, APIRouter, HTTPException, Header, Cookie, Response, Request, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import smtplib
import ssl
from email.message import EmailMessage
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

# Email transport: Gmail SMTP (primary) with Resend fallback.
GMAIL_USER = os.environ.get('GMAIL_USER', '')
GMAIL_APP_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD', '').replace(' ', '')  # spaces in app passwords are decorative
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL') or GMAIL_USER or 'onboarding@resend.dev'
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
    application_data: Optional[Dict[str, Any]] = None  # extra structured fields (e.g. partnership submissions)


class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    audience: Optional[str] = None
    platform: Optional[str] = None
    source: Optional[str] = None
    application_data: Optional[Dict[str, Any]] = None
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
            "You're on the list. A quiet ecosystem for the inner life "
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


async def _send_email(to_email: str, subject: str, html: str) -> bool:
    """Unified transactional sender.

    Tries Gmail SMTP first (uses GMAIL_USER / GMAIL_APP_PASSWORD).
    Falls back to Resend if Gmail is not configured or the SMTP send fails.
    Returns True if anything succeeded.
    """
    # Gmail SMTP path
    if GMAIL_USER and GMAIL_APP_PASSWORD:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = f"{SENDER_NAME} <{GMAIL_USER}>"
        msg["To"] = to_email
        # Plain-text fallback for non-HTML clients
        msg.set_content("This email is best viewed in an HTML-capable client.")
        msg.add_alternative(html, subtype="html")

        def _smtp_send():
            context = ssl.create_default_context()
            with smtplib.SMTP("smtp.gmail.com", 587, timeout=20) as server:
                server.starttls(context=context)
                server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
                server.send_message(msg)

        try:
            await asyncio.to_thread(_smtp_send)
            logger.info(f"Sent via Gmail SMTP → {to_email}")
            return True
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"Gmail SMTP auth failed for {GMAIL_USER}: {e}. Check GMAIL_APP_PASSWORD (must be a 16-char app password, not the regular password).")
        except Exception as e:  # noqa: BLE001
            logger.error(f"Gmail SMTP send failed for {to_email}: {e}")

    # Resend fallback
    if not resend.api_key:
        logger.warning(f"No working email transport for {to_email} (no Gmail, no Resend).")
        return False
    try:
        result = await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": f"{SENDER_NAME} <{SENDER_EMAIL}>",
                "to": [to_email],
                "subject": subject,
                "html": html,
            },
        )
        logger.info(f"Sent via Resend → {to_email} id={result.get('id')}")
        return True
    except Exception as e:  # noqa: BLE001
        logger.error(f"Resend send failed for {to_email}: {e}")
        return False


async def _send_confirmation_email(to_email: str, audience: Optional[str], platform: Optional[str] = None) -> bool:
    subject, html = _render_email_html(audience, platform)
    sent = await _send_email(to_email, subject, html)
    if sent:
        logger.info(f"Confirmation queued for {to_email} (audience={audience}, platform={platform})")
    return sent


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
        application_data=payload.application_data,
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


# ---------- Investor inquiries ----------
INVESTOR_TYPES = {"vc", "angel", "family_office", "strategic", "advisor", "other"}


class InvestorInquiryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    organization: Optional[str] = Field(default=None, max_length=200)
    investor_type: str = Field(min_length=1, max_length=32)
    message: str = Field(min_length=1, max_length=5000)
    # Anti-spam: honeypot (must be empty) + client-side dwell time in ms.
    website: Optional[str] = Field(default=None, max_length=500)
    submitted_after_ms: Optional[int] = Field(default=0, ge=0)


class InvestorInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: EmailStr
    organization: Optional[str] = None
    investor_type: str
    message: str
    ip: Optional[str] = None
    user_agent: Optional[str] = None
    submitted_at: datetime
    status: str = "new"


@api_router.post("/investor-inquiries")
async def create_investor_inquiry(payload: InvestorInquiryCreate, request: Request):
    # Honeypot — bots fill hidden fields. Silently accept to avoid tipping them off.
    if payload.website:
        return {"success": True, "id": "spam-filtered"}

    # Dwell-time check — bots submit near-instantly.
    if (payload.submitted_after_ms or 0) < 2000:
        raise HTTPException(status_code=400, detail="Please take a moment before submitting.")

    itype = (payload.investor_type or "").strip().lower().replace(" ", "_")
    if itype not in INVESTOR_TYPES:
        itype = "other"

    # Naive per-IP rate limit — max 3 inquiries per hour per IP
    ip = request.client.host if request.client else None
    if ip:
        an_hour_ago = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
        recent_count = await db.investor_inquiries.count_documents({
            "ip": ip,
            "submitted_at": {"$gte": an_hour_ago},
        })
        if recent_count >= 3:
            raise HTTPException(status_code=429, detail="Too many submissions. Please try again later.")

    inquiry = InvestorInquiry(
        id=str(uuid.uuid4()),
        name=payload.name.strip()[:200],
        email=payload.email.lower(),
        organization=((payload.organization or "").strip()[:200] or None),
        investor_type=itype,
        message=payload.message.strip()[:5000],
        ip=ip,
        user_agent=(request.headers.get("user-agent") or "")[:500],
        submitted_at=datetime.now(timezone.utc),
        status="new",
    )

    doc = inquiry.model_dump()
    doc["submitted_at"] = doc["submitted_at"].isoformat()
    await db.investor_inquiries.insert_one(doc)

    # Notify founder via email (best-effort — never block the response).
    try:
        founder_to = os.environ.get('FOUNDER_INBOX') or GMAIL_USER or SENDER_EMAIL
        if founder_to and GMAIL_USER and GMAIL_APP_PASSWORD:
            msg = EmailMessage()
            msg["Subject"] = f"[Investor Inquiry] {inquiry.name} — {itype}"
            msg["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
            msg["To"] = founder_to
            msg["Reply-To"] = inquiry.email
            body_lines = [
                f"Name: {inquiry.name}",
                f"Email: {inquiry.email}",
                f"Organization: {inquiry.organization or '—'}",
                f"Investor type: {itype}",
                "",
                "Message:",
                inquiry.message,
                "",
                f"Submitted: {inquiry.submitted_at.isoformat()}",
                f"IP: {ip or '—'}",
            ]
            msg.set_content("\n".join(body_lines))
            ctx = ssl.create_default_context()
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctx, timeout=10) as s:
                s.login(GMAIL_USER, GMAIL_APP_PASSWORD)
                s.send_message(msg)
    except Exception as e:
        logging.warning("Investor inquiry email notification failed: %s", e)

    return {"success": True, "id": inquiry.id}


@api_router.get("/admin/investor-inquiries")
async def list_investor_inquiries(authorization: Optional[str] = Header(default=None)):
    _check_admin(authorization)
    docs = await db.investor_inquiries.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(500)
    return {"count": len(docs), "inquiries": docs}


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
    is_beta_tester: bool = False
    beta_joined_at: Optional[datetime] = None
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
    if isinstance(user_doc.get("beta_joined_at"), str):
        user_doc["beta_joined_at"] = datetime.fromisoformat(user_doc["beta_joined_at"])
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


# ---------- Beta program ----------
import secrets


def _new_beta_code() -> str:
    """6-char human-friendly code: no 0/O/1/I/L confusion."""
    alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
    return "".join(secrets.choice(alphabet) for _ in range(6))


class BetaApplyPayload(BaseModel):
    email: EmailStr
    name: str
    role: Optional[str] = None  # e.g. "doctor", "teacher", "individual"
    why: Optional[str] = None  # free-form motivation
    referrer: Optional[str] = None  # tracking source


class BetaApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    name: str
    role: Optional[str] = None
    why: Optional[str] = None
    referrer: Optional[str] = None
    status: str = "pending"  # pending | approved | denied
    created_at: datetime
    decided_at: Optional[datetime] = None
    code: Optional[str] = None


class BetaRedeemPayload(BaseModel):
    code: str


class BetaFeedbackPayload(BaseModel):
    rating: Optional[int] = None  # 1-5
    category: Optional[str] = None  # bug | idea | praise | other
    message: str


class BetaFeedback(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    email: EmailStr
    rating: Optional[int] = None
    category: Optional[str] = None
    message: str
    created_at: datetime


class BetaCodeCreatePayload(BaseModel):
    count: int = 1  # how many codes to mint
    max_uses: int = 1  # uses per code
    label: Optional[str] = None  # admin label (e.g. "doctors-cohort-1")


async def _send_beta_invite_email(to_email: str, name: str, code: str) -> bool:
    """Send the beta-access invite email via the unified transport (Gmail SMTP → Resend)."""
    frontend_url = os.environ.get("FRONTEND_URL", "").rstrip("/")
    redeem_url = f"{frontend_url}/beta/redeem"
    first_name = (name.split(" ")[0] if name else "friend") or "friend"
    html = f"""
    <html><body style="margin:0;padding:0;background:#0a0712;color:#e7e3f2;font-family:Inter,system-ui,sans-serif;">
      <div style="max-width:560px;margin:0 auto;padding:48px 32px;">
        <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#a48fd6;margin:0 0 24px 0;">You're in · Beta access</p>
        <h1 style="font-family:Georgia,serif;font-size:36px;line-height:1.1;color:#fff;margin:0 0 24px 0;">
          welcome, <em style="background:linear-gradient(90deg,#5E8BFF,#8A4DFF,#FF6FD3);-webkit-background-clip:text;background-clip:text;color:transparent;font-style:italic;">{first_name}</em>.
        </h1>
        <p style="font-size:16px;line-height:1.6;color:#c9c1de;">
          Let It Go is now open for you. This is a quiet, intentional beta — please use it gently, tell us what surprises you, and feel free to log out for days at a time.
        </p>
        <div style="margin:40px 0;padding:24px;background:rgba(138,77,255,0.08);border:1px solid rgba(138,77,255,0.3);border-radius:16px;text-align:center;">
          <p style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#a48fd6;margin:0 0 8px 0;">Your beta code</p>
          <p style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:28px;letter-spacing:0.2em;color:#fff;margin:0;">{code}</p>
        </div>
        <p style="font-size:14px;color:#c9c1de;">
          To activate: sign in with Google, then paste the code on the redemption screen.
        </p>
        <p style="margin:32px 0;">
          <a href="{redeem_url}" style="display:inline-block;padding:14px 28px;background:linear-gradient(90deg,#5E8BFF,#8A4DFF,#FF6FD3);color:#fff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:500;">Redeem your code →</a>
        </p>
        <p style="font-size:12px;color:#7a6f95;margin-top:48px;">
          One code, one seat. If you didn't apply for the beta, please ignore this email.<br/>
          — Let It Go AI · made with quiet attention
        </p>
      </div>
    </body></html>
    """
    sent = await _send_email(to_email, f"you're in — beta code {code}", html)
    if sent:
        logger.info(f"Beta invite queued for {to_email} code={code}")
    return sent


# ----- Public + authenticated endpoints -----

@api_router.post("/beta/apply")
async def beta_apply(payload: BetaApplyPayload):
    """Public form — anyone can apply to the beta."""
    existing = await db.beta_applications.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        return {"ok": True, "status": existing.get("status", "pending"), "already_applied": True}
    doc = {
        "id": str(uuid.uuid4()),
        "email": payload.email,
        "name": payload.name,
        "role": payload.role,
        "why": payload.why,
        "referrer": payload.referrer,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "decided_at": None,
        "code": None,
    }
    await db.beta_applications.insert_one(doc)
    return {"ok": True, "status": "pending", "already_applied": False}


@api_router.get("/beta/status")
async def beta_status(user: AuthUser = Depends(require_user)):
    """Authenticated: am I a beta tester? Also report whether I have a pending application."""
    app_doc = await db.beta_applications.find_one({"email": user.email}, {"_id": 0})
    return {
        "is_beta_tester": bool(user.is_beta_tester),
        "joined_at": user.beta_joined_at.isoformat() if user.beta_joined_at else None,
        "application": (
            {"status": app_doc.get("status"), "created_at": app_doc.get("created_at")}
            if app_doc else None
        ),
    }


@api_router.post("/beta/redeem")
async def beta_redeem(payload: BetaRedeemPayload, user: AuthUser = Depends(require_user)):
    """Authenticated user redeems a code → flips is_beta_tester on user doc."""
    code = payload.code.strip().upper()
    if user.is_beta_tester:
        return {"ok": True, "already_beta": True}
    code_doc = await db.beta_codes.find_one({"code": code}, {"_id": 0})
    if not code_doc:
        raise HTTPException(status_code=404, detail="Code not found.")
    if code_doc.get("uses", 0) >= code_doc.get("max_uses", 1):
        raise HTTPException(status_code=410, detail="Code already fully redeemed.")
    now_iso = datetime.now(timezone.utc).isoformat()
    await db.users.update_one(
        {"user_id": user.user_id},
        {"$set": {"is_beta_tester": True, "beta_joined_at": now_iso, "beta_code_used": code}},
    )
    await db.beta_codes.update_one(
        {"code": code},
        {
            "$inc": {"uses": 1},
            "$push": {"redeemed_by": {"user_id": user.user_id, "email": user.email, "at": now_iso}},
        },
    )
    # If they had a pending application, mark it approved retroactively.
    await db.beta_applications.update_one(
        {"email": user.email, "status": "pending"},
        {"$set": {"status": "approved", "decided_at": now_iso, "code": code}},
    )
    return {"ok": True, "is_beta_tester": True}


@api_router.post("/beta/feedback")
async def beta_feedback(payload: BetaFeedbackPayload, user: AuthUser = Depends(require_user)):
    """Authenticated beta tester submits feedback."""
    if not user.is_beta_tester:
        raise HTTPException(status_code=403, detail="Beta access required.")
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message required.")
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user.user_id,
        "email": user.email,
        "rating": payload.rating,
        "category": payload.category,
        "message": payload.message.strip()[:4000],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.beta_feedback.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


# ----- Admin endpoints -----

@api_router.post("/admin/beta/codes")
async def admin_beta_codes_create(
    payload: BetaCodeCreatePayload,
    authorization: Optional[str] = Header(default=None),
):
    """Mint N beta codes."""
    _check_admin(authorization)
    if payload.count < 1 or payload.count > 200:
        raise HTTPException(status_code=400, detail="count must be 1..200")
    out = []
    for _ in range(payload.count):
        # Avoid the (extremely unlikely) collision
        for _ in range(5):
            code = _new_beta_code()
            existing = await db.beta_codes.find_one({"code": code}, {"_id": 0})
            if not existing:
                break
        doc = {
            "code": code,
            "label": payload.label,
            "max_uses": payload.max_uses,
            "uses": 0,
            "redeemed_by": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.beta_codes.insert_one(doc)
        out.append({"code": code, "max_uses": payload.max_uses, "label": payload.label})
    return {"ok": True, "codes": out}


@api_router.get("/admin/beta/codes")
async def admin_beta_codes_list(authorization: Optional[str] = Header(default=None)):
    _check_admin(authorization)
    rows = await db.beta_codes.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"codes": rows}


@api_router.get("/admin/beta/applications")
async def admin_beta_applications(authorization: Optional[str] = Header(default=None)):
    _check_admin(authorization)
    rows = await db.beta_applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    pending = sum(1 for r in rows if r.get("status") == "pending")
    return {"applications": rows, "pending": pending, "total": len(rows)}


@api_router.post("/admin/beta/applications/{app_id}/approve")
async def admin_beta_approve(app_id: str, authorization: Optional[str] = Header(default=None)):
    _check_admin(authorization)
    app_doc = await db.beta_applications.find_one({"id": app_id}, {"_id": 0})
    if not app_doc:
        raise HTTPException(status_code=404, detail="Application not found.")
    code = _new_beta_code()
    now_iso = datetime.now(timezone.utc).isoformat()
    await db.beta_codes.insert_one({
        "code": code,
        "label": f"app:{app_id}",
        "max_uses": 1,
        "uses": 0,
        "redeemed_by": [],
        "created_at": now_iso,
    })
    await db.beta_applications.update_one(
        {"id": app_id},
        {"$set": {"status": "approved", "decided_at": now_iso, "code": code}},
    )
    sent = await _send_beta_invite_email(app_doc["email"], app_doc.get("name", ""), code)
    return {"ok": True, "code": code, "email_sent": sent}


@api_router.post("/admin/beta/applications/{app_id}/deny")
async def admin_beta_deny(app_id: str, authorization: Optional[str] = Header(default=None)):
    _check_admin(authorization)
    res = await db.beta_applications.update_one(
        {"id": app_id},
        {"$set": {"status": "denied", "decided_at": datetime.now(timezone.utc).isoformat()}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found.")
    return {"ok": True}


class AdminInvitePayload(BaseModel):
    email: EmailStr
    name: Optional[str] = "friend"
    label: Optional[str] = None


@api_router.post("/admin/beta/invite")
async def admin_beta_invite(payload: AdminInvitePayload, authorization: Optional[str] = Header(default=None)):
    """Hand-pick a beta tester (e.g. from the waitlist) — mints code + sends email."""
    _check_admin(authorization)
    code = _new_beta_code()
    now_iso = datetime.now(timezone.utc).isoformat()
    await db.beta_codes.insert_one({
        "code": code,
        "label": payload.label or f"invite:{payload.email}",
        "max_uses": 1,
        "uses": 0,
        "redeemed_by": [],
        "created_at": now_iso,
    })
    sent = await _send_beta_invite_email(payload.email, payload.name or "friend", code)
    return {"ok": True, "code": code, "email_sent": sent}


@api_router.get("/admin/beta/feedback")
async def admin_beta_feedback(authorization: Optional[str] = Header(default=None)):
    _check_admin(authorization)
    rows = await db.beta_feedback.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"feedback": rows, "total": len(rows)}


@api_router.get("/admin/beta/stats")
async def admin_beta_stats(authorization: Optional[str] = Header(default=None)):
    _check_admin(authorization)
    total_codes = await db.beta_codes.count_documents({})
    redeemed_codes = await db.beta_codes.count_documents({"uses": {"$gte": 1}})
    total_testers = await db.users.count_documents({"is_beta_tester": True})
    total_apps = await db.beta_applications.count_documents({})
    pending_apps = await db.beta_applications.count_documents({"status": "pending"})
    approved_apps = await db.beta_applications.count_documents({"status": "approved"})
    total_feedback = await db.beta_feedback.count_documents({})
    by_cat = [
        {"category": r["_id"] or "other", "count": r["count"]}
        for r in await db.beta_feedback.aggregate([
            {"$group": {"_id": "$category", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]).to_list(20)
    ]
    return {
        "total_codes": total_codes,
        "redeemed_codes": redeemed_codes,
        "total_testers": total_testers,
        "applications_total": total_apps,
        "applications_pending": pending_apps,
        "applications_approved": approved_apps,
        "feedback_total": total_feedback,
        "feedback_by_category": by_cat,
    }


@api_router.get("/admin/beta/waitlist-candidates")
async def admin_beta_waitlist_candidates(authorization: Optional[str] = Header(default=None)):
    """List waitlist members with their invite status, sorted by founding-rank (created_at)."""
    _check_admin(authorization)
    rows = await db.waitlist.find({}, {"_id": 0}).sort("created_at", 1).to_list(2000)
    out = []
    for r in rows:
        out.append({
            "email": r.get("email"),
            "audience": r.get("audience"),
            "platform": r.get("platform"),
            "source": r.get("source"),
            "created_at": (
                r["created_at"].isoformat() if isinstance(r.get("created_at"), datetime) else r.get("created_at")
            ),
            "invited_at": r.get("beta_invited_at"),
            "code": r.get("beta_code"),
        })
    invited = sum(1 for r in out if r["invited_at"])
    return {"candidates": out, "total": len(out), "invited": invited, "uninvited": len(out) - invited}


class BulkInvitePayload(BaseModel):
    emails: List[EmailStr]
    label: Optional[str] = "bulk-invite"


@api_router.post("/admin/beta/bulk-invite-waitlist")
async def admin_beta_bulk_invite(payload: BulkInvitePayload, authorization: Optional[str] = Header(default=None)):
    """Mint a fresh code + send invite email + mark each waitlist entry as invited.

    Skips emails already invited (idempotent). Returns per-email outcome.
    """
    _check_admin(authorization)
    if not payload.emails:
        raise HTTPException(status_code=400, detail="emails list required")
    if len(payload.emails) > 200:
        raise HTTPException(status_code=400, detail="max 200 per batch")

    results = []
    now_iso = datetime.now(timezone.utc).isoformat()
    for email in payload.emails:
        wl = await db.waitlist.find_one({"email": email}, {"_id": 0})
        if not wl:
            results.append({"email": email, "ok": False, "reason": "not on waitlist"})
            continue
        if wl.get("beta_invited_at"):
            results.append({
                "email": email, "ok": True, "skipped": True,
                "code": wl.get("beta_code"), "email_sent": False,
                "reason": "already invited",
            })
            continue
        code = _new_beta_code()
        await db.beta_codes.insert_one({
            "code": code,
            "label": payload.label or "bulk-invite",
            "max_uses": 1,
            "uses": 0,
            "redeemed_by": [],
            "created_at": now_iso,
        })
        sent = await _send_beta_invite_email(email, (wl.get("name") or "").strip() or "friend", code)
        await db.waitlist.update_one(
            {"email": email},
            {"$set": {"beta_invited_at": now_iso, "beta_code": code, "beta_email_sent": sent}},
        )
        results.append({"email": email, "ok": True, "code": code, "email_sent": sent})

    minted = sum(1 for r in results if r.get("code") and not r.get("skipped"))
    sent = sum(1 for r in results if r.get("email_sent"))
    return {"results": results, "minted": minted, "emails_sent": sent, "total": len(results)}


# ---------- Stripe Checkout (one-time + subscription) ----------
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
)

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "")

# Server-defined packages. NEVER trust client-provided amounts.
# Founding-lifetime prices are roughly 50% discount on 12-mo equivalent.
PACKAGES: Dict[str, Dict[str, Any]] = {
    # ---- One-time founding lifetime ----
    "kids_founding": {
        "amount": 99.0, "currency": "usd", "mode": "lifetime",
        "tier": "kids", "label": "Kids · Founding Lifetime",
    },
    "individual_founding": {
        "amount": 199.0, "currency": "usd", "mode": "lifetime",
        "tier": "individual", "label": "Individual · Founding Lifetime",
    },
    "team_founding": {
        "amount": 399.0, "currency": "usd", "mode": "lifetime",
        "tier": "team", "label": "Team · Founding Lifetime (per seat)",
    },
    "professional_founding": {
        "amount": 899.0, "currency": "usd", "mode": "lifetime",
        "tier": "professional", "label": "Professional · Founding Lifetime",
    },
    # ---- Monthly founding (one-time charge — first month locked-in price) ----
    "individual_monthly": {
        "amount": 7.0, "currency": "usd", "mode": "monthly",
        "tier": "individual", "label": "Individual · Founding Monthly",
    },
    "professional_monthly": {
        "amount": 20.0, "currency": "usd", "mode": "monthly",
        "tier": "professional", "label": "Professional · Founding Monthly",
    },
    # ---- Annual founding ----
    "individual_annual": {
        "amount": 70.0, "currency": "usd", "mode": "annual",
        "tier": "individual", "label": "Individual · Founding Annual",
    },
    "professional_annual": {
        "amount": 200.0, "currency": "usd", "mode": "annual",
        "tier": "professional", "label": "Professional · Founding Annual",
    },
    # ---- Beta-cohort upgrade ----
    "beta_upgrade": {
        "amount": 49.0, "currency": "usd", "mode": "beta_upgrade",
        "tier": "beta", "label": "Beta · Lock founding pricing",
    },
}


class CreateCheckoutPayload(BaseModel):
    package_id: str
    origin_url: str  # frontend's window.location.origin, used to build success/cancel URLs
    email: Optional[EmailStr] = None  # optional pre-fill if not logged in


def _stripe(http_request: Request) -> StripeCheckout:
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=503, detail="Stripe is not configured.")
    host_url = str(http_request.base_url).rstrip("/")
    webhook_url = f"{host_url}/api/webhook/stripe"
    return StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)


async def _send_receipt_email(to_email: str, package_label: str, amount: float, currency: str, session_id: str) -> bool:
    redeem_url = "https://page-launch-106.preview.emergentagent.com/beta/redeem"
    amount_fmt = f"${amount:,.2f}"
    html = f"""
    <html><body style="margin:0;padding:0;background:#0a0712;color:#e7e3f2;font-family:Inter,system-ui,sans-serif;">
      <div style="max-width:560px;margin:0 auto;padding:48px 32px;">
        <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#a48fd6;margin:0 0 24px 0;">Receipt · Founding member</p>
        <h1 style="font-family:Georgia,serif;font-size:36px;line-height:1.1;color:#fff;margin:0 0 24px 0;">
          you&rsquo;re <em style="background:linear-gradient(90deg,#5E8BFF,#8A4DFF,#FF6FD3);-webkit-background-clip:text;background-clip:text;color:transparent;font-style:italic;">in</em>.
        </h1>
        <p style="font-size:16px;line-height:1.6;color:#c9c1de;">
          Thank you for becoming a founding member of Let It Go AI. Your founding pricing is now locked for life — even when public pricing rises, yours stays where it is today.
        </p>
        <div style="margin:32px 0;padding:24px;background:rgba(138,77,255,0.08);border:1px solid rgba(138,77,255,0.3);border-radius:16px;">
          <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#a48fd6;">{package_label}</p>
          <p style="margin:0;font-family:Georgia,serif;font-size:28px;color:#fff;">{amount_fmt} <span style="font-size:12px;color:#a48fd6;text-transform:uppercase;letter-spacing:0.2em;">{currency.upper()}</span></p>
        </div>
        <p style="font-size:14px;color:#c9c1de;">
          Your account has been unlocked. Sign in with Google to enter:
        </p>
        <p style="margin:24px 0;">
          <a href="{redeem_url}" style="display:inline-block;padding:14px 28px;background:linear-gradient(90deg,#5E8BFF,#8A4DFF,#FF6FD3);color:#fff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:500;">Enter Let It Go AI →</a>
        </p>
        <p style="font-size:11px;color:#7a6f95;margin-top:48px;">
          Stripe session: <code>{session_id}</code><br/>
          Need help? Reply to this email.<br/>
          — Let It Go AI · made with quiet attention
        </p>
      </div>
    </body></html>
    """
    return await _send_email(to_email, f"you're in — receipt for {package_label}", html)


async def _finalize_payment(session_id: str, http_request: Request) -> Dict[str, Any]:
    """Idempotently flip the user/transaction record to paid + send a receipt.

    Returns a snapshot suitable for the frontend status poller.
    """
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx:
        raise HTTPException(status_code=404, detail="Unknown checkout session.")

    # Already finalized? Return current snapshot (idempotent).
    if tx.get("payment_status") == "paid" and tx.get("finalized"):
        return {
            "status": tx.get("status"),
            "payment_status": "paid",
            "amount": tx.get("amount"),
            "currency": tx.get("currency"),
            "package_id": tx.get("package_id"),
            "metadata": tx.get("metadata", {}),
            "finalized": True,
        }

    # Ask Stripe for the latest status
    status_resp = await _stripe(http_request).get_checkout_status(session_id)
    amount = (status_resp.amount_total or 0) / 100.0
    update = {
        "status": status_resp.status,
        "payment_status": status_resp.payment_status,
        "amount_actual": amount,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }

    finalized = False
    if status_resp.payment_status == "paid" and not tx.get("finalized"):
        # Flip user + send receipt — once.
        update["finalized"] = True
        finalized = True
        email = tx.get("email")
        user_id = tx.get("user_id")
        pkg = PACKAGES.get(tx["package_id"], {})
        now_iso = datetime.now(timezone.utc).isoformat()

        if user_id:
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "is_paid": True,
                    "is_beta_tester": True,  # paid users skip the beta gate
                    "plan_tier": pkg.get("tier"),
                    "plan_mode": pkg.get("mode"),
                    "beta_joined_at": now_iso,
                    "paid_at": now_iso,
                }},
            )
        # Even if no user_id yet, store the entitlement keyed to email so it can be reconciled on first login.
        if email:
            await db.paid_entitlements.update_one(
                {"email": email},
                {"$set": {
                    "email": email,
                    "plan_tier": pkg.get("tier"),
                    "plan_mode": pkg.get("mode"),
                    "session_id": session_id,
                    "amount": amount,
                    "paid_at": now_iso,
                }},
                upsert=True,
            )
            label = pkg.get("label", tx.get("package_id"))
            sent = await _send_receipt_email(email, label, amount, status_resp.currency, session_id)
            update["receipt_sent"] = sent

    await db.payment_transactions.update_one({"session_id": session_id}, {"$set": update})

    return {
        "status": status_resp.status,
        "payment_status": status_resp.payment_status,
        "amount": amount,
        "currency": status_resp.currency,
        "package_id": tx.get("package_id"),
        "metadata": status_resp.metadata or {},
        "finalized": finalized or bool(tx.get("finalized")),
    }


@api_router.get("/payments/packages")
async def list_packages():
    """Public list of purchasable packages (no secret data leaks)."""
    return {
        "packages": [
            {"id": pid, **{k: v for k, v in p.items() if k != "internal"}}
            for pid, p in PACKAGES.items()
        ]
    }


@api_router.post("/payments/checkout/session")
async def create_checkout_session(
    payload: CreateCheckoutPayload,
    http_request: Request,
    authorization: Optional[str] = Header(default=None),
    session_token: Optional[str] = Cookie(default=None, alias="session_token"),
):
    if payload.package_id not in PACKAGES:
        raise HTTPException(status_code=400, detail="Unknown package.")
    pkg = PACKAGES[payload.package_id]

    # Resolve user (optional — anonymous checkout allowed)
    user: Optional[AuthUser] = None
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
    if token:
        user = await _resolve_user_from_token(token)

    customer_email = (user.email if user else payload.email) or None

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/pricing/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/#pricing"

    metadata = {
        "package_id": payload.package_id,
        "tier": pkg.get("tier", ""),
        "mode": pkg.get("mode", ""),
        "user_id": (user.user_id if user else ""),
        "email": customer_email or "",
    }

    checkout_req = CheckoutSessionRequest(
        amount=float(pkg["amount"]),
        currency=pkg["currency"],
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )

    session = await _stripe(http_request).create_checkout_session(checkout_req)

    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "package_id": payload.package_id,
        "amount": float(pkg["amount"]),
        "currency": pkg["currency"],
        "tier": pkg.get("tier"),
        "mode": pkg.get("mode"),
        "user_id": user.user_id if user else None,
        "email": customer_email,
        "status": "initiated",
        "payment_status": "unpaid",
        "metadata": metadata,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "finalized": False,
    })

    return {"url": session.url, "session_id": session.session_id}


@api_router.get("/payments/checkout/status/{session_id}")
async def checkout_status(session_id: str, http_request: Request):
    return await _finalize_payment(session_id, http_request)


@api_router.post("/webhook/stripe")
async def stripe_webhook(http_request: Request):
    body = await http_request.body()
    sig = http_request.headers.get("Stripe-Signature", "")
    try:
        event = await _stripe(http_request).handle_webhook(body, sig)
    except Exception as e:  # noqa: BLE001
        logger.error(f"Stripe webhook signature/parse failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid webhook payload.")

    logger.info(f"Stripe webhook event={event.event_type} session={event.session_id}")

    # Idempotent guard: skip if we've already recorded this event id.
    if event.event_id:
        seen = await db.payment_webhook_events.find_one({"event_id": event.event_id}, {"_id": 0})
        if seen:
            return {"ok": True, "duplicate": True}
        await db.payment_webhook_events.insert_one({
            "event_id": event.event_id,
            "event_type": event.event_type,
            "session_id": event.session_id,
            "received_at": datetime.now(timezone.utc).isoformat(),
        })

    # For paid checkouts, drive the same finalize path the frontend poller uses.
    if event.payment_status == "paid" and event.session_id:
        try:
            await _finalize_payment(event.session_id, http_request)
        except HTTPException as e:
            logger.warning(f"Webhook finalize for {event.session_id} failed: {e.detail}")

    return {"ok": True}


app.include_router(api_router)
