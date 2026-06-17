import { Ear, Compass, Sparkles, Network } from "lucide-react";
import { motion } from "framer-motion";

const MODULES = [
    {
        icon: Ear,
        title: "Affect Sensing",
        sub: "01",
        text: "Multimodal signals — voice timbre, micro-expressions, language patterns, biometrics — distilled into a continuous emotional state estimate.",
        tone: "light",
        span: "md:col-span-7 md:row-span-2",
    },
    {
        icon: Compass,
        title: "Regulation Coaching",
        sub: "02",
        text: "Real-time, low-friction nudges. Breathe. Reframe. Pause. Adapted to your nervous system, not someone else's.",
        tone: "dark",
        span: "md:col-span-5",
    },
    {
        icon: Network,
        title: "Conflict Mediation",
        sub: "03",
        text: "When two parties (human or agent) misalign, Aura translates underneath the words — surfacing the need behind the position.",
        tone: "clay",
        span: "md:col-span-5",
    },
    {
        icon: Sparkles,
        title: "Growth Memory",
        sub: "04",
        text: "A private, encrypted ledger of your emotional patterns over time. The first long-term record of who you're becoming.",
        tone: "light",
        span: "md:col-span-12",
    },
];

const toneStyle = {
    light: "bg-surface text-ink border-line",
    dark: "bg-forest text-bg border-forest-deep",
    clay: "bg-clay/20 text-ink border-clay/40",
};

export default function Modules() {
    return (
        <section
            id="modules"
            data-testid="modules-section"
            className="px-6 md:px-12 lg:px-24 py-24 md:py-40"
        >
            <div className="mb-16 md:mb-24 max-w-4xl">
                <p className="text-xs uppercase tracking-[0.3em] text-forest mb-6">
                    The platform
                </p>
                <h2
                    data-testid="modules-headline"
                    className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink"
                >
                    Four modules.
                    <br />
                    One <em className="text-forest">inner</em> operating system.
                </h2>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-fr">
                {MODULES.map((m, i) => {
                    const Icon = m.icon;
                    return (
                        <motion.div
                            key={m.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            data-testid={`module-card-${i}`}
                            className={`col-span-12 ${m.span} relative rounded-3xl border p-8 md:p-10 overflow-hidden group transition-all duration-500 hover:-translate-y-1 ${toneStyle[m.tone]}`}
                        >
                            <div className="flex items-start justify-between mb-10">
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                        m.tone === "dark"
                                            ? "bg-bg/10 text-bg"
                                            : "bg-forest/10 text-forest"
                                    }`}
                                >
                                    <Icon size={20} strokeWidth={1.5} />
                                </div>
                                <span
                                    className={`text-xs tracking-[0.25em] ${
                                        m.tone === "dark" ? "text-bg/50" : "text-ink-soft"
                                    }`}
                                >
                                    {m.sub}
                                </span>
                            </div>

                            <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                                {m.title}
                            </h3>
                            <p
                                className={`text-base md:text-lg leading-relaxed max-w-xl ${
                                    m.tone === "dark" ? "text-bg/75" : "text-ink-soft"
                                }`}
                            >
                                {m.text}
                            </p>

                            {m.tone === "dark" && (
                                <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-clay/15 blur-3xl pointer-events-none"></div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
