import { motion } from "framer-motion";
import { Section, GradientHeadline, DeviceFrame, StatusBadge } from "@/components/ds";

/**
 * DeviceShowcase — a cinematic device demo section.
 * Anchor: #experience
 */
export default function DeviceShowcase() {
    return (
        <Section id="experience" size="lg" className="overflow-hidden">
            <div aria-hidden="true" className="lg-ambient opacity-70" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Copy */}
                <div className="lg:col-span-5 order-2 lg:order-1">
                    <StatusBadge tone="cyan" className="mb-8">
                        The Experience
                    </StatusBadge>
                    <GradientHeadline as="h2" size="lg">
                        A calm interface.
                        <br />
                        <span className="lg-gradient-text italic">An intuitive</span>
                        <br />
                        companion.
                    </GradientHeadline>
                    <p className="mt-8 text-lg text-lg-ink-soft leading-relaxed">
                        Six sliders, one honest sentence, thirty seconds. That&apos;s
                        the entire daily check-in. What happens next is quiet, ambient, and
                        entirely yours.
                    </p>

                    <ul className="mt-10 space-y-5">
                        {[
                            {
                                k: "Sub-30-second check-in",
                                d: "Zero friction, twice a day. On watch, phone, or room.",
                            },
                            {
                                k: "AI co-regulation on-demand",
                                d: "Personalised breath, sound, or spoken reframe.",
                            },
                            {
                                k: "30-day growth trend",
                                d: "Legible EQ trajectory — never a dashboard, always a story.",
                            },
                        ].map((f) => (
                            <li key={f.k} className="flex items-start gap-4">
                                <span className="mt-2 inline-block h-px w-8 bg-gradient-to-r from-lg-cyan via-lg-violet to-lg-magenta" />
                                <div>
                                    <p className="text-lg-ink font-medium tracking-[-0.01em]">
                                        {f.k}
                                    </p>
                                    <p className="text-sm text-lg-ink-soft mt-1">
                                        {f.d}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Device */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.1 }}
                    className="lg:col-span-7 order-1 lg:order-2 flex justify-center"
                >
                    <DeviceFrame variant="phone">
                        <ShowcaseScreen />
                    </DeviceFrame>
                </motion.div>
            </div>
        </Section>
    );
}

function ShowcaseScreen() {
    // Chat-style co-regulation demo
    return (
        <div className="w-full h-full flex flex-col p-5 pt-14">
            <div className="text-center mb-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-lg-ink-muted">
                    Session · Evening
                </p>
                <p className="text-sm text-lg-ink mt-1 font-medium">Co-regulation</p>
            </div>

            <div className="space-y-3 flex-1">
                <Bubble side="them">
                    You&apos;ve been carrying a lot today. Would a 3-minute
                    grounding reset feel right?
                </Bubble>
                <Bubble side="me">Yes, quietly.</Bubble>
                <Bubble side="them" gradient>
                    Perfect. I&apos;ll dim the room. Breathe with the arc.
                </Bubble>

                {/* Breath arc */}
                <div className="mt-6 flex items-center justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="absolute inset-0 rounded-full border border-white/10 animate-pulse"
                                style={{
                                    transform: `scale(${1 - i * 0.16})`,
                                    animationDelay: `${i * 0.6}s`,
                                    boxShadow:
                                        "0 0 40px rgba(139,77,255,0.35)",
                                }}
                            />
                        ))}
                        <p className="text-[11px] uppercase tracking-[0.3em] text-lg-ink-soft">
                            Inhale
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-lg-ink-muted">
                    2:47 remaining
                </p>
            </div>
        </div>
    );
}

function Bubble({ side, gradient, children }) {
    if (side === "me") {
        return (
            <div className="flex justify-end">
                <div className="rounded-2xl rounded-br-md bg-white/[0.06] border border-white/10 px-3.5 py-2 max-w-[75%]">
                    <p className="text-[12.5px] text-lg-ink leading-snug">
                        {children}
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex justify-start">
            <div
                className="rounded-2xl rounded-bl-md px-3.5 py-2 max-w-[80%] border"
                style={
                    gradient
                        ? {
                              background:
                                  "linear-gradient(135deg, rgba(53,107,255,0.18), rgba(139,77,255,0.22), rgba(255,60,172,0.18))",
                              borderColor: "rgba(255,255,255,0.12)",
                          }
                        : {
                              background: "rgba(255,255,255,0.03)",
                              borderColor: "rgba(255,255,255,0.08)",
                          }
                }
            >
                <p className="text-[12.5px] text-lg-ink leading-snug">
                    {children}
                </p>
            </div>
        </div>
    );
}
