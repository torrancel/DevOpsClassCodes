"""
Backend tests for Let It Go AI MVP — auth + check-ins + regression on waitlist/admin.
Uses Mongo-injection (per /app/auth_testing.md) to bypass Emergent OAuth.
"""
import os
import time
import uuid
import pytest
import requests
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://page-launch-106.preview.emergentagent.com").rstrip("/")
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")
ADMIN_TOKEN = "Dx4d1IIhLTg5Ct_luV9Frd3XACckoJi5iufadpC8D6lYc6P4MEZj1w"

mc = MongoClient(MONGO_URL)
db = mc[DB_NAME]


def _make_user(prefix="A"):
    uid = f"test-user-{prefix}-{uuid.uuid4().hex[:8]}"
    tok = f"test_session_{prefix}_{uuid.uuid4().hex}"
    db.users.insert_one({
        "user_id": uid,
        "email": f"TEST_{uid}@example.com",
        "name": f"Test User {prefix}",
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    db.user_sessions.insert_one({
        "user_id": uid,
        "session_token": tok,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return uid, tok


@pytest.fixture(scope="module")
def user_a():
    uid, tok = _make_user("A")
    yield uid, tok
    db.users.delete_many({"user_id": uid})
    db.user_sessions.delete_many({"user_id": uid})
    db.checkins.delete_many({"user_id": uid})


@pytest.fixture(scope="module")
def user_b():
    uid, tok = _make_user("B")
    yield uid, tok
    db.users.delete_many({"user_id": uid})
    db.user_sessions.delete_many({"user_id": uid})
    db.checkins.delete_many({"user_id": uid})


def H(tok):
    return {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"}


# --------- AUTH ---------
class TestAuth:
    def test_me_unauth_returns_401(self):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_bearer(self, user_a):
        uid, tok = user_a
        r = requests.get(f"{BASE_URL}/api/auth/me", headers=H(tok))
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user_id"] == uid
        assert data["email"].startswith("TEST_")
        assert "name" in data

    def test_me_with_cookie(self, user_a):
        uid, tok = user_a
        r = requests.get(f"{BASE_URL}/api/auth/me", cookies={"session_token": tok})
        assert r.status_code == 200
        assert r.json()["user_id"] == uid

    def test_me_invalid_token(self):
        r = requests.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
        assert r.status_code == 401

    def test_session_invalid_id_rejected(self):
        # Without a real OAuth session_id from Emergent, this must 401/502
        r = requests.post(f"{BASE_URL}/api/auth/session", json={"session_id": "bogus_session_id_for_testing"})
        assert r.status_code in (401, 502), r.text

    def test_logout_clears_session(self):
        # Build a throwaway user/session, logout, verify gone
        uid, tok = _make_user("LOGOUT")
        try:
            # confirm valid first
            assert requests.get(f"{BASE_URL}/api/auth/me", headers=H(tok)).status_code == 200
            r = requests.post(f"{BASE_URL}/api/auth/logout", headers=H(tok))
            assert r.status_code == 200
            assert r.json().get("ok") is True
            # token should now be unrecognized
            assert requests.get(f"{BASE_URL}/api/auth/me", headers=H(tok)).status_code == 401
        finally:
            db.users.delete_many({"user_id": uid})
            db.user_sessions.delete_many({"user_id": uid})


# --------- CHECK-INS ---------
class TestCheckins:
    def test_checkins_unauth(self):
        assert requests.get(f"{BASE_URL}/api/checkins").status_code == 401
        assert requests.get(f"{BASE_URL}/api/checkins/latest").status_code == 401
        assert requests.post(f"{BASE_URL}/api/checkins", json={
            "calm": 50, "focus": 50, "stress": 50, "anxiety": 50, "depression": 50, "warmth": 50
        }).status_code == 401

    def test_latest_empty(self, user_a):
        _, tok = user_a
        # ensure no prior checkins for this user
        db.checkins.delete_many({"user_id": user_a[0]})
        r = requests.get(f"{BASE_URL}/api/checkins/latest", headers=H(tok))
        assert r.status_code == 200
        assert r.json() == {"latest": None}

    def test_create_checkin_computes_eq_and_returns_record(self, user_a):
        uid, tok = user_a
        payload = {
            "calm": 70, "focus": 65, "stress": 30, "anxiety": 25, "depression": 20,
            "warmth": 80, "reflection": "Calm morning."
        }
        r = requests.post(f"{BASE_URL}/api/checkins", headers=H(tok), json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        # Composite: positive=71.67, negative=25, score=(46.67+100)/2=73.33 -> 73
        assert data["eq"] == 73, f"Expected eq=73, got {data['eq']}"
        assert data["user_id"] == uid
        assert data["reflection"] == "Calm morning."
        assert isinstance(data["suggestion"], str) and len(data["suggestion"]) > 0
        assert data["calm"] == 70 and data["warmth"] == 80

    def test_list_checkins_only_owned(self, user_a, user_b):
        uid_a, tok_a = user_a
        uid_b, tok_b = user_b
        # B creates its own check-in
        r = requests.post(f"{BASE_URL}/api/checkins", headers=H(tok_b), json={
            "calm": 10, "focus": 10, "stress": 90, "anxiety": 90, "depression": 90, "warmth": 10
        }, timeout=60)
        assert r.status_code == 200
        b_id = r.json()["id"]
        # A lists -> should NOT contain B's checkin
        ra = requests.get(f"{BASE_URL}/api/checkins?days=30", headers=H(tok_a))
        assert ra.status_code == 200
        ids_a = {c["id"] for c in ra.json()}
        assert b_id not in ids_a
        for c in ra.json():
            assert c["user_id"] == uid_a
        # B sees its own
        rb = requests.get(f"{BASE_URL}/api/checkins?days=30", headers=H(tok_b))
        assert rb.status_code == 200
        assert any(c["id"] == b_id for c in rb.json())

    def test_latest_returns_most_recent(self, user_a):
        uid, tok = user_a
        # post a new one, then latest should match
        r = requests.post(f"{BASE_URL}/api/checkins", headers=H(tok), json={
            "calm": 55, "focus": 55, "stress": 45, "anxiety": 45, "depression": 45, "warmth": 55
        }, timeout=60)
        assert r.status_code == 200
        new_id = r.json()["id"]
        lr = requests.get(f"{BASE_URL}/api/checkins/latest", headers=H(tok))
        assert lr.status_code == 200
        latest = lr.json()["latest"]
        assert latest is not None
        assert latest["id"] == new_id

    def test_validation_out_of_range(self, user_a):
        _, tok = user_a
        r = requests.post(f"{BASE_URL}/api/checkins", headers=H(tok), json={
            "calm": 150, "focus": 50, "stress": 50, "anxiety": 50, "depression": 50, "warmth": 50
        })
        assert r.status_code == 422


# --------- REGRESSIONS ---------
class TestRegressions:
    def test_waitlist_count(self):
        r = requests.get(f"{BASE_URL}/api/waitlist/count")
        assert r.status_code == 200
        d = r.json()
        assert "count" in d and isinstance(d["count"], int)
        assert "by_audience" in d

    def test_waitlist_create_idempotent(self):
        email = f"TEST_{uuid.uuid4().hex[:8]}@example.com"
        r1 = requests.post(f"{BASE_URL}/api/waitlist", json={"email": email, "audience": "individual", "source": "test"})
        assert r1.status_code == 200
        id1 = r1.json()["id"]
        r2 = requests.post(f"{BASE_URL}/api/waitlist", json={"email": email, "audience": "individual", "source": "test"})
        assert r2.status_code == 200
        assert r2.json()["id"] == id1
        # cleanup
        db.waitlist.delete_many({"email": email.lower()})

    def test_admin_analytics_requires_token(self):
        r = requests.get(f"{BASE_URL}/api/admin/analytics")
        assert r.status_code == 401
        r2 = requests.get(f"{BASE_URL}/api/admin/analytics", headers={"Authorization": "Bearer wrong"})
        assert r2.status_code == 403

    def test_admin_analytics_with_token(self):
        r = requests.get(f"{BASE_URL}/api/admin/analytics", headers={"Authorization": f"Bearer {ADMIN_TOKEN}"})
        assert r.status_code == 200
        d = r.json()
        for k in ("total", "emailed", "by_audience", "by_source", "by_platform", "timeline", "recent"):
            assert k in d

    def test_root(self):
        r = requests.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
