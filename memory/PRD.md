# Let It Go AI — PRD (running)

## What the app is
"Let It Go AI" — an Emotional Intelligence Operating System. Brand: dark cosmic, infinity-glow logo, gradient blue→violet→pink. Founder-led brand voice.

## Surfaces shipped
### Marketing (public)
- `/` main landing with 13 sections (nav, hero, marquee, problem, 4-pillar modules, demo, wearable, use-cases, testimonials, manifesto, 4-tier pricing, FAQ, CTA, footer)
- Profession landings: `/doctors`, `/attorneys`, `/teachers`, `/managers` (each with stressors, modules, compliance, 3-tier pricing, testimonial, FAQ, CTA)
- 12-language i18n on the main landing's nav/hero/pricing/CTA/footer + founding badge (other surfaces still EN; translator script written and rerunnable)
- Founding-member specials with live counters per audience
- Apple Watch / Wear OS section + platform capture (apple/android) flowing into the waitlist

### Product (authenticated)
- **/app** dashboard — EQ tile (composite score), 30-day Recharts trend, recent check-ins, user picture/name, logout
- **/app/check-in** — 6 mood sliders (calm/focus/stress/anxiety/depression/warmth) + reflection textarea + AI co-regulation suggestion screen
- **Auth**: Emergent-managed Google sign-in (no key required). Session cookie httpOnly + Bearer header both accepted.
- **AI**: Claude `claude-sonnet-4-6` via emergentintegrations using the universal Emergent LLM key. In-brand fallback if LLM fails.

### Admin
- `/admin/analytics` — bearer-token-gated dashboard (KPIs, by-audience bar, by-source donut, 30-day line, ranking table, redacted recent signups)

## Integrations
- Resend (transactional waitlist confirmation, tailored per audience + platform)
- Emergent Google OAuth
- Emergent LLM (Claude) for both check-in suggestions and one-off locale translation
- MongoDB collections: users, user_sessions, checkins, waitlist, status_checks

## Test reports
iteration_1..9 in /app/test_reports — iteration_9 is the auth+checkins MVP run (17/17 backend pass, all frontend flows pass).

## Remaining backlog (P1/P2)
- **i18n**: Translate Modules · Demo · Wearable · Use Cases · Testimonials · Manifesto · FAQ · Marquee + 4 profession pages + /admin (en.json was expanded with all keys; translator was running in background last seen — verify locale files include the new keys and re-run `python3 /app/scripts/translate_locales.py` if missing)
- Localized confirmation emails (capture user's language on POST /api/waitlist)
- Verify a real sending domain at resend.com/domains so confirmation emails reach all recipients (not just torrancel42@gmail.com)
- Mongo unique index on user_sessions.session_token (test agent noted)
- Optional Stripe pre-order flow (founding-rank gamification)
