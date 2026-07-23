import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ChevronLeft, ArrowUpRight, Plus, Wind, LineChart as LineIcon } from "lucide-react";
import {
    Section,
    GradientHeadline,
    LaptopFrame,
    PrimaryButton,
    GlassCard,
} from "@/components/ds";
import { track, EVENTS } from "@/lib/analytics";

/**
 * WorkingProductV2 — "A Working Product, Not Just a Concept."
 *
 * Renders a large laptop mockup that tab-switches through 4 product views.
 * Views are high-fidelity in-code reproductions of the actual MVP screens
 * (AppDashboard.jsx / CheckIn.jsx) — this preserves brand fidelity without
 * requiring OAuth-gated screenshot capture.
 *
 * Metrics area intentionally hidden until real numbers are supplied.
 * To turn it on, replace the `null` values in METRICS with verified counts.
 */

// ─────────────────────────────────────────────────────────────────
// METRICS — set to null until real numbers are verified.
// When all three become truthy numbers, the metric band renders.
// ─────────────────────────────────────────────────────────────────
const METRICS = {
    betaUsers: null,          // e.g. 128
    sessionsCompleted: null,  // e.g. 3412
    returningUsers: null,     // e.g. 74
};

const VIEWS = [
    { id: "dashboard", label: "Dashboard", icon: LineIcon },
    { id: "checkin", label: "Check-in", icon: Sparkles },
    { id: "regulation", label: "Regulation", icon: Wind },
    { id: "insights", label: "Insights", icon: ArrowUpRight },
];

