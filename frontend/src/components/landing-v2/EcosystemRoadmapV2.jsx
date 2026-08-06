import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Circle } from "lucide-react";
import {
    Section,
    GradientHeadline,
    GlassCard,
    StatusBadge,
    SecondaryButton,
} from "@/components/ds";
import { ArrowUpRight } from "lucide-react";

/**
 * EcosystemRoadmapV2 — premium horizontal 4-phase roadmap.
 *
 * Copy is deliberately date-free — no month/quarter/year attached to any phase
 * until the founder approves timing. Status badges use LIVE / IN DEVELOPMENT
 * / PLANNED / LONG-TERM VISION taxonomy.
 */

const PHASE_TONES = ["cyan", "blue", "violet", "magenta"];

const TONE = {
    cyan: {
        dot: "#21D4FD",
        ring: "rgba(33,212,253,0.55)",
        bg: "rgba(33,212,253,0.12)",
        border: "rgba(33,212,253,0.4)",
    },
    blue: {
        dot: "#356BFF",
        ring: "rgba(53,107,255,0.55)",
        bg: "rgba(53,107,255,0.12)",
        border: "rgba(53,107,255,0.4)",
    },
    violet: {
        dot: "#8B4DFF",
        ring: "rgba(139,77,255,0.55)",
        bg: "rgba(139,77,255,0.12)",
        border: "rgba(139,77,255,0.4)",
    },
    magenta: {
        dot: "#FF3CAC",
        ring: "rgba(255,60,172,0.55)",
        bg: "rgba(255,60,172,0.12)",
        border: "rgba(255,60,172,0.4)",
    },
};

