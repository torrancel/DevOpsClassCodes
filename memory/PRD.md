# Let It Go AI — PRD (running)

## What the app is
"Let It Go AI" — an Emotional Intelligence Operating System. Brand: dark cosmic, infinity-glow logo, gradient blue→violet→pink. Founder-led brand voice.

## Surfaces shipped
### Marketing (public)
- `/` main landing — 13 i18n sections
- `/doctors`, `/attorneys`, `/teachers`, `/managers` — i18n-driven via `t("profession.<slug>.*")`
- `/beta` — beta program landing + apply form (public)
- `/founder` — Torrance Lillie's founder letter with share buttons (Twitter/X, LinkedIn, Email, Copy-link with native mobile share)
- `/pricing/success` — Stripe Checkout return page with polling-based payment confirmation
- 12-language i18n with auto-RTL for Arabic; localStorage key `letitgo_lang`
- Founding-member specials + Apple/Wear OS capture
- Waitlist + waitlist confirmation emails

### Product (authenticated)
- `/app` dashboard — EQ tile, 30-day Recharts trend, recent check-ins; gated by BetaGate (paid users also unlock)
- `/app/check-in` — 6 mood sliders + reflection + Claude AI co-regulation
- Ambience panel — procedural Web Audio (rain 0.32, ocean 0.42+LFO, forest 0.28, breath)
- Auth: Emergent-managed Google sign-in
- BETA badge in header + floating feedback widget (visible only to beta testers)

### Beta program
- `/beta` public apply form
- `/beta/redeem` flips `is_beta_tester=true`
- BetaGate wraps /app and /app/check-in
- Feedback widget submits to `beta_feedback`
- `/admin/beta`: stats, mint codes, invite by email, **Pick from waitlist** (bulk), approve/deny applications, codes table, feedback inbox

### Payments (Feb 2026)
- 9 server-defined packages: kids/individual/team/professional founding-lifetime + individual/professional monthly + individual/professional annual + beta_upgrade. NEVER trust client amounts.
- Stripe Checkout (hosted) via `emergentintegrations.payments.stripe.checkout`
- POST /api/payments/checkout/session — anonymous or authenticated checkout, persists `payment_transactions` BEFORE redirect
- GET /api/payments/checkout/status/{session_id} — polled by `/pricing/success` every 2s up to 15 attempts; idempotent finalize
- POST /api/webhook/stripe — signature-verified, dedupes by event_id, runs same finalize path
- On finalize: flips `users.is_paid=true`, `is_beta_tester=true`, `plan_tier`, `plan_mode`; upserts `paid_entitlements` keyed by email (for anonymous purchases that get reconciled at signup); sends receipt via Gmail SMTP

### Admin
- `/admin/analytics` — KPIs, audience/source charts, recent signups
- `/admin/beta` — beta cohort control room with bulk-from-waitlist

## Email transport (Feb 2026)
- Unified `_send_email(to, subject, html)` helper:
  - Primary: Gmail SMTP via `letitgo01172027@gmail.com` with App Password (16-char, in .env)
  - Fallback: Resend (sandbox `onboarding@resend.dev` — only delivers to account owner)
- Used by: waitlist confirmations, beta invites, beta-approve emails, Stripe receipts

## Integrations
- **Stripe Checkout** (emergentintegrations, test key `sk_test_emergent`)
- **Gmail SMTP** (smtplib + app password)
- **Resend** (fallback for emails)
- **Emergent Google OAuth**
- **Emergent LLM** (Claude Sonnet 4.5)
- **MongoDB collections**: users, user_sessions, checkins, waitlist, beta_codes, beta_applications, beta_feedback, payment_transactions, paid_entitlements, payment_webhook_events

## i18n status
- Fully translated (18/18): en, ar, de, es, fr, it, pt-BR
- Partially translated (profession + admin fall back to en): hi, ja, ko, ru, zh-CN
- Blocked: Emergent LLM key budget. Resume with `python3 /app/scripts/translate_locales.py hi ja ko ru zh-CN`

## Test reports
- iter_13 (Stripe): 13/13 new + 18/18 beta regression + 24/25 waitlist (1 stale assertion unrelated)
- iter_12 (Beta program): 18/18 + 25/25 + 100% frontend
- iter_1–11: incremental builds

## Remaining backlog
### P1
- Manually verify ambient audio quality via real Google login
- Manual happy-path test: complete a Stripe Checkout with test card 4242 4242 4242 4242 → verify (a) `/pricing/success` flips to "paid" state, (b) `users.is_paid=true`, (c) receipt email arrives, (d) `/app` becomes accessible without beta gate
- Fix stale waitlist test assertion (test_create_valid_with_known_audience — change expectation since Resend now delivers)
- Top up Emergent LLM budget → translator for hi/ja/ko/ru/zh-CN

### P2
- Split server.py (~1365 lines) into `routes/payments.py`, `routes/beta.py`, `routes/auth.py`, `routes/checkins.py`, `routes/waitlist.py`, `config/packages.py`
- Replace hard-coded preview URL in receipt + invite emails with `FRONTEND_URL` env var
- Mongo unique indexes: `user_sessions.session_token`, `beta_codes.code`, `payment_transactions.session_id`
- Per-state ambience memory
- Cron check-in reminder emails
- Daily cohort report email
- Custom-domain sender (replace `letitgo01172027@gmail.com` with `hello@letitgo.ai`)
- Beta seats-remaining counter on `/beta`
- Annual/monthly toggle in pricing UI (backend already supports the packages)
- Stripe Customer Portal for cancellations/refunds
- Localized email templates per user `lng`

## Files of note (Feb 2026)
- /app/backend/server.py — beta endpoints lines ~660–1060, Stripe endpoints ~1060–1365
- /app/frontend/src/components/landing/Pricing.jsx — Stripe Checkout integration
- /app/frontend/src/pages/PricingSuccess.jsx — polling success page
- /app/frontend/src/pages/FounderStory.jsx + components/share/ShareButtons.jsx
- /app/frontend/src/pages/{BetaLanding,BetaRedeem,AdminBeta}.jsx
- /app/backend/tests/test_payments.py + test_beta.py — regression suites
