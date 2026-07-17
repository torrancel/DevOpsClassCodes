import { motion, useReducedMotion } from "framer-motion";
import { Check, Circle, Sparkles } from "lucide-react";
import {
    Section,
    GradientHeadline,
    GlassCard,
    PrimaryButton,
    StatusBadge,
} from "@/components/ds";

/**
 * TimelineV2 — "Built for Today. Designed for Tomorrow."
 * Three horizon cards. Card 1 (Today) is emphasized with LIVE indicator + CTA.
 * Cards 2 & 3 explicitly label items as not currently available.
 */

const TODAY = {
    label: "Available Now",
    title: "Functional Web MVP",
    items: [
        "AI-guided emotional wellness experience",
        "Daily mood check-ins",
        "Guided breathing and mindfulness",
        "Personal growth dashboard",
        "Secure cloud-based application",
    ],
};

const NEXT = {
    label: "In Development",
    title: "The Next Product Layer",
    items: [
        "Apple Watch companion",
        "Deeper personalization",
        "Adaptive insights",
        "Closed beta testing",
        "User analytics",
    ],
};

const FUTURE = {
    label: "Future Roadmap",
    title: "Connected Emotional Intelligence",
    items: [
        "AI smart ring",
        "Enterprise platform",
        "Healthcare partnerships",
        "Connected mobility",
        "Developer APIs",
    ],
};

export default function TimelineV2() {
    const reduce = useReducedMotion();
    const anim = (delay = 0) =>
        reduce
            ? { initial: false, animate: undefined }
            : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-80px" },
                  transition: { duration: 0.75, delay },
              };

    return (
        <Section id="timeline" size="lg" data-testid="timeline-section">
            <div className="mb-14 md:mb-20 max-w-3xl">
                <StatusBadge tone="cyan" className="mb-8">
                    Product Timeline
                </StatusBadge>
                <GradientHeadline as="h2" size="lg" data-testid="timeline-headline">
                    Built for Today.
                    <br />
                    <span className="lg-gradient-text italic">
                        Designed for Tomorrow
                    </span>
                    .
                </GradientHeadline>
                <p className="mt-8 text-lg text-lg-ink-soft max-w-2xl leading-relaxed">
                    A grounded present. A visible horizon. What ships today, what is
                    being built next, and where the ecosystem is heading.
                </p>
            </div>

            {/* Grid: mobile 1-col, tablet 2-col (card 1 full width), desktop 3-col equal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 items-stretch">
                {/* CARD 1 — TODAY */}
                <motion.div
                    {...anim(0)}
                    data-testid="timeline-card-today"
                    className="relative md:col-span-2 lg:col-span-1"
                >
                    {/* Gradient border wrapper — only on the emphasized card */}
                    <div
                        aria-hidden="true"
                        className="absolute -inset-[1.5px] rounded-[26px] opacity-95 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(140deg, #21D4FD 0%, #356BFF 35%, #8B4DFF 70%, #FF3CAC 100%)",
                        }}
                    />
                    <div
                        aria-hidden="true"
                        className="absolute -inset-6 -z-10 blur-3xl opacity-60 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 50%, rgba(33,212,253,0.25) 0%, rgba(53,107,255,0.18) 45%, transparent 75%)",
                        }}
                    />
                    <GlassCard
                        padding="lg"
                        radius="lg"
                        accent="cyan"
                        className="h-full flex flex-col relative"
                    >
                        {/* Single "LIVE — AVAILABLE NOW" pill */}
                        <div className="mb-8">
                            <span
                                data-testid="timeline-live-indicator"
                                className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.28em] font-semibold text-lg-ink bg-[rgba(33,212,253,0.14)] border border-[rgba(33,212,253,0.4)]"
                            >
                                <LivePulse reduce={reduce} />
                                Live · {TODAY.label}
                            </span>
                        </div>

                        <h3 className="lg-h3 text-lg-ink mb-6">{TODAY.title}</h3>

                        <ul className="space-y-3 flex-1 mb-8">
                            {TODAY.items.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-3 text-[15px] text-lg-ink"
                                >
                                    <span
                                        className="mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #21D4FD, #8B4DFF)",
                                        }}
                                    >
                                        <Check size={10} strokeWidth={3} className="text-white" />
                                    </span>
                                    <span className="leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <PrimaryButton
                            as="a"
                            href="/app"
                            data-testid="timeline-today-cta"
                            size="md"
                            className="w-full"
                        >
                            Explore the MVP
                        </PrimaryButton>
                    </GlassCard>
                </motion.div>

                {/* CARD 2 — UNDER DEVELOPMENT */}
                <motion.div
                    {...anim(0.1)}
                    data-testid="timeline-card-next"
                >
                    <GlassCard
                        padding="lg"
                        radius="lg"
                        accent="violet"
                        className="h-full flex flex-col"
                    >
                        <div className="mb-8">
                            <StageBadge tone="violet" label={NEXT.label} />
                        </div>

                        <h3 className="lg-h3 text-lg-ink mb-6">{NEXT.title}</h3>

                        <ul className="space-y-3 flex-1 mb-8">
                            {NEXT.items.map((item) => (
                                <ConceptLi key={item} tone="violet" label={item} />
                            ))}
                        </ul>

                        <p className="text-[11px] uppercase tracking-[0.22em] text-lg-ink-muted border-t border-white/[0.06] pt-5">
                            Not currently available · In active build
                        </p>
                    </GlassCard>
                </motion.div>

                {/* CARD 3 — LONG-TERM VISION */}
                <motion.div
                    {...anim(0.2)}
                    data-testid="timeline-card-future"
                >
                    <GlassCard
                        padding="lg"
                        radius="lg"
                        accent="magenta"
                        className="h-full flex flex-col"
                    >
                        <div className="mb-8">
                            <StageBadge tone="magenta" label={FUTURE.label} />
                        </div>

                        <h3 className="lg-h3 text-lg-ink mb-6">{FUTURE.title}</h3>

                        <ul className="space-y-3 flex-1 mb-8">
                            {FUTURE.items.map((item) => (
                                <ConceptLi
                                    key={item}
                                    tone="magenta"
                                    label={item}
                                    hollow
                                />
                            ))}
                        </ul>

                        <p className="text-[11px] uppercase tracking-[0.22em] text-lg-ink-muted border-t border-white/[0.06] pt-5">
                            Conceptual · Multi-year vision, not shipping today
                        </p>
                    </GlassCard>
                </motion.div>
            </div>

            {/* Global disclaimer */}
            <p
                data-testid="timeline-disclaimer"
                className="mt-10 md:mt-14 text-xs text-lg-ink-muted max-w-3xl leading-relaxed"
            >
                <Sparkles size={11} className="inline-block mr-1.5 -mt-0.5 text-lg-ink-soft" strokeWidth={1.5} />
                Only the Functional Web MVP is available today. Apple Watch, AI smart
                ring, healthcare, enterprise, mobility integrations, and developer APIs
                are aspirational and not yet shipping.
            </p>
        </Section>
    );
}

