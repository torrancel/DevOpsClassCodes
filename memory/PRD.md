# Let It Go AI — PRD (running)

## What the app is
"Let It Go AI" — an Emotional Intelligence Operating System. Brand: dark cosmic, infinity-glow logo, gradient blue→violet→pink. Founder-led brand voice.

## Surfaces shipped
### Marketing (public)
- `/` main landing — 13 i18n sections
- `/doctors`, `/attorneys`, `/teachers`, `/managers` — i18n-driven via `t("profession.<slug>.*")`
- `/beta` — beta program landing + apply form (public)
- `/founder` — Torrance Lillie's founder letter (long-form, hard-coded English; ready for i18n later)
- 12-language i18n with auto-RTL for Arabic; localStorage key `letitgo_lang`
- Founding-member specials + Apple/Wear OS capture
- Waitlist + Resend confirmation emails

### Product (authenticated)
- `/app` dashboard — EQ tile, 30-day Recharts trend, recent check-ins; gated by BetaGate
- `/app/check-in` — 6 mood sliders + reflection + Claude AI co-regulation
- Ambience panel — procedural Web Audio (rain 0.32, ocean 0.42+LFO, forest 0.28, breath)
- Auth: Emergent-managed Google sign-in
- BETA badge in header + floating feedback widget (visible only to beta testers)

### Beta program (Feb 2026)
- `/beta` public apply form
- `/beta/redeem` flips `is_beta_tester=true` on user record
- BetaGate wraps /app and /app/check-in — non-beta users see redeem/apply CTA
- Floating feedback widget on /app submits to `beta_feedback`
- `/admin/beta` (bearer-token gated):
  - Stats grid (4 KPIs)
  - Mint codes (N codes with optional label)
  - Invite by email (single hand-pick)
  - **Pick from waitlist** — bulk invite N waitlist members with audience filter, select-all-uninvited, deduplication, cohort label, idempotent
  - Applications queue (approve/deny)
  - Codes table (copy)
  - Feedback inbox

### Admin
- `/admin/analytics` — KPIs, audience/source charts, recent signups
- `/admin/beta` — beta cohort control room with bulk-from-waitlist

## Integrations
- Resend (waitlist confirmation + beta invite/approval emails)
- Emergent Google OAuth
- Emergent LLM (Claude Sonnet 4.5) for check-in + translations
- MongoDB collections: users, user_sessions, checkins, waitlist, beta_codes, beta_applications, beta_feedback

## Backend endpoints (Feb 2026)
### Beta program (13 endpoints)
- `POST /api/beta/apply` (public)
- `GET /api/beta/status` (auth)
- `POST /api/beta/redeem` (auth)
- `POST /api/beta/feedback` (auth, beta-only)
- `POST /api/admin/beta/codes` (admin)
- `GET /api/admin/beta/codes` (admin)
- `GET /api/admin/beta/applications` (admin)
- `POST /api/admin/beta/applications/{id}/approve` (admin)
- `POST /api/admin/beta/applications/{id}/deny` (admin)
- `POST /api/admin/beta/invite` (admin · single hand-pick)
- `GET /api/admin/beta/feedback` (admin)
- `GET /api/admin/beta/stats` (admin)
- `GET /api/admin/beta/waitlist-candidates` (admin) — lists all waitlist with invite status
- `POST /api/admin/beta/bulk-invite-waitlist` (admin) — bulk mint + email + mark invited

## i18n status
- Fully translated (18/18): en, ar, de, es, fr, it, pt-BR
- Partially translated (profession + admin fall back to en): hi, ja, ko, ru, zh-CN
- Blocked: Emergent LLM key budget. Resume with `python3 /app/scripts/translate_locales.py hi ja ko ru zh-CN`

## Test reports
iterations 1–12 in /app/test_reports. iter_12 (beta program): 18/18 new backend + 25/25 regression + 100% frontend. Bulk-invite-from-waitlist verified E2E (UI screenshot + curl): code `CQUESS` minted for `e2e_bulk_1781904023@example.com`, row updated, idempotent rerun skipped.

## Remaining backlog
### P1
- Manually verify ambient audio quality via real Google login
- Top up Emergent LLM budget → run translator for hi/ja/ko/ru/zh-CN
- Localized invite emails (branch by `lng` on user/waitlist record)
- i18n keys for /beta, /beta/redeem, /admin/beta surfaces

### P2
- Split `server.py` (1020+ lines) into `routes/` modules
- Mongo unique index on user_sessions.session_token + beta_codes.code
- Per-state ambience memory
- Cron reminder emails for check-ins
- Stripe pre-order for founding rank
- `missingKeyHandler` in i18n.js
- Bulk-invite progress bar/streaming for cohorts > 50 (currently sequential)

## Files of note (Feb 2026)
- /app/backend/server.py — beta endpoints lines ~400–730
- /app/frontend/src/contexts/BetaContext.jsx
- /app/frontend/src/components/beta/{BetaGate,BetaBadge,BetaFeedbackWidget}.jsx
- /app/frontend/src/pages/{BetaLanding,BetaRedeem,AdminBeta}.jsx
- /app/backend/tests/test_beta.py (testing-agent-generated regression)
