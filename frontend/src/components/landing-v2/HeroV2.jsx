import { motion, useReducedMotion } from "framer-motion";
import { Cpu, ArrowUpRight } from "lucide-react";
import {
    Section,
    StatusBadge,
    PrimaryButton,
    SecondaryButton,
    LaptopFrame,
    GlassCard,
} from "@/components/ds";

const INVESTOR_MAILTO = "mailto:founders@letitgo.ai?subject=Investor%20Information";

const STATUS_BAND = [
    {
        eyebrow: "Today",
        tone: "cyan",
        title: "Functional Web MVP",
        body: "Daily check-in, AI co-regulation, and 30-day growth trend — live in private beta.",
    },
    {
        eyebrow: "Under Development",
        tone: "violet",
        title: "Apple Watch + AI Personalization",
        body: "Ambient sensing on the wrist. Personalised regulation tuned to your biosignals.",
    },
    {
        eyebrow: "Long-Term Vision",
        tone: "magenta",
        title: "Smart Ring, Enterprise, Mobility",
        body: "The ecosystem expands to the ring, the org, and the vehicle — one continuous layer.",
    },
];

/**
 * HeroV2 — cinematic hero with laptop MVP composition + wearable placeholders.
 */
export default function HeroV2() {
    const reduce = useReducedMotion();
    const anim = (delay = 0) =>
        reduce
            ? { initial: false, animate: undefined }
            : {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.9, delay },
              };

    return (
        <Section
            id="top"
            size="lg"
            className="pt-40 md:pt-48 overflow-hidden"
        >
            {/* Ambient glow bed */}
            <div aria-hidden="true" className="lg-ambient" />
            {/* Faint grid */}
            <div
                aria-hidden="true"
                className="absolute inset-0 lg-grid-bg pointer-events-none"
            />

            <div className="relative">
                {/* Eyebrow */}
                <motion.div {...anim(0)} className="mb-8 flex justify-center">
                    <StatusBadge tone="cyan" data-testid="hero-eyebrow">
                        Functional MVP Available Today
                    </StatusBadge>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    {...anim(0.1)}
                    data-testid="hero-headline"
                    className="lg-h1 text-lg-ink text-center max-w-[18ch] mx-auto"
                >
                    The Emotional Intelligence Layer for{" "}
                    <span className="lg-gradient-text italic">Everyday Life</span>.
                </motion.h1>

                {/* Supporting copy */}
                <motion.p
                    {...anim(0.25)}
                    data-testid="hero-subline"
                    className="mt-10 text-lg md:text-xl text-lg-ink-soft max-w-3xl mx-auto text-center leading-relaxed"
                >
                    Let It Go AI is an AI-powered emotional wellbeing platform designed
                    to help people understand patterns, regulate stress, and build
                    healthier daily habits through personalized guidance.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    {...anim(0.4)}
                    className="mt-12 flex flex-wrap items-center justify-center gap-3"
                >
                    <PrimaryButton
                        as="a"
                        href="/app"
                        data-testid="hero-primary-cta"
                        size="lg"
                    >
                        Explore the MVP
                    </PrimaryButton>
                    <SecondaryButton
                        as="a"
                        href={INVESTOR_MAILTO}
                        data-testid="hero-secondary-cta"
                        size="lg"
                        icon={<ArrowUpRight size={15} />}
                    >
                        Investor Information
                    </SecondaryButton>
                </motion.div>

                {/* Cinematic product composition */}
                <motion.div
                    {...(reduce
                        ? { initial: false }
                        : {
                              initial: { opacity: 0, y: 40 },
                              animate: { opacity: 1, y: 0 },
                              transition: { duration: 1.2, delay: 0.55 },
                          })}
                    className="mt-24 md:mt-28 relative"
                >
                    <div className="relative mx-auto max-w-[1120px] px-2">
                        <div className="grid grid-cols-12 items-center gap-4 lg:gap-8">
                            {/* Ring — left column, only on lg+ */}
                            <div className="hidden lg:flex col-span-2 justify-center">
                                <WearablePlaceholder
                                    kind="ring"
                                    label="Smart Ring"
                                    status="Long-Term Vision"
                                    tone="magenta"
                                    reduce={reduce}
                                />
                            </div>

                            {/* Laptop — full width on <lg, 8 cols on lg+ */}
                            <div className="col-span-12 lg:col-span-8">
                                <LaptopFrame url="letitgo.ai/app" float={!reduce}>
                                    <MvpDashboardMock />
                                </LaptopFrame>
                            </div>

                            {/* Watch — right column, only on lg+ */}
                            <div className="hidden lg:flex col-span-2 justify-center">
                                <WearablePlaceholder
                                    kind="watch"
                                    label="Apple Watch"
                                    status="Under Development"
                                    tone="violet"
                                    reduce={reduce}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Status band */}
                <motion.div
                    {...anim(0.75)}
                    className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
                    data-testid="hero-status-band"
                >
                    {STATUS_BAND.map((s, i) => (
                        <GlassCard
                            key={s.eyebrow}
                            padding="md"
                            radius="md"
                            accent={s.tone}
                            className="h-full"
                            data-testid={`hero-status-${i}`}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span
                                    aria-hidden="true"
                                    className="inline-block h-1.5 w-1.5 rounded-full"
                                    style={{
                                        background:
                                            s.tone === "cyan"
                                                ? "#21D4FD"
                                                : s.tone === "violet"
                                                    ? "#8B4DFF"
                                                    : "#FF3CAC",
                                        boxShadow: `0 0 10px ${
                                            s.tone === "cyan"
                                                ? "rgba(33,212,253,0.6)"
                                                : s.tone === "violet"
                                                    ? "rgba(139,77,255,0.6)"
                                                    : "rgba(255,60,172,0.6)"
                                        }`,
                                    }}
                                />
                                <span className="lg-eyebrow text-lg-ink-muted">
                                    {s.eyebrow}
                                </span>
                            </div>
                            <h3 className="text-[17px] md:text-lg font-semibold text-lg-ink tracking-[-0.015em] mb-2">
                                {s.title}
                            </h3>
                            <p className="text-[14px] leading-relaxed text-lg-ink-soft">
                                {s.body}
                            </p>
                        </GlassCard>
                    ))}
                </motion.div>
            </div>
        </Section>
    );
}