/* ────────────────────────────────────────────────────────────── */

function LivePulse({ reduce }) {
    return (
        <span className="relative inline-flex h-2 w-2">
            {!reduce && (
                <span
                    className="absolute inline-flex h-full w-full rounded-full opacity-70"
                    style={{
                        background: "#21D4FD",
                        animation: "lg-live-ping 2s cubic-bezier(0,0,0.2,1) infinite",
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
    );
}

function StageBadge({ tone, label }) {
    const c = {
        violet: {
            bg: "rgba(139,77,255,0.14)",
            bd: "rgba(139,77,255,0.4)",
            dot: "#8B4DFF",
        },
        magenta: {
            bg: "rgba(255,60,172,0.12)",
            bd: "rgba(255,60,172,0.36)",
            dot: "#FF3CAC",
        },
    }[tone];
    return (
        <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] font-semibold text-lg-ink border"
            style={{ background: c.bg, borderColor: c.bd }}
        >
            <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: c.dot, boxShadow: `0 0 8px ${c.dot}` }}
            />
            {label}
        </span>
    );
}

function ConceptLi({ tone, label, hollow = false }) {
    const dot = { violet: "#8B4DFF", magenta: "#FF3CAC" }[tone];
    return (
        <li className="flex items-start gap-3 text-[15px] text-lg-ink-soft">
            <span
                aria-hidden="true"
                className="mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                style={
                    hollow
                        ? {
                              border: `1px dashed ${dot}`,
                          }
                        : {
                              background: "rgba(255,255,255,0.04)",
                              border: `1px solid ${dot}`,
                          }
                }
            >
                <Circle
                    size={4}
                    strokeWidth={0}
                    fill={dot}
                    className="opacity-90"
                />
            </span>
            <span className="leading-snug">{label}</span>
        </li>
    );
}
