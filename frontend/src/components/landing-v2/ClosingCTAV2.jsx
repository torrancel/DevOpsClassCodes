import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Handshake, Sparkles } from "lucide-react";
import {
    Section,
    GradientHeadline,
    PrimaryButton,
    SecondaryButton,
} from "@/components/ds";
import { useLandingModal } from "@/components/landing-v2/LandingModalContext";

/**
 * ClosingCTAV2 — final cinematic call to action.
 * Three parallel paths in: early user, investor, partner.
 * Anchor id="cta" preserved so Nav "Request Early Access" continues to work.
 */
export default function ClosingCTAV2() {
    const reduce = useReducedMotion();
    const modal = useLandingModal();
    const anim = (delay = 0) =>
        reduce
            ? { initial: false }
            : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-80px" },
                  transition: { duration: 0.85, delay },
              };

    return (
        <Section
            id="cta"
            size="lg"
            data-testid="closing-cta-section"
            className="overflow-hidden pb-32 md:pb-48"
        >
            {/* Ambient bed — soft, layered, single-source cinematic glow */}
            <div aria-hidden="true" className="lg-ambient opacity-90" />

            {/* Faint grid backdrop */}
            <div
                aria-hidden="true"
                className="absolute inset-0 lg-grid-bg pointer-events-none opacity-70"
            />

            {/* Slow drifting glow blob — depth */}
            {!reduce && (
                <div
                    aria-hidden="true"
                    className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] pointer-events-none opacity-60"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 50%, rgba(139,77,255,0.35) 0%, rgba(53,107,255,0.22) 30%, rgba(255,60,172,0.15) 55%, transparent 75%)",
                        filter: "blur(60px)",
                        animation: "lg-float 12s ease-in-out infinite",
                    }}
                />
            )}

            <div className="relative text-center">
                <motion.div {...anim(0)}>
                    <span
                        className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[10.5px] uppercase tracking-[0.32em] font-medium text-lg-ink-soft bg-white/[0.04] border border-white/10 backdrop-blur"
                    >
                        <Sparkles size={11} className="text-lg-cyan" strokeWidth={1.5} />
                        The Invitation
                    </span>
                </motion.div>

                <motion.h2
                    {...anim(0.12)}
                    data-testid="closing-headline"
                    className="lg-h1 text-lg-ink mt-10 max-w-[18ch] mx-auto"
                >
                    Help Build the Future of{" "}
                    <span className="lg-gradient-text italic">
                        Emotional Intelligence
                    </span>
                    .
                </motion.h2>

                <motion.p
                    {...anim(0.28)}
                    data-testid="closing-copy"
                    className="mt-10 text-lg md:text-xl text-lg-ink-soft max-w-2xl mx-auto leading-relaxed"
                >
                    Join Let It Go AI as an early user, investor, strategic partner,
                    or advisor.
                </motion.p>

                {/* CTA cluster */}
                <motion.div
                    {...anim(0.44)}
                    className="mt-14 flex flex-wrap items-center justify-center gap-3"
                >
                    <PrimaryButton
                        onClick={() => modal.open("early-access")}
                        data-testid="closing-early-access"
                        size="lg"
                    >
                        Request Early Access
                    </PrimaryButton>

                    <SecondaryButton
                        as="a"
                        href="#investors"
                        data-testid="closing-investor"
                        size="lg"
                        icon={<ArrowUpRight size={15} />}
                    >
                        Investor Information
                    </SecondaryButton>

                    <SecondaryButton
                        onClick={() => modal.open("partnership")}
                        data-testid="closing-partner"
                        size="lg"
                        icon={<Handshake size={15} />}
                    >
                        Partner With Us
                    </SecondaryButton>
                </motion.div>

                {/* Soft closer line */}
                <motion.p
                    {...anim(0.6)}
                    className="mt-14 text-sm text-lg-ink-muted italic"
                >
                    One Ecosystem. Every Moment. Better You.
                </motion.p>
            </div>
        </Section>
    );
}
