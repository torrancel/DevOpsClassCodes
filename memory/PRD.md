# Aura.OS Landing Page — PRD

## Problem Statement
"Build a landing page: ai emotional intelligence os first of its kind"

## Product
Aura.OS — an "AI Emotional Intelligence OS", positioned as the first operating system for human emotion: sensing affect, coaching regulation, mediating communication. Frame: editorial, organic, earthy aesthetic; deliberately not generic-SaaS.

## Architecture
- Frontend: React 19 + Tailwind + Shadcn + framer-motion + sonner
- Backend: untouched FastAPI template (no backend was required)
- Fonts: Cormorant Garamond (serif) + Figtree (sans)
- Palette: Forest #2B4C3B, Clay #C49775, Bg #F7F5F0, Bg-soft #EFEBE1, Ink #1A1A1A
- Page composition: /app/frontend/src/pages/Landing.jsx composes 13 section components under /app/frontend/src/components/landing/

## Personas
- Personal user — adults seeking emotional regulation co-pilot
- Team buyer — HR/People leaders, founders, facilitators
- AI Builder — engineers wanting an affect SDK for agents

## Implemented (Dec 2025)
- Sticky glass navigation w/ mobile menu
- Hero: massive serif headline + dual CTA + visual band
- Editorial marquee ribbon
- Problem section w/ stats & portrait
- Modules bento (4 cards: Sensing, Coaching, Mediation, Memory)
- Live Demo mockup w/ animated breath circle + signal bars
- Use Cases (Personal / Teams / AI Agents) via Shadcn Tabs
- Testimonials grid (4 quotes, staggered)
- Manifesto centered editorial block
- Pricing (3 tiers, Team highlighted)
- FAQ accordion (6 items)
- Waitlist CTA w/ sonner toast (MOCKED — no backend persistence)
- Massive editorial footer w/ 3 link columns

## Mocked / Deferred
- Waitlist signup is MOCKED — only client-side toast, no email storage
- No analytics, no email integration (Resend/Mailchimp) yet
- No /api endpoints used; backend untouched

## Backlog (P0/P1/P2)
- P1: Wire waitlist to backend (FastAPI /api/waitlist + MongoDB) and optional Resend email confirmation
- P1: Add analytics (plausible/posthog) + UTM capture on CTAs
- P2: Replace hero stock image with bespoke 3D render / Lottie pulse
- P2: Add light/dark theme toggle
- P2: Localize copy (currently EN-only)
- P2: Add /blog or /research routes for editorial content

## Next Tasks
1. Confirm with user whether waitlist should persist (suggest Resend + MongoDB)
2. SEO meta tags + OG image
3. Performance pass (lazy-load images, font-display: swap)
