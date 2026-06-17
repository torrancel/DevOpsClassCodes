import { Brain, Heart, Leaf, CircleDot } from "lucide-react";
import { motion } from "framer-motion";

const PILLARS = [
    {
        icon: Brain,
        title: "Aware",
        sub: "01",
        color: "blue",
        gradient: "from-blue/30 to-blue/0",
        text: "Multimodal sensing — voice prosody, language, micro-context, optional biometrics — distilled into a quiet, continuous read of where you actually are.",
    },
    {
        icon: Heart,
        title: "Release",
        sub: "02",
        color: "pink",
        gradient: "from-pink/30 to-pink/0",
        text: "Real-time, low-friction nudges. Breathe. Reframe. Soften. Tuned to your nervous system, not someone else's protocol.",
    },
    {
        icon: Leaf,
        title: "Grow",
        sub: "03",
        color: "violet",
        gradient: "from-violet/30 to-violet/0",
        text: "A private, encrypted memory of your patterns over time. The first long-term record of who you're becoming, owned only by you.",
    },
    {
        icon: CircleDot,
        title: "Transform",
        sub: "04",
        color: "orange",
        gradient: "from-orange/30 to-orange/0",
        text: "Aware → Release → Grow loops back into action. Let It Go translates inner shifts into outer change — how you speak, lead, love, and build.",
    },
];

const dotColor = {
    blue: "bg-blue",
    pink: "bg-pink",
    violet: "bg-violet",
    orange: "bg-orange",
};

export default function Modules() {
    return (
        <section
            id="pillars"
            data-testid="modules-section"
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40"
        >
            <div className="mb-16 md:mb-24 max-w-4xl">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                    Four pillars
                </p>
                <h2
                    data-testid="modules-headline"
                    className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink"
                >
                    The shape of
                    <br />
                    <em className="gradient-text">letting go</em>.
                </h2>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {PILLARS.map((p, i) => {
                    const Icon = p.icon;
                    return (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            data-testid={`module-card-${i}`}
                            className="col-span-12 md:col-span-6 relative gradient-border p-8 md:p-10 overflow-hidden group transition-transform duration-500 hover:-translate-y-1"
                        >
                            {/* gradient wash */}
                            <div
                                className={`absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gradient-to-br ${p.gradient} blur-3xl opacity-70 pointer-events-none`}
                            ></div>

                            <div className="relative flex items-start justify-between mb-10">
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/10`}
                                >
                                    <Icon
                                        size={22}
                                        strokeWidth={1.5}
                                        className={
                                            p.color === "blue" ? "text-blue" :
                                            p.color === "pink" ? "text-pink" :
                                            p.color === "violet" ? "text-violet" :
                                            "text-orange"
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${dotColor[p.color]}`}></span>
                                    <span className="text-xs tracking-[0.3em] text-ink-soft">{p.sub}</span>
                                </div>
                            </div>

                            <h3 className="relative font-display text-4xl md:text-5xl tracking-tight mb-4 text-ink">
                                {p.title}
                            </h3>
                            <p className="relative text-base md:text-lg leading-relaxed max-w-xl text-ink-soft">
                                {p.text}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
