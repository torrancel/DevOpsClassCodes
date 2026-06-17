# Let It Go AI — Landing Page PRD

## Problem Statement
"Build a landing page: ai emotional intelligence os first of its kind"
Brand: **Let It Go AI** — Emotional Intelligence Operating System.

## Architecture
- Frontend: React 19 + Tailwind + Shadcn + framer-motion + sonner + axios
- Backend: FastAPI + Motor (MongoDB) + Resend transactional email
- Fonts: Instrument Serif (display) + Space Grotesk (sans)
- Palette: #050208 bg, gradient blue #5E8BFF → violet #8A4DFF → pink #FF6FD3
- Logo: customer-assets.emergentagent.com (rendered in hero)
- Audience capture: module-level useSyncExternalStore singleton (audienceStore.js)

## Implemented (Dec 2025)
- Sticky glass nav + mobile menu
- Hero with brand logo, gradient text, mood-keyword subline
- Editorial marquee (AWARE · RELEASE · GROW · TRANSFORM)
- Problem section w/ stats + aurora wash
- 4-pillar bento (Aware/Release/Grow/Transform)
- Live demo mockup w/ 6 signals (Calm, Focus, Stress, Anxiety, Depression, Warmth) + pulse + AI suggestion
- Use Cases (Kids, Individual, Team, Professional) — Professional shows 4 specialist sub-cards (Doctors, Attorneys, Teachers, Managers)
- Staggered testimonials grid
- Editorial manifesto
- 4-tier pricing (Kids $6, Individual $14, Team $9 highlighted, Professional $39) + enterprise note
- FAQ accordion (6 items)
- **Waitlist (LIVE)**: POST /api/waitlist persists to MongoDB + sends tailored Resend confirmation email; GET /api/waitlist/count
- **Audience capture (LIVE)**: Pricing CTAs and Professional sub-cards set the global audience; CTA shows chip picker + helper text; submission posts audience to backend; email subject/body tailored ("Welcome to the Kids beta", "Welcome to the Doctors mode beta", etc.)
- Massive editorial footer with gradient 'let it go.' wordmark

## Testing
- iteration_1, iteration_2, iteration_3, iteration_4 — all pass
- iteration_4: 11/11 backend pytest, all frontend audience flows verified

## Backlog
- P1: Verify a real domain at resend.com/domains so emails reach addresses other than torrancel42@gmail.com
- P1: SEO meta + OG image using Let It Go logo
- P1: Analytics (Plausible/PostHog) + UTM capture on CTAs
- P2: Admin endpoint to list/export waitlist entries (CSV)
- P2: Localize copy
- P2: Add interactive emotion demo in hero (type → pulse responds)

## Operational Notes
- RESEND_API_KEY lives in /app/backend/.env (rotate before public deploy)
- Resend test mode: only delivers to verified owner (torrancel42@gmail.com); other recipients are persisted with email_sent=false. Verify a domain to lift this.
