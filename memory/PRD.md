# Let It Go AI — Landing Page PRD

## Problem Statement
"Build a landing page: ai emotional intelligence os first of its kind"
User-supplied brand: **Let It Go AI** — Emotional Intelligence Operating System.
Brand identity: dark theme, glowing infinity symbol, purple/pink/blue gradient,
four pillars: AWARE · RELEASE · GROW · TRANSFORM.

## Architecture
- Frontend: React 19 + Tailwind + Shadcn + framer-motion + sonner
- Backend: FastAPI template untouched (no backend was required)
- Fonts: Instrument Serif (display) + Space Grotesk (sans)
- Palette: #050208 bg, #110820 surface, gradient blue #5E8BFF → violet #8A4DFF → pink #FF6FD3, accent orange #FF8A5C
- Logo asset: customer-assets.emergentagent.com (rendered in hero)
- Composition: /app/frontend/src/pages/Landing.jsx composes 13 section components

## Implemented (Dec 2025)
- Sticky glass nav + mobile menu, custom SVG infinity logo
- Hero with brand-pivot headline ("What if you could actually let it go?"), gradient text, logo image, side cards
- Editorial marquee ribbon (AWARE · RELEASE · GROW · TRANSFORM)
- Problem section with aurora wash + stats
- 4-pillar bento (Aware/Release/Grow/Transform) — each with distinct icon + color
- Live demo mockup with breathing pulse circle + 4 signal bars + AI suggestion
- Shadcn Tabs use-cases (Personal/Teams/AI Agents) with orbital pillar viz
- Staggered testimonials grid
- Centered editorial manifesto with stars/aurora background
- 3-tier pricing (Personal / Team highlighted / Enterprise)
- FAQ accordion (6 items)
- Waitlist CTA (sonner toast, noValidate form) — MOCKED, no backend
- Massive footer with gradient 'let it go.' wordmark
- Testing iteration_2: 14/14 features pass, 0 console errors

## Mocked / Deferred
- Waitlist signup is MOCKED — client-side toast only, no email storage / no send
- No analytics, no email integration
- No /api endpoints touched

## Backlog
- P1: Wire waitlist to FastAPI + MongoDB + Resend confirmation email
- P1: SEO meta + OG image (use the Let It Go logo)
- P1: Analytics (Plausible/PostHog) + UTM capture
- P2: Add interactive emotion demo in hero (type how you feel → pulse responds)
- P2: Localize copy
- P2: /research and /blog routes

## Next Tasks
1. Confirm with user whether to persist waitlist + send confirmation email
2. Add SEO/OG meta
3. Performance pass (lazy-load images, preload fonts)
