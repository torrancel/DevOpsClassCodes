# Let It Go AI — PRD (running)

## What the app is
"Let It Go AI" — an **Emotional Intelligence Ecosystem** (rebranded Feb 2026 from "Operating System"). Brand: matte-black cinematic (as of Feb 2026 v2), cyan→blue→violet→magenta gradient system. Founder-led brand voice.

**Tagline**: *One Ecosystem. Every Moment. Better You.*

## Design System (Feb 2026)
Premium design system introduced. Tokens: `#050507` bg · `#F7F7FA` ink · cyan `#21D4FD` · blue `#356BFF` · violet `#8B4DFF` · magenta `#FF3CAC`. Reusable primitives at `/app/frontend/src/components/ds/`:
- `BrandLogo`, `Section`, `GradientHeadline`, `StatusBadge`, `GlassCard`, `PrimaryButton`, `SecondaryButton`, `DeviceFrame`, `RoadmapCard`, `FeatureCard`
- Utility classes in `/app/frontend/src/index.css`: `.lg-root`, `.lg-gradient-text`, `.lg-panel`, `.lg-btn-primary`, `.lg-ambient`, `.lg-h1/h2/h3`, `.lg-grid-bg`
- System sans-serif stack (SF Pro Display fallback). Marketing landing wrapped in `.lg-root` so MVP pages remain unaffected.

## Surfaces shipped
### Marketing (public)
- `/` main landing — REDESIGNED Feb 2026 with premium DS. 9-section flow: Nav → Hero (huge tagline + phone mock + floating callouts) → 4-Pillar Features → Device Showcase → Audiences (+ Specialist strip) → Roadmap teaser → Pricing (glass cards, Stripe wired) → FAQ → CTA (waitlist form) → Footer (with "let it go." mega mark).
- Legacy landing preserved at `/app/frontend/src/pages/LandingLegacy.jsx` (not routed — reusable backup)
- Landing sections in `/app/frontend/src/components/landing-v2/`: NavigationV2, HeroV2, FeaturesV2, DeviceShowcase, AudiencesV2, RoadmapV2, PricingV2, FAQV2, CTAV2, FooterV2
- `/doctors`, `/attorneys`, `/teachers`, `/managers` — i18n-driven via `t("profession.<slug>.*")`
- `/beta` — beta program landing + apply form (public)
- `/founder` — Torrance Lillie's founder letter with share buttons
- `/ecosystem` — full ecosystem experience matching the brand infographic: mission hero, 4 pillars (Understand/Release/Grow/Transform), 6 ecosystem surfaces (Mobile/Ring/Watch/Vehicles/Enterprise/Cloud), 5-phase roadmap (Foundation 2024 · Expansion 2024-25 · Wearables 2025-26 · Mobility 2026-27 · Ecosystem Scale 2027+), 5 tech pillars, "One ecosystem. Every moment. Better you." closing band
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


## Session update — Feb 2026 (deploy prep)
- Founder portrait fix: rotated 90° CW via CSS transform in `FounderSectionV2.jsx` (webp had wrong EXIF orientation)
- i18n across all 12 languages for the V2 landing components (previously only NavigationV2 was translated):
  - Added `v2Landing` namespace to `/app/frontend/src/locales/en.json` (15 sections: hero, timeline, workingProduct, signal, features, device, audiences, roadmap, founder, investor, pricing, faq, closing, footer, modal)
  - Refactored these V2 components to use `useTranslation()` + `t()`: HeroV2, TimelineV2, WorkingProductV2, SignalToSupportV2, FeaturesV2, DeviceShowcase, AudiencesV2, EcosystemRoadmapV2, FounderSectionV2
  - Auto-translated `v2Landing` into ar/de/es/fr/hi/it/ja/ko/pt-BR/ru/zh-CN via `/app/scripts/translate_locales.py`
  - **STILL HARDCODED (English only)**: InvestorSectionV2, PricingV2, FAQV2, ClosingCTAV2, FooterV2, LandingModal — keys exist in en.json + all locales but components not yet wired
- Deployment readiness fixes:
  - Replaced hardcoded preview URLs in `_send_beta_invite_email` (server.py:837) and `_send_receipt_email` (server.py:1248) with `FRONTEND_URL` env var
  - Added `FRONTEND_URL` to `/app/backend/.env`
  - Fixed `.gitignore` to explicitly track `backend/.env` and `frontend/.env` (were being blocked by `.env` glob)
  - deployment_agent → PASS ✅
