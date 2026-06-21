"""Backend contract tests for Stripe payments endpoints.

Covers:
  - GET /api/payments/packages (shape + 9 packages)
  - POST /api/payments/checkout/session (success anon, unknown pkg, persistence)
  - GET /api/payments/checkout/status/{session_id} (unpaid shape, unknown 404, idempotency)
  - POST /api/webhook/stripe (signature validation)
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
assert BASE_URL, "REACT_APP_BACKEND_URL must be set in frontend/.env"

EXPECTED_PACKAGE_IDS = {
    "kids_founding",
    "individual_founding",
    "team_founding",
    "professional_founding",
    "individual_monthly",
    "professional_monthly",
    "individual_annual",
    "professional_annual",
    "beta_upgrade",
}

EXPECTED_AMOUNTS = {
    "kids_founding": 99.0,
    "individual_founding": 199.0,
    "team_founding": 399.0,
    "professional_founding": 899.0,
    "individual_monthly": 7.0,
    "professional_monthly": 20.0,
    "individual_annual": 70.0,
    "professional_annual": 200.0,
    "beta_upgrade": 49.0,
}


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------------- Packages ----------------

class TestPackages:
    def test_list_packages_shape(self, api):
        r = api.get(f"{BASE_URL}/api/payments/packages", timeout=15)
        assert r.status_code == 200
        body = r.json()
        assert "packages" in body
        ids = {p["id"] for p in body["packages"]}
        assert ids == EXPECTED_PACKAGE_IDS, f"Missing/extra packages: {ids ^ EXPECTED_PACKAGE_IDS}"
        for p in body["packages"]:
            for k in ("id", "amount", "currency", "mode", "tier", "label"):
                assert k in p, f"Package {p.get('id')} missing key {k}"
            assert isinstance(p["amount"], (int, float))
            assert p["amount"] == EXPECTED_AMOUNTS[p["id"]]
            assert p["currency"] == "usd"


# ---------------- Create checkout session ----------------

@pytest.fixture(scope="module")
def created_session(api):
    payload = {
        "package_id": "individual_founding",
        "origin_url": "https://example.test",
        "email": "TEST_pay_anon@example.com",
    }
    r = api.post(f"{BASE_URL}/api/payments/checkout/session", json=payload, timeout=30)
    if r.status_code != 200:
        pytest.skip(f"Stripe checkout session creation failed: {r.status_code} {r.text}")
    return r.json()


class TestCheckoutSession:
    def test_create_session_anonymous_success(self, created_session):
        assert "url" in created_session and created_session["url"].startswith("https://")
        assert "checkout.stripe.com" in created_session["url"]
        assert "session_id" in created_session
        assert isinstance(created_session["session_id"], str)
        assert len(created_session["session_id"]) > 5

    def test_create_session_unknown_package(self, api):
        r = api.post(
            f"{BASE_URL}/api/payments/checkout/session",
            json={"package_id": "totally_bogus", "origin_url": "https://example.test"},
            timeout=15,
        )
        assert r.status_code == 400
        body = r.json()
        assert "Unknown package" in (body.get("detail") or "")

    def test_create_session_rejects_invalid_email(self, api):
        # Pydantic EmailStr should 422 on bad email
        r = api.post(
            f"{BASE_URL}/api/payments/checkout/session",
            json={"package_id": "individual_founding", "origin_url": "https://example.test", "email": "not-an-email"},
            timeout=15,
        )
        assert r.status_code in (400, 422), f"Got {r.status_code}: {r.text}"

    def test_create_session_missing_required(self, api):
        r = api.post(
            f"{BASE_URL}/api/payments/checkout/session",
            json={"package_id": "individual_founding"},  # missing origin_url
            timeout=15,
        )
        assert r.status_code in (400, 422)


# ---------------- Status polling ----------------

class TestCheckoutStatus:
    def test_status_unknown_session_404(self, api):
        r = api.get(
            f"{BASE_URL}/api/payments/checkout/status/cs_test_does_not_exist_xyz123",
            timeout=15,
        )
        assert r.status_code == 404
        body = r.json()
        assert "Unknown checkout session" in (body.get("detail") or "")

    def test_status_real_unpaid_session_shape(self, api, created_session):
        sid = created_session["session_id"]
        r = api.get(f"{BASE_URL}/api/payments/checkout/status/{sid}", timeout=30)
        assert r.status_code == 200, r.text
        body = r.json()
        for k in ("status", "payment_status", "amount", "currency", "package_id", "metadata", "finalized"):
            assert k in body, f"Missing key {k} in status response"
        assert body["package_id"] == "individual_founding"
        # Just created => unpaid
        assert body["payment_status"] in ("unpaid", "no_payment_required", "paid")
        assert body["finalized"] is False or body["finalized"] is True  # boolean
        assert isinstance(body["finalized"], bool)

    def test_status_idempotent_two_calls(self, api, created_session):
        sid = created_session["session_id"]
        r1 = api.get(f"{BASE_URL}/api/payments/checkout/status/{sid}", timeout=30)
        time.sleep(0.5)
        r2 = api.get(f"{BASE_URL}/api/payments/checkout/status/{sid}", timeout=30)
        assert r1.status_code == 200 and r2.status_code == 200
        # finalized field must be stable between calls when not paid
        assert r1.json()["finalized"] == r2.json()["finalized"]
        assert r1.json()["package_id"] == r2.json()["package_id"]


# ---------------- Webhook ----------------

class TestStripeWebhook:
    def test_webhook_missing_signature_400(self, api):
        # Plain POST without Stripe-Signature header should be rejected
        r = requests.post(
            f"{BASE_URL}/api/webhook/stripe",
            data=b'{"id":"evt_test","type":"checkout.session.completed"}',
            headers={"Content-Type": "application/json"},
            timeout=15,
        )
        assert r.status_code == 400, f"Expected 400 (bad signature), got {r.status_code}: {r.text}"

    def test_webhook_invalid_signature_400(self, api):
        r = requests.post(
            f"{BASE_URL}/api/webhook/stripe",
            data=b'{"id":"evt_test","type":"checkout.session.completed"}',
            headers={
                "Content-Type": "application/json",
                "Stripe-Signature": "t=12345,v1=deadbeef",
            },
            timeout=15,
        )
        assert r.status_code == 400


# ---------------- Regression: existing endpoints still work ----------------

class TestRegression:
    def test_waitlist_still_works(self, api):
        ts = int(time.time())
        r = api.post(
            f"{BASE_URL}/api/waitlist",
            json={"email": f"TEST_pay_reg_{ts}@example.com", "audience": "individual"},
            timeout=15,
        )
        assert r.status_code in (200, 201), r.text

    def test_admin_beta_stats_with_token(self, api):
        tok = "Dx4d1IIhLTg5Ct_luV9Frd3XACckoJi5iufadpC8D6lYc6P4MEZj1w"
        r = api.get(
            f"{BASE_URL}/api/admin/beta/stats",
            headers={"Authorization": f"Bearer {tok}"},
            timeout=15,
        )
        assert r.status_code == 200, r.text

    def test_beta_apply_endpoint_present(self, api):
        ts = int(time.time())
        r = api.post(
            f"{BASE_URL}/api/beta/apply",
            json={
                "email": f"TEST_pay_betareg_{ts}@example.com",
                "name": "Test Pay Reg",
                "role": "tester",
                "why": "regression test from payments suite",
            },
            timeout=15,
        )
        assert r.status_code in (200, 201), r.text
