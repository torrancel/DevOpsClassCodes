# Let It Go AI — PRD (running)

## What the app is
"Let It Go AI" — an Emotional Intelligence Operating System. Brand: dark cosmic, infinity-glow logo, gradient blue→violet→pink. Founder-led brand voice.

## Surfaces shipped
### Marketing (public)
- `/` main landing with 13 sections (nav, hero, marquee, problem, 4-pillar modules, demo, wearable, use-cases, testimonials, manifesto, 4-tier pricing, FAQ, CTA, footer) — **all sections i18n-driven**
- Profession landings: `/doctors`, `/attorneys`, `/teachers`, `/managers` — **fully i18n-driven via `t("profession.<slug>.*")`** (icon-only configs in professionConfigs.js)
- 12-language i18n with auto-RTL for Arabic; localStorage key `letitgo_lang`
- Founding-member specials with live counters per audience
- Apple Watch / Wear OS section + platform capture (apple/android) flowing into the waitlist

### Product (authenticated)
- **/app** dashboard — EQ tile (composite score), 30-day Recharts trend, recent check-ins, user picture/name, logout
- **/app/check-in** — 6 mood sliders + reflection textarea + AI co-regulation suggestion screen
- **/app** ambience panel — procedural Web Audio (rain 0.32, ocean 0.42 + LFO, forest 0.28, breath) + color-mood overlays
- **Auth**: Emergent-managed Google sign-in (no key required). Session cookie httpOnly + Bearer header both accepted.
- **AI**: Claude `claude-sonnet-4-5` via emergentintegrations using the universal Emergent LLM key.

### Admin
- `/admin/analytics` — bearer-token-gated dashboard (KPIs, by-audience bar, by-source donut, 30-day line, ranking table, redacted recent signups)

## Integrations
- Resend (transactional waitlist confirmation, tailored per audience + platform)
- Emergent Google OAuth
- Emergent LLM (Claude Sonnet 4.5) for check-in suggestions + locale translation
- MongoDB collections: users, user_sessions, checkins, waitlist, status_checks

## i18n status (Feb 2026)
- **Fully translated** (18/18 sections): en, ar, de, es, fr, it, pt-BR
- **Partially translated** (hero/marquee/problem/manifesto/etc complete; profession + admin fall back to English): hi, ja, ko, ru, zh-CN
- Blocked by: Emergent LLM key budget exceeded ($11.46 / $11.40). User must top up to translate remaining `profession` + `admin` sections for the 5 partial locales.
- Translator script `/app/scripts/translate_locales.py` now handles string vs dict leaves separately, validates output type, has 90s timeout + 3 retries + sequential per-locale processing + incremental writes.
- Footer link arrays (`linksPlatform`, `linksCompany`, `linksLegal`) hand-translated for all 11 non-EN locales.

## Test reports
iteration_1..11 in /app/test_reports. iteration_11 found malformed `{src:translation}` leaves in ar/de — fixed via flatten pass + improved translator. AR doctors page verified rendering with RTL + clean CTAs.

## Remaining backlog
### P1
- Resume translation for hi/ja/ko/ru/zh-CN profession + admin sections once LLM budget is topped up (run `python3 /app/scripts/translate_locales.py hi ja ko ru zh-CN`)
- Localized confirmation emails (capture user's language on POST /api/waitlist)
- Verify a real sending domain at resend.com/domains so confirmation emails reach all recipients

### P2
- Mongo unique index on user_sessions.session_token
- Per-state ambience memory (recall audio params when EQ drops)
- Automated cron emails for check-in reminders
- Optional Stripe pre-order flow (founding-rank gamification)
- Add `missingKeyHandler` to i18n.js so internal i18next warnings never leak to UI
