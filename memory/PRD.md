# Let It Go AI — PRD (running)

## What the app is
"Let It Go AI" — an Emotional Intelligence Operating System. Brand: dark cosmic, infinity-glow logo, gradient blue→violet→pink. Founder-led brand voice.

## Surfaces shipped
### Marketing (public)
- `/` main landing — 13 i18n sections (nav, hero, marquee, problem, modules, demo, wearable, use-cases, testimonials, manifesto, pricing, FAQ, CTA, footer)
- Profession landings: `/doctors`, `/attorneys`, `/teachers`, `/managers` — fully i18n via `t("profession.<slug>.*")`
- `/beta` — beta program landing + apply form (public)
- 12-language i18n with auto-RTL for Arabic; localStorage key `letitgo_lang`
- Founding-member specials with live counters per audience
- Apple Watch / Wear OS section + platform capture
- Waitlist + Resend confirmation emails

### Product (authenticated)
- `/app` dashboard — EQ tile, 30-day Recharts trend, recent check-ins, user picture/name, logout; gated by BetaGate
- `/app/check-in` — 6 mood sliders + reflection textarea + AI co-regulation (Claude Sonnet 4.5)
- Ambience panel — procedural Web Audio (rain 0.32, ocean 0.42 + LFO, forest 0.28, breath) + color-mood overlays
- Auth: Emergent-managed Google sign-in
- BETA badge in header + floating feedback widget (visible only to beta testers)

### Beta program (Feb 2026)
- `/beta` public apply form (email/name/role/why) → `beta_applications` collection
- `/beta/redeem` → POST /api/beta/redeem flips `is_beta_tester=true` on user record
- BetaGate wraps /app and /app/check-in — non-beta users see redeem/apply CTA
- Floating feedback widget on /app submits to `beta_feedback`
- `/admin/beta` (bearer-token gated) — mint codes, hand-pick invite by email, approve/deny applications, list codes/feedback, KPI stats
- Resend HTML email on admin approve + admin invite with the 6-char code

### Admin
- `/admin/analytics` — KPIs, audience/source charts, recent signups
- `/admin/beta` — beta cohort control room

## Integrations
- Resend (transactional waitlist confirmation + beta invite/approval emails)
- Emergent Google OAuth
- Emergent LLM (Claude Sonnet 4.5) for check-in suggestions + locale translation
- MongoDB collections: users, user_sessions, checkins, waitlist, beta_codes, beta_applications, beta_feedback

## i18n status (Feb 2026)
- Fully translated (18/18 sections): en, ar, de, es, fr, it, pt-BR
- Partially translated (hero/marquee/etc done; profession + admin fall back to English): hi, ja, ko, ru, zh-CN
- Blocked by Emergent LLM key budget. Top up + rerun `python3 /app/scripts/translate_locales.py hi ja ko ru zh-CN`

## Test reports
iterations 1–12 in /app/test_reports. iter_12 (beta program): 18/18 new backend tests pass, 25/25 waitlist regression pass, 100% frontend across 8 routes, zero console errors.

## Remaining backlog
### P1
- Top up Emergent LLM budget → run translator for hi/ja/ko/ru/zh-CN
- Manually verify ambient audio quality via real Google login on /app
- Localized confirmation/beta-invite emails (capture user's lng on apply, branch templates)

### P2
- Split `server.py` (956 lines) into `routes/beta.py`, `routes/admin_beta.py`, `routes/auth.py`, `routes/checkins.py`, `routes/waitlist.py`
- Mongo unique index on user_sessions.session_token + beta_codes.code
- Per-state ambience memory
- Cron reminder emails for check-ins
- i18n keys for /beta + /beta/redeem + /admin/beta surfaces
- Stripe pre-order for founding rank
- `missingKeyHandler` in i18n.js

## Files of note (Feb 2026 beta build)
- /app/backend/server.py — beta endpoints lines ~400–650
- /app/frontend/src/contexts/BetaContext.jsx
- /app/frontend/src/components/beta/{BetaGate,BetaBadge,BetaFeedbackWidget}.jsx
- /app/frontend/src/pages/{BetaLanding,BetaRedeem,AdminBeta}.jsx
- /app/backend/tests/test_beta.py (testing-agent-generated regression)