export default function WorkingProductV2() {
    const [active, setActive] = useState("dashboard");
    const reduce = useReducedMotion();
    const showMetrics = Boolean(
        METRICS.betaUsers && METRICS.sessionsCompleted && METRICS.returningUsers,
    );

    return (
        <Section
            id="product"
            size="lg"
            data-testid="working-product-section"
            className="overflow-hidden"
        >
            <div aria-hidden="true" className="lg-ambient opacity-70" />

            <div className="relative">
                {/* Header */}
                <div className="max-w-3xl mb-10 md:mb-14">
                    <span
                        data-testid="live-mvp-badge"
                        className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] font-semibold text-lg-ink bg-[rgba(33,212,253,0.14)] border border-[rgba(33,212,253,0.4)] mb-8"
                    >
                        <span className="relative inline-flex h-2 w-2">
                            {!reduce && (
                                <span
                                    className="absolute inline-flex h-full w-full rounded-full opacity-70"
                                    style={{
                                        background: "#21D4FD",
                                        animation:
                                            "lg-live-ping 2s cubic-bezier(0,0,0.2,1) infinite",
                                    }}
                                />
                            )}
                            <span
                                className="relative inline-flex rounded-full h-2 w-2"
                                style={{
                                    background: "#21D4FD",
                                    boxShadow: "0 0 10px rgba(33,212,253,0.9)",
                                }}
                            />
                        </span>
                        Live MVP
                    </span>

                    <GradientHeadline as="h2" size="lg" data-testid="product-headline">
                        A Working Product,
                        <br />
                        <span className="lg-gradient-text italic">Not Just a Concept</span>
                        .
                    </GradientHeadline>
                    <p className="mt-8 text-lg text-lg-ink-soft max-w-2xl leading-relaxed">
                        The Let It Go AI web MVP is already functional and provides the
                        foundation for product validation, user testing, and future
                        wearable integration.
                    </p>
                </div>

                {/* Tab switcher */}
                <div
                    role="tablist"
                    aria-label="Product views"
                    data-testid="product-view-tabs"
                    className="mb-8 md:mb-10 flex flex-wrap items-center gap-2 md:gap-3"
                >
                    {VIEWS.map((v) => {
                        const Icon = v.icon;
                        const isActive = active === v.id;
                        return (
                            <button
                                key={v.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                data-testid={`product-view-tab-${v.id}`}
                                onClick={() => setActive(v.id)}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] uppercase tracking-[0.22em] font-medium transition-all ${
                                    isActive
                                        ? "text-lg-ink bg-white/[0.08] border border-white/25"
                                        : "text-lg-ink-soft bg-white/[0.02] border border-white/[0.08] hover:text-lg-ink hover:border-white/15"
                                }`}
                            >
                                <Icon size={13} strokeWidth={1.75} />
                                {v.label}
                            </button>
                        );
                    })}
                </div>

                {/* Laptop mockup */}
                <div className="relative mx-auto max-w-[1180px]">
                    <LaptopFrame url={`letitgo.ai${routeFor(active)}`} float={!reduce}>
                        <motion.div
                            key={active}
                            initial={reduce ? false : { opacity: 0 }}
                            animate={reduce ? undefined : { opacity: 1 }}
                            transition={{ duration: 0.45 }}
                            className="w-full h-full"
                        >
                            {active === "dashboard" && <DashboardView />}
                            {active === "checkin" && <CheckinView />}
                            {active === "regulation" && <RegulationView reduce={reduce} />}
                            {active === "insights" && <InsightsView />}
                        </motion.div>
                    </LaptopFrame>
                </div>

                {/* CTA */}
                <div className="mt-14 md:mt-20 flex justify-center">
                    <PrimaryButton
                        as="a"
                        href="/app"
                        onClick={() => track(EVENTS.PRODUCT_DEMO_CLICK, { view: active })}
                        data-testid="product-demo-cta"
                        size="lg"
                    >
                        Open Product Demo
                    </PrimaryButton>
                </div>

                {/* Metrics — only visible when values verified */}
                {showMetrics && (
                    <div
                        data-testid="product-metrics"
                        className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
                    >
                        <MetricCard
                            label="Beta users"
                            value={formatMetric(METRICS.betaUsers)}
                            accent="cyan"
                        />
                        <MetricCard
                            label="Sessions completed"
                            value={formatMetric(METRICS.sessionsCompleted)}
                            accent="violet"
                        />
                        <MetricCard
                            label="Returning users"
                            value={formatMetric(METRICS.returningUsers)}
                            accent="magenta"
                        />
                    </div>
                )}
            </div>
        </Section>
    );
}

const routeFor = (id) =>
    ({
        dashboard: "/app",
        checkin: "/app/check-in",
        regulation: "/app/regulation",
        insights: "/app/insights",
    })[id];

function formatMetric(n) {
    if (typeof n !== "number") return "—";
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
}

function MetricCard({ label, value, accent }) {
    return (
        <GlassCard padding="lg" radius="lg" accent={accent}>
            <p className="lg-eyebrow text-lg-ink-muted mb-3">{label}</p>
            <p className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] lg-gradient-text">
                {value}
            </p>
        </GlassCard>
    );
}

/* ─────────────────────────────────────────────────────────────
   View 1 — Dashboard  (mirrors AppDashboard.jsx)
   ───────────────────────────────────────────────────────────── */
function DashboardView() {
    return (
        <div className="w-full h-full flex flex-col text-lg-ink overflow-hidden">
            {/* Inner top nav */}
            <div className="px-6 py-3 border-b border-white/[0.06] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                    <span className="inline-flex w-4 h-4 rounded-full bg-gradient-to-br from-lg-cyan via-lg-violet to-lg-magenta" />
                    <span className="font-semibold tracking-tight">Let It Go AI</span>
                </div>
                <div className="flex items-center gap-3 text-lg-ink-muted">
                    <span>Day 27</span>
                    <span className="w-5 h-5 rounded-full bg-white/10" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 md:p-6 overflow-hidden">
                <p className="text-[9px] uppercase tracking-[0.32em] lg-gradient-text">
                    Your inner life
                </p>
                <h1 className="mt-2 text-xl md:text-2xl font-semibold tracking-[-0.02em]">
                    Good to see you, <span className="lg-gradient-text italic">Torrance</span>.
                </h1>

                <div className="mt-5 grid grid-cols-12 gap-4">
                    {/* EQ card */}
                    <div className="col-span-5 lg-panel rounded-2xl p-5 flex flex-col items-center">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-lg-ink-muted mb-3 self-start">
                            Latest reading
                        </p>
                        <div className="relative w-24 h-24 my-2">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#dv-grad)" strokeWidth="6" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="80" />
                                <defs>
                                    <linearGradient id="dv-grad" x1="0" x2="1" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#21D4FD" />
                                        <stop offset="50%" stopColor="#8B4DFF" />
                                        <stop offset="100%" stopColor="#FF3CAC" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-semibold tracking-[-0.02em]">72</span>
                                <span className="text-[8px] uppercase tracking-[0.25em] text-lg-ink-muted">EQ</span>
                            </div>
                        </div>
                        <div className="mt-3 rounded-xl bg-white/[0.04] border border-white/10 p-3 w-full">
                            <p className="text-[8px] uppercase tracking-[0.25em] lg-gradient-text mb-1.5">
                                Suggestion
                            </p>
                            <p className="text-[12px] italic leading-snug">
                                Try a 4-7-8 breath before your next meeting.
                            </p>
                        </div>
                        <div className="mt-3 w-full rounded-full py-2 text-center text-[11px] font-medium text-white"
                             style={{ background: "linear-gradient(90deg, #356BFF, #8B4DFF, #FF3CAC)" }}>
                            + New check-in
                        </div>
                    </div>

                    {/* Trend card */}
                    <div className="col-span-7 lg-panel rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-lg-ink-muted">
                                    Growth memory
                                </p>
                                <p className="mt-0.5 text-sm font-semibold">Last 30 days</p>
                            </div>
                            <span className="text-[10px] text-lg-ink-soft">27 check-ins</span>
                        </div>
                        <svg viewBox="0 0 300 90" className="w-full h-24">
                            <defs>
                                <linearGradient id="dv-trend" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#8B4DFF" stopOpacity="0.35" />
                                    <stop offset="100%" stopColor="#8B4DFF" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* horizontal grid */}
                            {[0, 1, 2, 3].map((i) => (
                                <line key={i} x1="0" x2="300" y1={22 * i + 4} y2={22 * i + 4} stroke="rgba(255,255,255,0.04)" />
                            ))}
                            <path
                                d="M0 68 L20 60 L40 62 L60 50 L80 55 L100 42 L120 46 L140 34 L160 40 L180 26 L200 32 L220 22 L240 28 L260 18 L280 22 L300 14 L300 90 L0 90 Z"
                                fill="url(#dv-trend)"
                            />
                            <path
                                d="M0 68 L20 60 L40 62 L60 50 L80 55 L100 42 L120 46 L140 34 L160 40 L180 26 L200 32 L220 22 L240 28 L260 18 L280 22 L300 14"
                                fill="none"
                                stroke="url(#dv-grad)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Recent check-ins */}
                    <div className="col-span-12 lg-panel rounded-2xl p-4 mt-1">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold">Recent check-ins</p>
                            <span className="text-[10px] text-lg-ink-muted">Last 30 days</span>
                        </div>
                        <ul>
                            {[
                                { eq: 74, when: "Wed · 8:14 pm", note: "Ease landing after the walk." },
                                { eq: 68, when: "Tue · 9:02 am", note: "Grounding worked — 3-minute breath." },
                                { eq: 71, when: "Mon · 6:45 pm", note: "Notice the tightness. Soften it gently." },
                            ].map((r) => (
                                <li key={r.when} className="flex items-center gap-3 py-2 border-t border-white/[0.05] first:border-t-0">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                                        style={{ background: "linear-gradient(135deg,#21D4FD,#8B4DFF,#FF3CAC)" }}
                                    >
                                        {r.eq}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-lg-ink-muted">{r.when}</p>
                                        <p className="text-[12px] italic truncate">{r.note}</p>
                                    </div>
                                    <div className="hidden md:flex items-center gap-0.5">
                                        {["#5E8BFF", "#8B4DFF", "#FF8A5C", "#FF3CAC", "#6B5BFF", "#FFB36F"].map((c, i) => (
                                            <span
                                                key={i}
                                                className="w-1 rounded-full"
                                                style={{ background: c, height: `${6 + (i % 3) * 3}px` }}
                                            />
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   View 2 — Check-in  (mirrors CheckIn.jsx)
   ───────────────────────────────────────────────────────────── */
function CheckinView() {
    const SIGNALS = [
        { label: "Calm", val: 68, color: "#5E8BFF" },
        { label: "Focus", val: 55, color: "#8B4DFF" },
        { label: "Stress", val: 32, color: "#FF8A5C" },
        { label: "Anxiety", val: 28, color: "#FF3CAC" },
        { label: "Depression", val: 18, color: "#6B5BFF" },
        { label: "Warmth", val: 74, color: "#FFB36F" },
    ];
    return (
        <div className="w-full h-full flex flex-col text-lg-ink overflow-hidden">
            <div className="px-6 py-3 border-b border-white/[0.06] flex items-center gap-2 text-[11px]">
                <ChevronLeft size={12} className="text-lg-ink-muted" />
                <span className="inline-flex w-4 h-4 rounded-full bg-gradient-to-br from-lg-cyan via-lg-violet to-lg-magenta" />
                <span className="font-semibold tracking-tight">Let It Go AI</span>
            </div>
            <div className="flex-1 px-6 md:px-8 py-5 overflow-hidden">
                <p className="text-[9px] uppercase tracking-[0.32em] lg-gradient-text">
                    Check-in · 90 seconds
                </p>
                <h1 className="mt-2 text-xl md:text-2xl font-semibold tracking-[-0.02em]">
                    How are you, <span className="lg-gradient-text italic">really</span>?
                </h1>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                    {SIGNALS.map((s) => (
                        <div key={s.label}>
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-[13px] font-medium">{s.label}</span>
                                <span className="text-[13px] font-mono text-lg-ink-soft">{s.val}</span>
                            </div>
                            <div
                                className="h-1.5 rounded-full overflow-hidden"
                                style={{
                                    background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${s.val}%, rgba(255,255,255,0.08) ${s.val}%, rgba(255,255,255,0.08) 100%)`,
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-lg-ink-muted mb-1.5">
                        Reflection · optional
                    </p>
                    <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 text-[12px] italic text-lg-ink-soft">
                        One quiet moment before the day started to move too fast.
                    </div>
                </div>
                <div className="mt-4 w-full rounded-full py-2.5 text-center text-[12px] font-medium text-white flex items-center justify-center gap-2"
                     style={{ background: "linear-gradient(90deg, #356BFF, #8B4DFF, #FF3CAC)" }}>
                    Read me
                    <ArrowUpRight size={12} />
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   View 3 — Regulation / Breath
   ───────────────────────────────────────────────────────────── */
function RegulationView({ reduce }) {
    return (
        <div className="w-full h-full flex flex-col text-lg-ink overflow-hidden">
            <div className="px-6 py-3 border-b border-white/[0.06] flex items-center gap-2 text-[11px]">
                <span className="inline-flex w-4 h-4 rounded-full bg-gradient-to-br from-lg-cyan via-lg-violet to-lg-magenta" />
                <span className="font-semibold tracking-tight">Let It Go AI</span>
                <span className="ml-auto text-lg-ink-muted">4-7-8 · 2:47</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
                <p className="text-[9px] uppercase tracking-[0.32em] lg-gradient-text">
                    Co-regulation
                </p>
                <h1 className="mt-2 text-xl md:text-2xl font-semibold tracking-[-0.02em]">
                    Breathe with the <span className="lg-gradient-text italic">arc</span>.
                </h1>

                <div className="relative mt-4 w-40 h-40 flex items-center justify-center">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`absolute inset-0 rounded-full border border-white/10 ${reduce ? "" : "animate-pulse"}`}
                            style={{
                                transform: `scale(${1 - i * 0.16})`,
                                animationDelay: `${i * 0.6}s`,
                                boxShadow: "0 0 40px rgba(139,77,255,0.4)",
                            }}
                        />
                    ))}
                    <div
                        className="relative w-20 h-20 rounded-full flex items-center justify-center text-white"
                        style={{
                            background: "linear-gradient(135deg,#21D4FD,#8B4DFF,#FF3CAC)",
                            boxShadow: "0 0 60px rgba(139,77,255,0.6)",
                        }}
                    >
                        <span className="text-[11px] uppercase tracking-[0.3em]">Inhale</span>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                    {["Inhale · 4", "Hold · 7", "Exhale · 8"].map((s, i) => (
                        <span
                            key={s}
                            className={`px-3 py-1 rounded-full text-[11px] border ${
                                i === 0
                                    ? "bg-white/10 text-lg-ink border-white/20"
                                    : "bg-white/[0.02] text-lg-ink-muted border-white/[0.08]"
                            }`}
                        >
                            {s}
                        </span>
                    ))}
                </div>

                <div className="mt-5 w-full max-w-md rounded-xl bg-white/[0.04] border border-white/10 p-3">
                    <p className="text-[9px] uppercase tracking-[0.25em] lg-gradient-text mb-1">
                        Ambient
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-lg-ink-soft">
                        <span className="w-2 h-2 rounded-full bg-lg-cyan" />
                        <span>Rain · warm</span>
                        <span className="ml-auto text-lg-ink-muted">32%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   View 4 — Insights / Progress
   ───────────────────────────────────────────────────────────── */
function InsightsView() {
    return (
        <div className="w-full h-full flex flex-col text-lg-ink overflow-hidden">
            <div className="px-6 py-3 border-b border-white/[0.06] flex items-center gap-2 text-[11px]">
                <span className="inline-flex w-4 h-4 rounded-full bg-gradient-to-br from-lg-cyan via-lg-violet to-lg-magenta" />
                <span className="font-semibold tracking-tight">Let It Go AI</span>
                <span className="ml-auto text-lg-ink-muted">Insights · 30d</span>
            </div>
            <div className="flex-1 p-5 md:p-6 grid grid-cols-12 gap-4 overflow-hidden">
                {/* Big trend chart */}
                <div className="col-span-12 lg-panel rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-lg-ink-muted">
                            Emotional signal trends
                        </p>
                        <div className="flex gap-2 text-[10px] text-lg-ink-soft">
                            <LegendDot c="#5E8BFF" label="Calm" />
                            <LegendDot c="#8B4DFF" label="Focus" />
                            <LegendDot c="#FF3CAC" label="Anxiety" />
                        </div>
                    </div>
                    <svg viewBox="0 0 400 90" className="w-full h-24">
                        {[0, 1, 2, 3].map((i) => (
                            <line key={i} x1="0" x2="400" y1={22 * i + 4} y2={22 * i + 4} stroke="rgba(255,255,255,0.04)" />
                        ))}
                        <path
                            d="M0 60 L30 55 L60 50 L90 48 L120 40 L150 42 L180 35 L210 30 L240 32 L270 24 L300 28 L330 20 L360 22 L400 14"
                            fill="none" stroke="#5E8BFF" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                            d="M0 68 L30 60 L60 62 L90 55 L120 58 L150 50 L180 46 L210 42 L240 40 L270 34 L300 36 L330 28 L360 30 L400 22"
                            fill="none" stroke="#8B4DFF" strokeWidth="1.5" strokeLinecap="round" />
                        <path
                            d="M0 30 L30 34 L60 32 L90 38 L120 36 L150 42 L180 48 L210 52 L240 55 L270 62 L300 60 L330 68 L360 70 L400 78"
                            fill="none" stroke="#FF3CAC" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Streak calendar */}
                <div className="col-span-7 lg-panel rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold">Check-in streak</p>
                        <span className="text-[10px] text-lg-ink-soft">27 of 30</span>
                    </div>
                    <div className="grid grid-cols-10 gap-1">
                        {Array.from({ length: 30 }).map((_, i) => {
                            const missed = i === 8 || i === 17 || i === 24;
                            const intensity = missed ? 0 : 0.4 + ((i * 13) % 60) / 100;
                            return (
                                <span
                                    key={i}
                                    className="aspect-square rounded"
                                    style={{
                                        background: missed
                                            ? "rgba(255,255,255,0.05)"
                                            : `rgba(139,77,255,${intensity})`,
                                        boxShadow: missed
                                            ? "none"
                                            : `0 0 6px rgba(139,77,255,${intensity * 0.4})`,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Stats */}
                <div className="col-span-5 flex flex-col gap-3">
                    <StatTile label="Best day" value="Wed" sub="EQ 82" />
                    <StatTile label="Weekly Δ" value="+6.2" sub="Trending up" />
                    <StatTile label="Longest streak" value="9 days" sub="Since Feb 3" />
                </div>
            </div>
        </div>
    );
}

function LegendDot({ c, label }) {
    return (
        <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
            {label}
        </span>
    );
}

function StatTile({ label, value, sub }) {
    return (
        <div className="lg-panel rounded-2xl p-3 flex flex-col justify-center">
            <p className="text-[9px] uppercase tracking-[0.28em] text-lg-ink-muted">{label}</p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.02em] lg-gradient-text">
                {value}
            </p>
            <p className="text-[10px] text-lg-ink-soft">{sub}</p>
        </div>
    );
}
