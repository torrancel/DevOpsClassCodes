import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Quote, ArrowUpRight } from "lucide-react";
import {
    Section,
    GradientHeadline,
    SecondaryButton,
    StatusBadge,
} from "@/components/ds";

/**
 * FounderSectionV2 — respectful, human, mission-driven founder story.
 *
 * PORTRAIT_URL — set to a valid image URL when the founder provides a photo.
 * Until then, an initials-based placeholder renders (never a stock face —
 * this is a real person and using stock imagery would be dishonest).
 */
const PORTRAIT_URL =
    "https://customer-assets-m6fa6gv7.emergentagent.net/job_page-launch-106/artifacts/l8ywx5um_IMG_0017.webp";

const FOUNDER = {
    name: "Torrance Lillie",
    initials: "TL",
};

export default function FounderSectionV2() {
    const reduce = useReducedMotion();
    const { t } = useTranslation();
    const anim = (delay = 0) =>
        reduce
            ? { initial: false }
            : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-80px" },
                  transition: { duration: 0.8, delay },
              };

    return (
        <Section
            id="founder"
            size="lg"
            data-testid="founder-section"
            className="overflow-hidden"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                {/* Portrait */}
                <motion.div
                    {...anim(0)}
                    className="lg:col-span-5"
                    data-testid="founder-portrait"
                >
                    <Portrait t={t} />
                </motion.div>

                {/* Story */}
                <motion.div
                    {...anim(0.1)}
                    className="lg:col-span-7 lg:pl-4"
                >
                    <StatusBadge tone="cyan" className="mb-8">
                        {t("v2Landing.founder.eyebrow")}
                    </StatusBadge>
                    <GradientHeadline
                        as="h2"
                        size="lg"
                        data-testid="founder-headline"
                    >
                        {t("v2Landing.founder.headlinePre")}{" "}
                        <span className="lg-gradient-text italic">
                            {t("v2Landing.founder.headlineGradient")}
                        </span>
                        {t("v2Landing.founder.headlinePost")}
                    </GradientHeadline>

                    <div className="mt-8 space-y-6 text-lg text-lg-ink-soft leading-relaxed max-w-2xl">
                        <p data-testid="founder-body-1">
                            {t("v2Landing.founder.body1")}
                        </p>
                        <p data-testid="founder-body-2">
                            {t("v2Landing.founder.body2")}
                        </p>
                    </div>

                    {/* Closing statement */}
                    <blockquote
                        data-testid="founder-closing"
                        className="mt-10 relative pl-6 border-l border-white/10 max-w-2xl"
                    >
                        <Quote
                            size={16}
                            strokeWidth={1.5}
                            className="absolute -left-[9px] top-1 text-lg-violet bg-lg-bg px-0.5"
                        />
                        <p className="text-[19px] md:text-xl text-lg-ink leading-relaxed italic font-normal tracking-[-0.005em]">
                            {t("v2Landing.founder.closing")}
                        </p>
                    </blockquote>

                    {/* Attribution */}
                    <div className="mt-10 flex items-center gap-4">
                        <div className="h-px flex-shrink-0 w-10 bg-gradient-to-r from-lg-cyan via-lg-violet to-lg-magenta" />
                        <div>
                            <p
                                data-testid="founder-name"
                                className="text-lg-ink font-semibold tracking-[-0.01em]"
                            >
                                {FOUNDER.name}
                            </p>
                            <p className="text-sm text-lg-ink-soft mt-0.5">
                                {t("v2Landing.founder.title")}
                            </p>
                        </div>
                    </div>

                    {/* Deeper story link */}
                    <div className="mt-10">
                        <SecondaryButton
                            as="a"
                            href="/founder"
                            data-testid="founder-read-more"
                            size="md"
                            icon={<ArrowUpRight size={14} />}
                        >
                            {t("v2Landing.founder.readMore")}
                        </SecondaryButton>
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

/* ─────────────────────────────────────────────────────────────
   Portrait — real photo if PORTRAIT_URL set, otherwise a
   respectful initials-based placeholder (no stock imagery).
   ───────────────────────────────────────────────────────────── */
function Portrait({ t }) {
    return (
        <div className="relative mx-auto max-w-[440px]">
            {/* Ambient glow behind portrait */}
            <div
                aria-hidden="true"
                className="absolute -inset-8 -z-10 blur-3xl opacity-70 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at 30% 40%, rgba(53,107,255,0.28) 0%, rgba(139,77,255,0.22) 35%, transparent 72%)",
                }}
            />

            {/* Portrait frame */}
            <div
                className="relative aspect-[4/5] rounded-[28px] p-[1.5px]"
                style={{
                    background:
                        "linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.16) 100%)",
                    boxShadow:
                        "0 60px 140px -30px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)",
                }}
            >
                <div
                    className="w-full h-full rounded-[26px] overflow-hidden relative"
                    style={{
                        background:
                            "linear-gradient(180deg, #0A0A12 0%, #060609 100%)",
                    }}
                >
                    {PORTRAIT_URL ? (
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <img
                                src={PORTRAIT_URL}
                                alt={`Portrait of ${FOUNDER.name}, Founder of Let It Go AI`}
                                className="object-cover"
                                style={{
                                    width: "125%",
                                    height: "80%",
                                    transform: "rotate(90deg)",
                                    transformOrigin: "center",
                                }}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    ) : (
                        <PortraitPlaceholder t={t} />
                    )}
                </div>
            </div>

            {/* Bottom-right identity chip */}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 pointer-events-none">
                <div className="lg-panel rounded-2xl px-4 py-3 backdrop-blur-2xl">
                    <p className="lg-eyebrow lg-gradient-text mb-1">{t("v2Landing.founder.portraitCaption")}</p>
                    <p className="text-sm font-semibold text-lg-ink tracking-[-0.01em] whitespace-nowrap">
                        {FOUNDER.name}
                    </p>
                </div>
            </div>
        </div>
    );
}

function PortraitPlaceholder({ t }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Soft radial */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 50% 45%, rgba(139,77,255,0.28) 0%, rgba(53,107,255,0.14) 40%, transparent 72%)",
                }}
            />
            <div className="relative flex flex-col items-center">
                <div
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-semibold tracking-[-0.02em]"
                    style={{
                        background:
                            "linear-gradient(135deg,#21D4FD,#356BFF,#8B4DFF,#FF3CAC)",
                        boxShadow:
                            "0 0 80px rgba(139,77,255,0.55), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                    aria-hidden="true"
                >
                    {FOUNDER.initials}
                </div>
                <p className="mt-6 lg-eyebrow text-lg-ink-muted">
                    {t("v2Landing.founder.portraitForthcoming")}
                </p>
            </div>
        </div>
    );
}
