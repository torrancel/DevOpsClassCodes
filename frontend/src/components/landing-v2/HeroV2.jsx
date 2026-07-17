import { motion } from "framer-motion";
import { Waves } from "lucide-react";
import {
    Section,
    StatusBadge,
    PrimaryButton,
    SecondaryButton,
    DeviceFrame,
} from "@/components/ds";

/**
 * HeroV2 — matte black, cinematic hero.
 * Tagline: "One Ecosystem. Every Moment. Better You."
 */
export default function HeroV2() {
    return (
        <Section id="top" size="lg" className="pt-40 md:pt-48 overflow-hidden">
            {/* Ambient glow bed */}
            <div aria-hidden="true" className="lg-ambient" />

            {/* Faint grid */}
            <div
                aria-hidden="true"
                className="absolute inset-0 lg-grid-bg pointer-events-none"
            />

            <div className="relative">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                    className="mb-10 flex justify-center"
                >
                    <StatusBadge data-testid="hero-eyebrow" tone="cyan">
                        Now in Private Beta · Founding Cohort Open
                    </StatusBadge>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    data-testid="hero-headline"
                    className="lg-h1 text-lg-ink text-center max-w-[16ch] mx-auto"
                >
                    One Ecosystem.
                    <br />
                    Every Moment.
                    <br />
                    <span className="lg-gradient-text italic">Better You.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.35 }}
                    data-testid="hero-subline"
                    className="mt-10 text-lg md:text-xl text-lg-ink-soft max-w-2xl mx-auto text-center leading-relaxed"
                >
                    The first Emotional Intelligence Ecosystem — a calm operating layer
                    for feelings. Sense the moment, release the weight, grow the
                    pattern, transform the day.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.55 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-3"
                >
                    <PrimaryButton
                        as="a"
                        href="#cta"
                        data-testid="hero-primary-cta"
                        size="lg"
                    >
                        Reserve your seat
                    </PrimaryButton>
                    <SecondaryButton
                        as="a"
                        href="#experience"
                        data-testid="hero-secondary-cta"
                        size="lg"
                        icon={<Waves size={15} />}
                    >
                        See the ecosystem
                    </SecondaryButton>
                </motion.div>

                {/* Device */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, delay: 0.7 }}
                    className="mt-24 md:mt-32 relative"
                >
                    <DeviceFrame variant="phone">
                        <HeroDeviceScreen />
                    </DeviceFrame>

                    {/* Floating labels around device */}
                    <div className="hidden lg:block absolute top-[18%] left-[8%] max-w-[220px]">
                        <FloatingCallout
                            label="Sensing"
                            title="Ambient stress −18%"
                            tone="cyan"
                        />
                    </div>
                    <div className="hidden lg:block absolute top-[38%] right-[8%] max-w-[240px]">
                        <FloatingCallout
                            label="Co-regulation"
                            title="Breath · 4-7-8 · 90s"
                            tone="violet"
                        />
                    </div>
                    <div className="hidden lg:block absolute bottom-[10%] left-[14%] max-w-[220px]">
                        <FloatingCallout
                            label="Pattern"
                            title="EQ trend +6.2 this week"
                            tone="magenta"
                        />
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}

function HeroDeviceScreen() {
    // Minimal, cinematic in-device UI (mock, no user data)
    return (
        <div className="w-full h-full flex flex-col p-6 pt-14">
            <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-lg-ink-muted">
                    Tuesday · 09:12
                </span>
                <span className="text-[10px] text-lg-ink-muted">73%</span>
            </div>

            <div className="mt-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-lg-ink-muted">
                    Now sensing
                </p>
                <h4 className="mt-2 text-2xl font-semibold text-lg-ink tracking-[-0.02em]">
                    A quiet stir of
                    <br />
                    <span className="lg-gradient-text">restlessness</span>
                </h4>
            </div>

            {/* Sliders mock */}
            <div className="mt-8 space-y-3">
                {[
                    { label: "Calm", val: 62, tone: "#21D4FD" },
                    { label: "Energy", val: 44, tone: "#8B4DFF" },
                    { label: "Clarity", val: 71, tone: "#FF3CAC" },
                ].map((s) => (
                    <div key={s.label}>
                        <div className="flex justify-between text-[10px] text-lg-ink-muted mb-1">
                            <span>{s.label}</span>
                            <span>{s.val}</span>
                        </div>
                        <div className="h-[3px] rounded-full bg-white/5 overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${s.val}%`,
                                    background: `linear-gradient(90deg, ${s.tone}, rgba(255,255,255,0.6))`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Suggestion pill */}
            <div className="mt-auto pb-2">
                <div
                    className="rounded-2xl px-4 py-3.5 border border-white/10"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(53,107,255,0.18), rgba(139,77,255,0.22), rgba(255,60,172,0.18))",
                    }}
                >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                        Co-regulation
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-white">
                        Try a 90-second box breath. I&apos;ll dim the room.
                    </p>
                </div>
            </div>
        </div>
    );
}

function FloatingCallout({ label, title, tone = "violet" }) {
    const dot = { cyan: "#21D4FD", violet: "#8B4DFF", magenta: "#FF3CAC" }[tone];
    return (
        <div className="lg-panel px-4 py-3 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5">
                <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: dot, boxShadow: `0 0 12px ${dot}` }}
                />
                <span className="lg-eyebrow text-lg-ink-muted">{label}</span>
            </div>
            <p className="text-[13px] font-medium text-lg-ink leading-tight">
                {title}
            </p>
        </div>
    );
}
