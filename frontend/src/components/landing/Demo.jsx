import { motion } from "framer-motion";

const SIGNALS = [
    { label: "Calm", value: 72, color: "#2B4C3B" },
    { label: "Focus", value: 64, color: "#C49775" },
    { label: "Tension", value: 28, color: "#9B5B3F" },
    { label: "Warmth", value: 81, color: "#7A8A5C" },
];

export default function Demo() {
    return (
        <section
            id="demo"
            data-testid="demo-section"
            className="bg-bg-soft px-6 md:px-12 lg:px-24 py-24 md:py-40"
        >
            <div className="grid grid-cols-12 gap-6 md:gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-7"
                >
                    <div
                        data-testid="demo-mockup"
                        className="relative rounded-3xl bg-surface border border-line shadow-[0_24px_80px_rgba(43,76,59,0.08)] p-8 md:p-10"
                    >
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-line">
                            <div className="flex items-center gap-3">
                                <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-forest">
                                    <span className="absolute inset-0 rounded-full bg-forest animate-breath"></span>
                                </span>
                                <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">
                                    Affective state · live
                                </p>
                            </div>
                            <p className="text-xs text-ink-soft font-mono">14:32:08</p>
                        </div>

                        {/* Pulse circle */}
                        <div className="relative h-56 mb-8 flex items-center justify-center">
                            <div className="absolute w-48 h-48 rounded-full bg-forest/5 animate-breath-slow"></div>
                            <div className="absolute w-32 h-32 rounded-full bg-forest/10 animate-breath"></div>
                            <div className="relative w-20 h-20 rounded-full bg-forest flex items-center justify-center text-bg">
                                <div className="text-center">
                                    <p className="font-serif text-2xl leading-none">72</p>
                                    <p className="text-[10px] uppercase tracking-[0.2em] mt-1 opacity-70">
                                        EQ
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {SIGNALS.map((s, i) => (
                                <div key={s.label}>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="uppercase tracking-[0.2em] text-ink-soft">
                                            {s.label}
                                        </span>
                                        <span className="font-mono text-ink">{s.value}</span>
                                    </div>
                                    <div className="h-px bg-line relative overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${s.value}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                                            className="absolute left-0 top-0 h-full"
                                            style={{ background: s.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 rounded-2xl bg-bg-soft border border-line">
                            <p className="text-xs uppercase tracking-[0.2em] text-forest mb-2">
                                Suggestion
                            </p>
                            <p className="font-serif text-xl text-ink italic">
                                "Take a slow breath. Shoulders down. You're carrying yesterday."
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="col-span-12 md:col-span-5 md:pl-8"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-forest mb-6">
                        See it work
                    </p>
                    <h2
                        data-testid="demo-headline"
                        className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight text-ink"
                    >
                        A nervous system,
                        <br />
                        <em className="text-forest">visualized</em>.
                    </h2>
                    <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-md">
                        Aura listens to twelve continuous signals — and synthesizes them into a
                        single, ambient sense of state. No charts to read. No dashboards to study.
                        Just a quiet, intelligent presence.
                    </p>

                    <div className="mt-10 space-y-4 max-w-md">
                        {[
                            "Voice prosody & breath cadence",
                            "Linguistic affect & sentiment",
                            "Optional biometrics (HRV, GSR)",
                            "Contextual memory of your patterns",
                        ].map((t) => (
                            <div key={t} className="flex items-start gap-3">
                                <span className="mt-2 inline-block h-px w-6 bg-forest/60"></span>
                                <p className="text-base text-ink">{t}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
