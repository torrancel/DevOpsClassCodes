import { motion } from "framer-motion";

const SIGNALS = [
    { label: "Calm", value: 72, color: "#5E8BFF" },
    { label: "Focus", value: 64, color: "#8A4DFF" },
    { label: "Tension", value: 28, color: "#FF8A5C" },
    { label: "Warmth", value: 81, color: "#FF6FD3" },
];

export default function Demo() {
    return (
        <section
            id="experience"
            data-testid="demo-section"
            className="relative px-6 md:px-12 lg:px-20 py-24 md:py-40 overflow-hidden"
        >
            <div className="absolute inset-0 aurora opacity-50 pointer-events-none"></div>

            <div className="relative grid grid-cols-12 gap-6 md:gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-7"
                >
                    <div
                        data-testid="demo-mockup"
                        className="relative gradient-border p-8 md:p-10"
                        style={{ boxShadow: "0 40px 120px -20px rgba(138,77,255,0.35)" }}
                    >
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-pink">
                                    <span className="absolute inset-0 rounded-full bg-pink animate-breath"></span>
                                </span>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">
                                    Affective state · live
                                </p>
                            </div>
                            <p className="text-xs text-ink-soft font-mono">14:32:08</p>
                        </div>

                        {/* Pulse circle */}
                        <div className="relative h-56 mb-8 flex items-center justify-center">
                            <div className="absolute w-56 h-56 rounded-full bg-violet/10 animate-breath-slow"></div>
                            <div className="absolute w-40 h-40 rounded-full bg-pink/15 animate-breath"></div>
                            <div
                                className="relative w-24 h-24 rounded-full flex items-center justify-center text-white"
                                style={{
                                    background: "linear-gradient(135deg, #5E8BFF, #8A4DFF, #FF6FD3)",
                                    boxShadow: "0 0 60px rgba(138,77,255,0.7)",
                                }}
                            >
                                <div className="text-center">
                                    <p className="font-display text-3xl leading-none">72</p>
                                    <p className="text-[10px] uppercase tracking-[0.2em] mt-1 opacity-80">
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
                                    <div className="h-px bg-white/10 relative overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${s.value}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                                            className="absolute left-0 top-0 h-full"
                                            style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                            <p className="text-[10px] uppercase tracking-[0.25em] gradient-text mb-2">
                                Suggestion
                            </p>
                            <p className="font-display text-xl text-ink italic">
                                "Slow breath. Shoulders down. You're carrying yesterday. Let it go."
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
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                        See it work
                    </p>
                    <h2
                        data-testid="demo-headline"
                        className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-ink"
                    >
                        A nervous system,
                        <br />
                        <em className="gradient-text">visualized</em>.
                    </h2>
                    <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-md">
                        Twelve continuous signals, one quiet read. No dashboards to study,
                        no charts to learn — just a soft presence that knows when to nudge,
                        and when to disappear.
                    </p>

                    <div className="mt-10 space-y-4 max-w-md">
                        {[
                            "Voice prosody & breath cadence",
                            "Linguistic affect & sentiment",
                            "Optional biometrics (HRV, GSR)",
                            "Contextual memory of your patterns",
                        ].map((t) => (
                            <div key={t} className="flex items-start gap-3">
                                <span className="mt-2 inline-block h-px w-6 bg-gradient-to-r from-blue to-pink"></span>
                                <p className="text-base text-ink">{t}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
