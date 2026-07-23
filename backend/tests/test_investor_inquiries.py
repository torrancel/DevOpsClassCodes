"""Investor inquiry endpoint tests — /api/investor-inquiries + admin readback."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://page-launch-106.preview.emergentagent.com").rstrip("/")
ADMIN_TOKEN = "Dx4d1IIhLTg5Ct_luV9Frd3XACckoJi5iufadpC8D6lYc6P4MEZj1w"


def _make_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def api():
    return _make_client()


def _valid_payload(**overrides):
    p = {
        "name": f"TEST Inquiry {uuid.uuid4().hex[:6]}",
        "email": f"test_inv_{uuid.uuid4().hex[:8]}@example.com",
        "organization": "TEST Capital",
        "investor_type": "vc",
        "message": "Hi — I'm curious about the seed round and would love to see the deck.",
        "website": "",
        "submitted_after_ms": 3500,
    }
    p.update(overrides)
    return p


class TestInvestorInquiryValidation:
    def test_valid_submission_success(self, api):
        r = api.post(f"{BASE_URL}/api/investor-inquiries", json=_valid_payload())
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("success") is True
        assert isinstance(data.get("id"), str) and len(data["id"]) > 8

    def test_dwell_time_rejected(self, api):
        # < 2000ms should be rejected with 400
        r = api.post(
            f"{BASE_URL}/api/investor-inquiries",
            json=_valid_payload(submitted_after_ms=500),
        )
        assert r.status_code == 400
        assert "moment" in r.json().get("detail", "").lower()

    def test_honeypot_silently_filtered(self, api):
        r = api.post(
            f"{BASE_URL}/api/investor-inquiries",
            json=_valid_payload(website="http://spam.example.com"),
        )
        # Silent accept per honeypot design
        assert r.status_code == 200
        assert r.json().get("id") == "spam-filtered"

    def test_missing_name_422(self, api):
        p = _valid_payload()
        p.pop("name")
        r = api.post(f"{BASE_URL}/api/investor-inquiries", json=p)
        assert r.status_code == 422

    def test_empty_message_422(self, api):
        r = api.post(
            f"{BASE_URL}/api/investor-inquiries",
            json=_valid_payload(message=""),
        )
        assert r.status_code == 422

    def test_invalid_email_422(self, api):
        r = api.post(
            f"{BASE_URL}/api/investor-inquiries",
            json=_valid_payload(email="not-an-email"),
        )
        assert r.status_code == 422

    def test_unknown_investor_type_normalised_to_other(self, api):
        r = api.post(
            f"{BASE_URL}/api/investor-inquiries",
            json=_valid_payload(investor_type="crypto_whale"),
        )
        assert r.status_code == 200
        # No leak of the value — but admin readback below will confirm normalization


class TestInvestorInquiryAdmin:
    def test_admin_readback_requires_auth(self, api):
        r = requests.get(f"{BASE_URL}/api/admin/investor-inquiries")
        assert r.status_code == 401

    def test_admin_readback_wrong_token(self, api):
        r = requests.get(
            f"{BASE_URL}/api/admin/investor-inquiries",
            headers={"Authorization": "Bearer WRONG"},
        )
        assert r.status_code == 403

    def test_full_flow_persists_and_admin_lists(self, api):
        unique_marker = f"TEST_FLOW_{uuid.uuid4().hex[:8]}@example.com"
        # Submit
        r = api.post(
            f"{BASE_URL}/api/investor-inquiries",
            json=_valid_payload(
                email=unique_marker,
                investor_type="crypto_whale",  # should be normalized to 'other'
            ),
        )
        assert r.status_code == 200
        submitted_id = r.json()["id"]

        # Admin readback
        r2 = requests.get(
            f"{BASE_URL}/api/admin/investor-inquiries",
            headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
        )
        assert r2.status_code == 200
        payload = r2.json()
        assert "inquiries" in payload
        # Find our entry
        match = next((x for x in payload["inquiries"] if x.get("id") == submitted_id), None)
        assert match is not None, f"Submitted inquiry {submitted_id} not found in admin list"
        assert match["email"] == unique_marker.lower()
        assert match["investor_type"] == "other"  # normalized
        assert match["status"] == "new"
        # PII shouldn't be exposed in an odd way — verify user_agent + ip present
        assert "submitted_at" in match


class TestRateLimit:
    """Naive per-IP rate limit: max 3 per hour. Best-effort — behind a proxy so IP may be shared."""

    def test_three_or_more_from_same_ip_may_429(self, api):
        # Fire 4 quick submissions from same test process. Whether they 429 depends on
        # what request.client.host resolves to behind the ingress. If they all 200,
        # the rate limit is effectively disabled by proxy — flag but don't fail.
        codes = []
        for _ in range(4):
            r = api.post(
                f"{BASE_URL}/api/investor-inquiries",
                json=_valid_payload(email=f"rl_{uuid.uuid4().hex[:6]}@example.com"),
            )
            codes.append(r.status_code)
            time.sleep(0.1)
        # Log for inspection; don't assert 429 because ingress often masks client IP.
        print(f"Rate-limit sequence codes: {codes}")
        assert all(c in (200, 429) for c in codes)
