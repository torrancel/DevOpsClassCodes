import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    MessageCircle,
    BrainCircuit,
    Sparkles,
    Wind,
    TrendingUp,
} from "lucide-react";
import {
    Section,
    GradientHeadline,
    GlassCard,
    StatusBadge,
} from "@/components/ds";

/**
 * SignalToSupportV2 — 5-step process section.
 * "From Signal to Support." — horizontal on desktop, vertical on mobile.
 *
 * Copy is deliberately non-diagnostic: nothing implies the product reads
 * emotions accurately, diagnoses, or treats conditions. Uses "identifies
 * patterns across user-provided information" and "supports self-regulation".
 */

const STEP_META = [
    { Icon: MessageCircle, color: "#21D4FD" },
    { Icon: BrainCircuit, color: "#356BFF" },
    { Icon: Sparkles, color: "#8B4DFF" },
    { Icon: Wind, color: "#FF3CAC" },
    { Icon: TrendingUp, color: "#21D4FD" },
];

export default function SignalToSupportV2() {
    const reduce = useReducedMotion();
    const { t } = useTranslation();
    const STEPS = [
        { n: "01", title: t("v2Landing.signal.steps.s1t"), body: t("v2Landing.signal.steps.s1b"), ...STEP_META[0] },
        { n: "02", title: t("v2Landing.signal.steps.s2t"), body: t("v2Landing.signal.steps.s2b"), ...STEP_META[1] },
        { n: "03", title: t("v2Landing.signal.steps.s3t"), body: t("v2Landing.signal.steps.s3b"), ...STEP_META[2] },
        { n: "04", title: t("v2Landing.signal.steps.s4t"), body: t("v2Landing.signal.steps.s4b"), ...STEP_META[3] },
        { n: "05", title: t("v2Landing.signal.steps.s5t"), body: t("v2Landing.signal.steps.s5b"), ...STEP_META[4] },
    ];
    const DISCLAIMERS = [
        { eyebrow: t("v2Landing.signal.d1e"), tone: "cyan", body: t("v2Landing.signal.d1b") },
        { eyebrow: t("v2Landing.signal.d2e"), tone: "violet", body: t("v2Landing.signal.d2b") },
        { eyebrow: t("v2Landing.signal.d3e"), tone: "magenta", body: t("v2Landing.signal.d3b") },
    ];
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
        <Section id="how" size="lg" data-testid="signal-to-support-section">
            {/* Header */}
            <div className="mb-14 md:mb-20 max-w-3xl">
                <StatusBadge tone="violet" className="mb-8">
                    {t("v2Landing.signal.eyebrow")}
                </StatusBadge>
                <GradientHeadline as="h2" size="lg" data-testid="signal-headline">
                    {t("v2Landing.signal.headlinePre")} <span className="lg-gradient-text italic">{t("v2Landing.signal.headlineGradient")}</span>{t("v2Landing.signal.headlinePost")}
                </GradientHeadline>
                <p className="mt-8 text-lg text-lg-ink-soft max-w-2xl leading-relaxed">
                    {t("v2Landing.signal.sub")}
                </p>
            </div>

            {/* Steps flow */}
            <div className="relative">
                {/* Horizontal connector — desktop only */}
                <div
                    aria-hidden="true"
                    className="hidden lg:block absolute top-9 left-[6%] right-[6%] h-px pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent 0%, #21D4FD 8%, #356BFF 30%, #8B4DFF 55%, #FF3CAC 80%, transparent 100%)",
                        opacity: 0.55,
                    }}
                />

                {/* Vertical rail — mobile / tablet */}
                <div
                    aria-hidden="true"
                    className="lg:hidden absolute top-6 bottom-6 left-[27px] w-px pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(180deg, transparent 0%, #21D4FD 10%, #356BFF 30%, #8B4DFF 55%, #FF3CAC 80%, transparent 100%)",
                        opacity: 0.5,
                    }}
                />

                <ol
                    role="list"
                    data-testid="signal-steps"
                    className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-4"
                >
                    {STEPS.map((s, i) => (
                        <motion.li
                            key={s.n}
                            {...anim(i * 0.08)}
                            data-testid={`signal-step-${i + 1}`}
                            className="relative flex lg:flex-col gap-5 lg:gap-6"
                        >
                            {/* Step node — number circle */}
                            <div className="relative shrink-0 lg:mx-auto">
                                <div
                                    className="relative w-[54px] h-[54px] rounded-full flex items-center justify-center font-semibold text-[15px] tracking-[-0.01em] text-lg-ink z-10"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                                        border: `1px solid ${s.color}55`,
                                        boxShadow: `0 0 32px ${s.color}33, inset 0 1px 0 rgba(255,255,255,0.08)`,
                                    }}
                                >
                                    {s.n}
                                </div>
                            </div>

                            {/* Card */}
                            <GlassCard
                                padding="md"
                                radius="md"
                                className="flex-1 lg:mt-2"
                                accent={
                                    i === 0
                                        ? "cyan"
                                        : i === 1
                                            ? "blue"
                                            : i === 2
                                                ? "violet"
                                                : i === 3
                                                    ? "magenta"
                                                    : "cyan"
                                }
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <s.Icon
                                        size={18}
                                        strokeWidth={1.5}
                                        style={{ color: s.color }}
                                    />
                                    <h3 className="text-[17px] md:text-lg font-semibold text-lg-ink tracking-[-0.015em]">
                                        {s.title}
                                    </h3>
                                </div>
                                <p className="text-[14px] leading-relaxed text-lg-ink-soft">
                                    {s.body}
                                </p>
                            </GlassCard>
                        </motion.li>
                    ))}
                </ol>
            </div>

            {/* Availability disclaimers */}
            <div className="mt-16 md:mt-24">
                <p className="lg-eyebrow text-lg-ink-muted mb-5">
                    {t("v2Landing.signal.activeStagesLabel")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    {DISCLAIMERS.map((d, i) => (
                        <GlassCard
                            key={d.eyebrow}
                            padding="md"
                            radius="md"
                            accent={d.tone}
                            data-testid={`signal-disclaimer-${i}`}
                            className="h-full"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span
                                    aria-hidden="true"
                                    className="inline-block h-1.5 w-1.5 rounded-full"
                                    style={{
                                        background:
                                            d.tone === "cyan"
                                                ? "#21D4FD"
                                                : d.tone === "violet"
                                                    ? "#8B4DFF"
                                                    : "#FF3CAC",
                                        boxShadow: `0 0 10px ${
                                            d.tone === "cyan"
                                                ? "rgba(33,212,253,0.6)"
                                                : d.tone === "violet"
                                                    ? "rgba(139,77,255,0.6)"
                                                    : "rgba(255,60,172,0.6)"
                                        }`,
                                    }}
                                />
                                <span className="lg-eyebrow text-lg-ink-muted">
                                    {d.eyebrow}
                                </span>
                            </div>
                            <p className="text-[15px] leading-relaxed text-lg-ink">
                                {d.body}
                            </p>
                        </GlassCard>
                    ))}
                </div>
            </div>

            {/* Bottom disclaimer — non-diagnostic language */}
            <p
                data-testid="signal-safety-disclaimer"
                className="mt-10 md:mt-14 text-xs text-lg-ink-muted max-w-3xl leading-relaxed"
            >
                {t("v2Landing.signal.safetyDisclaimer")}
            </p>
        </Section>
    );
}