export default function EcosystemRoadmapV2() {
    const reduce = useReducedMotion();
    const { t } = useTranslation();
    const PHASES = [1, 2, 3, 4].map((n, i) => ({
        num: `${t("v2Landing.roadmap.phaseLabel")} 0${n}`,
        eyebrow: t(`v2Landing.roadmap.p${n}e`),
        title: t(`v2Landing.roadmap.p${n}t`),
        status: t(`v2Landing.roadmap.p${n}s`),
        statusKey: ["LIVE", "IN DEVELOPMENT", "PLANNED", "LONG-TERM VISION"][i],
        tone: PHASE_TONES[i],
        items: t(`v2Landing.roadmap.p${n}items`, { returnObjects: true }),
    }));
    const anim = (delay = 0) =>
        reduce
            ? { initial: false }
            : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-80px" },
                  transition: { duration: 0.7, delay },
              };

    return (
        <Section
            id="roadmap"
            size="lg"
            data-testid="ecosystem-roadmap-section"
            className="overflow-hidden"
        >
            <div aria-hidden="true" className="lg-ambient opacity-60" />

            <div className="relative">
                {/* Header */}
                <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                    <div className="max-w-2xl">
                        <StatusBadge tone="violet" className="mb-8">
                            {t("v2Landing.roadmap.eyebrow")}
                        </StatusBadge>
                        <GradientHeadline
                            as="h2"
                            size="lg"
                            data-testid="ecosystem-roadmap-headline"
                        >
                            {t("v2Landing.roadmap.headlinePre")}
                            <br />
                            <span className="lg-gradient-text italic">
                                {t("v2Landing.roadmap.headlineGradient")}
                            </span>
                            {t("v2Landing.roadmap.headlinePost")}
                        </GradientHeadline>
                    </div>
                    <SecondaryButton
                        as="a"
                        href="/ecosystem"
                        data-testid="ecosystem-roadmap-full"
                        size="md"
                        icon={<ArrowUpRight size={14} />}
                    >
                        {t("v2Landing.roadmap.fullLink")}
                    </SecondaryButton>
                </div>

                {/* Roadmap */}
                <div className="relative">
                    {/* Horizontal connector — desktop only */}
                    <div
                        aria-hidden="true"
                        className="hidden lg:block absolute top-9 left-[6%] right-[6%] h-px pointer-events-none z-0"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent 0%, #21D4FD 10%, #356BFF 35%, #8B4DFF 60%, #FF3CAC 85%, transparent 100%)",
                            opacity: 0.5,
                        }}
                    />

                    <ol
                        role="list"
                        data-testid="ecosystem-roadmap-phases"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5"
                    >
                        {PHASES.map((p, i) => (
                            <motion.li
                                key={p.num}
                                {...anim(i * 0.08)}
                                data-testid={`roadmap-phase-${i + 1}`}
                                className="relative flex flex-col"
                            >
                                {/* Phase node — desktop only */}
                                <div className="hidden lg:flex mb-6 justify-center">
                                    <PhaseNode
                                        index={i + 1}
                                        tone={p.tone}
                                        live={p.statusKey === "LIVE"}
                                        reduce={reduce}
                                    />
                                </div>

                                <GlassCard
                                    padding="lg"
                                    radius="lg"
                                    accent={p.tone}
                                    className="h-full flex flex-col"
                                >
                                    {/* Status pill on its own row (avoids wrapping on narrow 4-col desktop layout) */}
                                    <StatusPill
                                        status={p.status}
                                        statusKey={p.statusKey}
                                        tone={p.tone}
                                        reduce={reduce}
                                    />

                                    <div className="mt-4">
                                        <span className="lg-eyebrow text-lg-ink-muted whitespace-nowrap">
                                            {p.num}
                                        </span>
                                        <p className="text-[9px] uppercase tracking-[0.24em] text-lg-ink-muted opacity-60 mt-1 whitespace-nowrap">
                                            {p.eyebrow}
                                        </p>
                                    </div>
                                    <h3 className="mt-3 text-2xl md:text-[26px] font-semibold text-lg-ink tracking-[-0.02em] mb-6">
                                        {p.title}
                                    </h3>

                                    <ul className="space-y-3 flex-1">
                                        {p.items.map((item) => (
                                            <li
                                                key={item}
                                                className={`flex items-start gap-3 text-[14px] ${
                                                    p.statusKey === "LIVE"
                                                        ? "text-lg-ink"
                                                        : "text-lg-ink-soft"
                                                }`}
                                            >
                                                <ItemIndicator
                                                    live={p.statusKey === "LIVE"}
                                                    tone={p.tone}
                                                    dashed={
                                                        p.statusKey ===
                                                            "LONG-TERM VISION"
                                                    }
                                                />
                                                <span className="leading-snug">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </GlassCard>
                            </motion.li>
                        ))}
                    </ol>
                </div>

                {/* Footer disclaimer */}
                <p
                    data-testid="roadmap-disclaimer"
                    className="mt-10 md:mt-14 text-xs text-lg-ink-muted max-w-3xl leading-relaxed"
                >
                    {t("v2Landing.roadmap.disclaimer")}
                </p>
            </div>
        </Section>
    );
}

/* ────────────────────────────────────────────────────────────── */

function PhaseNode({ index, tone, live, reduce }) {
    const t = TONE[tone];
    return (
        <div className="relative z-10">
            {live && !reduce && (
                <span
                    className="absolute inset-0 rounded-full opacity-60"
                    style={{
                        background: t.dot,
                        animation:
                            "lg-live-ping 2.2s cubic-bezier(0,0,0.2,1) infinite",
                    }}
                />
            )}
            <div
                className="relative w-[52px] h-[52px] rounded-full flex items-center justify-center font-semibold text-[15px] tracking-[-0.01em] text-lg-ink"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                    border: `1px solid ${t.border}`,
                    boxShadow: `0 0 24px ${t.ring}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
            >
                {String(index).padStart(2, "0")}
            </div>
        </div>
    );
}

function StatusPill({ status, statusKey, tone, reduce }) {
    const t = TONE[tone];
    return (
        <span
            className="self-start inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[9.5px] uppercase tracking-[0.24em] font-semibold text-lg-ink border whitespace-nowrap max-w-full"
            style={{ background: t.bg, borderColor: t.border }}
            data-testid={`roadmap-status-${statusKey.toLowerCase().replace(/\s+/g, "-")}`}
        >
            <span className="relative inline-flex h-1.5 w-1.5">
                {statusKey === "LIVE" && !reduce && (
                    <span
                        className="absolute inline-flex h-full w-full rounded-full opacity-70"
                        style={{
                            background: t.dot,
                            animation:
                                "lg-live-ping 2s cubic-bezier(0,0,0.2,1) infinite",
                        }}
                    />
                )}
                <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{
                        background: t.dot,
                        boxShadow: `0 0 8px ${t.ring}`,
                    }}
                />
            </span>
            {status}
        </span>
    );
}

function ItemIndicator({ live, tone, dashed }) {
    const t = TONE[tone];
    if (live) {
        return (
            <span
                className="mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                style={{
                    background:
                        "linear-gradient(135deg, #21D4FD, #8B4DFF)",
                }}
            >
                <Check size={10} strokeWidth={3} className="text-white" />
            </span>
        );
    }
    return (
        <span
            aria-hidden="true"
            className="mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
            style={
                dashed
                    ? { border: `1px dashed ${t.dot}` }
                    : {
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${t.dot}`,
                      }
            }
        >
            <Circle size={4} strokeWidth={0} fill={t.dot} className="opacity-90" />
        </span>
    );
}