/** Simplified MVP dashboard mock for inside the laptop frame. */
function MvpDashboardMock() {
    return (
        <div className="w-full h-full p-3 sm:p-4 md:p-6 flex gap-3 sm:gap-4 md:gap-5 text-lg-ink overflow-hidden">
            {/* Left column */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-lg-ink-muted">
                            Dashboard
                        </p>
                        <p className="mt-1 text-sm font-semibold text-lg-ink truncate">
                            Good evening, Torrance
                        </p>
                    </div>
                    <span className="text-[9px] text-lg-ink-muted uppercase tracking-[0.25em] whitespace-nowrap shrink-0">
                        Day 27
                    </span>
                </div>

                {/* EQ ring */}
                <div className="flex-1 lg-panel rounded-2xl p-4 md:p-5 flex items-center justify-center relative overflow-hidden">
                    <div className="relative w-24 h-24 md:w-32 md:h-32">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth="6"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="url(#eq-grad)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray="264"
                                strokeDashoffset="82"
                            />
                            <defs>
                                <linearGradient id="eq-grad" x1="0" x2="1" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#21D4FD" />
                                    <stop offset="50%" stopColor="#8B4DFF" />
                                    <stop offset="100%" stopColor="#FF3CAC" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[9px] uppercase tracking-[0.25em] text-lg-ink-muted">
                                EQ
                            </span>
                            <span className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-lg-ink">
                                72
                            </span>
                            <span className="text-[9px] text-lg-ink-soft">+6.2 wk</span>
                        </div>
                    </div>
                </div>

                {/* Sparkline trend */}
                <div className="lg-panel rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-lg-ink-muted">
                            30-day trend
                        </span>
                        <span className="text-[10px] text-lg-ink-soft">↑ steady</span>
                    </div>
                    <svg viewBox="0 0 200 40" className="w-full h-8">
                        <defs>
                            <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#8B4DFF" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#8B4DFF" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0 32 L20 28 L40 30 L60 22 L80 24 L100 18 L120 20 L140 14 L160 16 L180 10 L200 12 L200 40 L0 40 Z"
                            fill="url(#trend-fill)"
                        />
                        <path
                            d="M0 32 L20 28 L40 30 L60 22 L80 24 L100 18 L120 20 L140 14 L160 16 L180 10 L200 12"
                            fill="none"
                            stroke="url(#eq-grad)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* Right column */}
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
                <div className="lg-panel rounded-2xl p-4 flex-1">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-lg-ink-muted mb-3">
                        Recent check-ins
                    </p>
                    <div className="space-y-2.5">
                        {[
                            { day: "Wed", tone: "#21D4FD", val: 74 },
                            { day: "Tue", tone: "#8B4DFF", val: 68 },
                            { day: "Mon", tone: "#FF3CAC", val: 71 },
                            { day: "Sun", tone: "#356BFF", val: 65 },
                        ].map((r) => (
                            <div
                                key={r.day}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ background: r.tone }}
                                    />
                                    <span className="text-[11px] text-lg-ink-soft">
                                        {r.day}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 flex-1 max-w-[100px] ml-4">
                                    <div className="flex-1 h-[3px] rounded-full bg-white/5 overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${r.val}%`,
                                                background: r.tone,
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-lg-ink">
                                        {r.val}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI card */}
                <div
                    className="rounded-2xl p-4 border border-white/[0.12]"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(53,107,255,0.18), rgba(139,77,255,0.20), rgba(255,60,172,0.16))",
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Cpu size={11} className="text-white/80" />
                        <span className="text-[9px] uppercase tracking-[0.28em] text-white/80">
                            AI Co-regulation
                        </span>
                    </div>
                    <p className="text-[12px] leading-snug text-white">
                        You&apos;ve been carrying tension this afternoon. Try a
                        90-second box breath — I&apos;ll dim the room.
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * WearablePlaceholder — small silhouette + roadmap badge.
 * kind: "watch" | "ring"
 */
function WearablePlaceholder({ kind, label, status, tone, reduce }) {
    const glow = {
        violet: "rgba(139,77,255,0.4)",
        magenta: "rgba(255,60,172,0.4)",
        cyan: "rgba(33,212,253,0.4)",
    }[tone];

    return (
        <div className="relative">
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.24em] font-semibold text-lg-ink bg-[rgba(5,5,7,0.9)] border border-white/15 backdrop-blur">
                    <span
                        aria-hidden="true"
                        className="inline-block w-1 h-1 rounded-full"
                        style={{ background: glow, boxShadow: `0 0 8px ${glow}` }}
                    />
                    {status}
                </span>
            </div>

            <div
                className="relative"
                style={{ filter: `drop-shadow(0 0 40px ${glow})` }}
            >
                {kind === "watch" ? <WatchSvg /> : <RingSvg />}
            </div>

            {/* Caption */}
            <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-lg-ink-muted text-center">
                {label}
            </p>
        </div>
    );
}

function WatchSvg() {
    return (
        <svg
            aria-hidden="true"
            width="120"
            height="150"
            viewBox="0 0 120 150"
            fill="none"
            className="opacity-95"
        >
            <defs>
                <linearGradient id="w-bezel" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3A3A44" />
                    <stop offset="100%" stopColor="#0E0E14" />
                </linearGradient>
                <linearGradient id="w-face" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0A0A12" />
                    <stop offset="100%" stopColor="#06060A" />
                </linearGradient>
                <linearGradient id="w-band" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#26262E" />
                    <stop offset="100%" stopColor="#141419" />
                </linearGradient>
            </defs>
            {/* Bands */}
            <path d="M35 0 Q30 6 32 22 L88 22 Q90 6 85 0 Z" fill="url(#w-band)" />
            <path
                d="M32 128 Q30 144 35 150 L85 150 Q90 144 88 128 Z"
                fill="url(#w-band)"
            />
            {/* Case */}
            <rect
                x="18"
                y="22"
                width="84"
                height="106"
                rx="22"
                fill="url(#w-bezel)"
                stroke="rgba(255,255,255,0.14)"
            />
            {/* Face */}
            <rect
                x="24"
                y="28"
                width="72"
                height="94"
                rx="16"
                fill="url(#w-face)"
            />
            {/* Face content: mini status */}
            <text
                x="60"
                y="62"
                textAnchor="middle"
                fill="#A7A7B5"
                fontSize="6"
                letterSpacing="1.6"
                fontFamily="-apple-system, sans-serif"
            >
                CALM
            </text>
            <text
                x="60"
                y="83"
                textAnchor="middle"
                fill="#F7F7FA"
                fontSize="18"
                fontWeight="700"
                fontFamily="-apple-system, sans-serif"
            >
                72
            </text>
            <circle cx="60" cy="102" r="8" fill="none" stroke="url(#eq-grad-w)" strokeWidth="1.5" />
            <defs>
                <linearGradient id="eq-grad-w" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#21D4FD" />
                    <stop offset="100%" stopColor="#FF3CAC" />
                </linearGradient>
            </defs>
            {/* Crown */}
            <rect x="102" y="60" width="6" height="14" rx="2" fill="#2A2A32" />
        </svg>
    );
}

function RingSvg() {
    return (
        <svg
            aria-hidden="true"
            width="86"
            height="86"
            viewBox="0 0 86 86"
            fill="none"
            className="opacity-95"
        >
            <defs>
                <linearGradient id="r-outer" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#484852" />
                    <stop offset="50%" stopColor="#1A1A22" />
                    <stop offset="100%" stopColor="#2E2E38" />
                </linearGradient>
                <radialGradient id="r-inner" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#050507" />
                    <stop offset="100%" stopColor="#0C0C12" />
                </radialGradient>
            </defs>
            {/* Outer ring */}
            <circle
                cx="43"
                cy="43"
                r="36"
                fill="url(#r-outer)"
                stroke="rgba(255,255,255,0.12)"
            />
            {/* Inner hole */}
            <circle cx="43" cy="43" r="20" fill="url(#r-inner)" />
            {/* Sensor dot */}
            <circle
                cx="43"
                cy="10"
                r="2.5"
                fill="#FF3CAC"
                opacity="0.9"
            />
            {/* Faint highlight */}
            <path
                d="M18 30 Q30 20 46 20"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
                fill="none"
            />
        </svg>
    );
}
