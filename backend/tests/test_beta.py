"""Backend tests for /api/beta and /api/admin/beta endpoints (iteration 12).

Coverage:
- POST /api/beta/apply: new submission, idempotent duplicate, invalid email.
- POST /api/beta/redeem: requires auth (401), unknown code (404 when authed - not tested here).
- POST /api/beta/feedback: requires auth (401).
- Admin endpoints (Bearer token): mint codes, list codes, list applications,
  approve, deny, invite, feedback list, stats.
"""
import os
import uuid
import pytest
import requests

BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or "https://page-launch-106.preview.emergentagent.com").rstrip("/")

ADMIN_TOKEN = "Dx4d1IIhLTg5Ct_luV9Frd3XACckoJi5iufadpC8D6lYc6P4MEZj1w"
AUTH_HEADERS = {"Authorization": f"Bearer {ADMIN_TOKEN}"}


def _rand_email(prefix="TEST"):
    return f"{prefix}_{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# -------- /api/beta/apply --------
class TestBetaApply:
    def test_apply_valid_returns_ok_and_not_already_applied(self, session):
        email = _rand_email("BETAAPP")
        r = session.post(f"{BASE_URL}/api/beta/apply", json={
            "email": email,
            "name": "Test User",
            "role": "engineer",
            "why": "I want to try it",
        }, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert data["already_applied"] is False
        assert data["status"] == "pending"

    def test_apply_duplicate_is_idempotent(self, session):
        email = _rand_email("BETADUP")
        payload = {"email": email, "name": "Dup", "role": "designer", "why": "again"}
        r1 = session.post(f"{BASE_URL}/api/beta/apply", json=payload, timeout=20)
        r2 = session.post(f"{BASE_URL}/api/beta/apply", json=payload, timeout=20)
        assert r1.status_code == 200 and r2.status_code == 200, (r1.text, r2.text)
        assert r1.json()["already_applied"] is False
        assert r2.json()["already_applied"] is True

    def test_apply_invalid_email_returns_422(self, session):
        r = session.post(f"{BASE_URL}/api/beta/apply", json={
            "email": "not-an-email",
            "name": "X",
            "role": "x",
            "why": "x",
        }, timeout=20)
        assert r.status_code == 422


# -------- /api/beta/redeem (auth required) --------
class TestBetaRedeemAuth:
    def test_redeem_without_auth_returns_401(self, session):
        r = session.post(f"{BASE_URL}/api/beta/redeem", json={"code": "AAAAAA"}, timeout=15)
        assert r.status_code == 401, f"expected 401, got {r.status_code}: {r.text}"

    def test_status_without_auth_returns_401(self, session):
        r = session.get(f"{BASE_URL}/api/beta/status", timeout=15)
        assert r.status_code == 401, r.text


# -------- /api/beta/feedback (auth required) --------
class TestBetaFeedbackAuth:
    def test_feedback_without_auth_returns_401(self, session):
        r = session.post(f"{BASE_URL}/api/beta/feedback", json={
            "message": "great", "rating": 5, "category": "bug"
        }, timeout=15)
        assert r.status_code == 401


# -------- Admin: mint and list codes --------
class TestAdminCodes:
    def test_mint_3_codes(self, session):
        r = session.post(f"{BASE_URL}/api/admin/beta/codes",
                         json={"count": 3, "max_uses": 1},
                         headers=AUTH_HEADERS, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert len(data["codes"]) == 3
        for c in data["codes"]:
            assert "code" in c
            assert len(c["code"]) == 6
            assert c["max_uses"] == 1

    def test_mint_1_code_with_label(self, session):
        r = session.post(f"{BASE_URL}/api/admin/beta/codes",
                         json={"count": 1, "max_uses": 1, "label": "TEST_label_iter12"},
                         headers=AUTH_HEADERS, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert len(data["codes"]) == 1
        assert data["codes"][0]["label"] == "TEST_label_iter12"

    def test_mint_unauthorized_returns_401_or_403(self, session):
        r = session.post(f"{BASE_URL}/api/admin/beta/codes",
                         json={"count": 1}, timeout=15)
        assert r.status_code in (401, 403), r.text

    def test_list_codes(self, session):
        r = session.get(f"{BASE_URL}/api/admin/beta/codes",
                        headers=AUTH_HEADERS, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "codes" in data
        assert isinstance(data["codes"], list)
        assert len(data["codes"]) >= 4  # we just minted at least 4
        sample = data["codes"][0]
        for k in ("code", "max_uses", "uses", "created_at"):
            assert k in sample


# -------- Admin: applications, approve, deny --------
class TestAdminApplications:
    @pytest.fixture(scope="class")
    def seeded_app_id(self, session):
        """Create a fresh application we can approve in a separate test."""
        email = _rand_email("BETAAPPROVE")
        r = session.post(f"{BASE_URL}/api/beta/apply", json={
            "email": email, "name": "Approve Me", "role": "founder", "why": "pls"
        }, timeout=20)
        assert r.status_code == 200
        # find this app id from admin list
        r2 = session.get(f"{BASE_URL}/api/admin/beta/applications",
                         headers=AUTH_HEADERS, timeout=20)
        assert r2.status_code == 200
        for row in r2.json()["applications"]:
            if row["email"] == email:
                return row["id"]
        pytest.fail("Could not find seeded application id")

    @pytest.fixture(scope="class")
    def seeded_deny_id(self, session):
        email = _rand_email("BETADENY")
        session.post(f"{BASE_URL}/api/beta/apply", json={
            "email": email, "name": "Deny Me", "role": "x", "why": "x"
        }, timeout=20)
        r = session.get(f"{BASE_URL}/api/admin/beta/applications",
                        headers=AUTH_HEADERS, timeout=20)
        for row in r.json()["applications"]:
            if row["email"] == email:
                return row["id"]
        pytest.fail("Could not find seeded deny application id")

    def test_list_applications(self, session):
        r = session.get(f"{BASE_URL}/api/admin/beta/applications",
                        headers=AUTH_HEADERS, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        for k in ("applications", "pending", "total"):
            assert k in data
        assert isinstance(data["applications"], list)
        if data["applications"]:
            sample = data["applications"][0]
            for k in ("id", "email", "status", "created_at"):
                assert k in sample

    def test_approve_application(self, session, seeded_app_id):
        r = session.post(
            f"{BASE_URL}/api/admin/beta/applications/{seeded_app_id}/approve",
            headers=AUTH_HEADERS, timeout=30,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert "code" in data and len(data["code"]) == 6
        assert "email_sent" in data
        assert isinstance(data["email_sent"], bool)
        # Re-fetch to verify status update
        r2 = session.get(f"{BASE_URL}/api/admin/beta/applications",
                         headers=AUTH_HEADERS, timeout=20)
        found = next((a for a in r2.json()["applications"] if a["id"] == seeded_app_id), None)
        assert found is not None
        assert found["status"] == "approved"
        assert found["code"] == data["code"]

    def test_deny_application(self, session, seeded_deny_id):
        r = session.post(
            f"{BASE_URL}/api/admin/beta/applications/{seeded_deny_id}/deny",
            headers=AUTH_HEADERS, timeout=20,
        )
        assert r.status_code == 200, r.text
        assert r.json()["ok"] is True
        r2 = session.get(f"{BASE_URL}/api/admin/beta/applications",
                         headers=AUTH_HEADERS, timeout=20)
        found = next((a for a in r2.json()["applications"] if a["id"] == seeded_deny_id), None)
        assert found is not None
        assert found["status"] == "denied"

    def test_approve_unknown_id_returns_404(self, session):
        r = session.post(
            f"{BASE_URL}/api/admin/beta/applications/nope-{uuid.uuid4().hex}/approve",
            headers=AUTH_HEADERS, timeout=20,
        )
        assert r.status_code == 404


# -------- Admin invite (mint+email) --------
class TestAdminInvite:
    def test_invite_mints_code(self, session):
        email = _rand_email("BETAINV")
        r = session.post(f"{BASE_URL}/api/admin/beta/invite",
                         json={"email": email, "name": "Friend"},
                         headers=AUTH_HEADERS, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert len(data["code"]) == 6
        assert isinstance(data["email_sent"], bool)


# -------- Admin feedback + stats --------
class TestAdminFeedbackAndStats:
    def test_list_feedback(self, session):
        r = session.get(f"{BASE_URL}/api/admin/beta/feedback",
                        headers=AUTH_HEADERS, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "feedback" in data
        assert "total" in data
        assert isinstance(data["feedback"], list)

    def test_stats_shape(self, session):
        r = session.get(f"{BASE_URL}/api/admin/beta/stats",
                        headers=AUTH_HEADERS, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        for k in ("total_codes", "redeemed_codes", "total_testers",
                  "applications_total", "applications_pending",
                  "applications_approved", "feedback_total", "feedback_by_category"):
            assert k in data, f"missing key {k}"
            if k != "feedback_by_category":
                assert isinstance(data[k], int)
        assert isinstance(data["feedback_by_category"], list)


# -------- Redeem error path (with mock auth header) --------
# Cannot test happy-path (real Google session), but we can verify auth gate.
class TestRedeemErrorPaths:
    def test_redeem_with_invalid_session_returns_401(self, session):
        r = session.post(f"{BASE_URL}/api/beta/redeem",
                         json={"code": "ZZZZZZ"},
                         headers={"Authorization": "Bearer not-a-real-token"},
                         timeout=15)
        assert r.status_code == 401
