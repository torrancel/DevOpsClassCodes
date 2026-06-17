import { motion } from "framer-motion";
import { Vibrate, HeartPulse, Moon, Watch } from "lucide-react";
import { setAudience, setPlatform } from "./audienceStore";

const FEATURES = [
    { icon: HeartPulse, title: "Continuous HRV", text: "Heart-rate variability + breath cadence read in the background. No active session needed." },
    { icon: Vibrate, title: "Haptic nudges", text: "A single tap on the wrist when tension or anxiety climbs — never a notification, never a buzz." },
    { icon: Moon, title: "Sleep affect", text: "Wake up to the emotional shape of your night, not just hours and stages." },
    { icon: Watch, title: "Glance mode", text: "Raise your wrist for a quiet read of your inner weather. Two seconds, no app to open." },
];

export default function Wearable() {
    return (
        <section
            id="wearable"
            data-testid="wearable-section"
            className="relative px-6 md:px-12 lg:px-20 py-24 md:py-40 overflow-hidden bg-bg-soft border-y border-white/5"
        >
            <div className="absolute inset-0 aurora opacity-40 pointer-events-none"></div>
            <div className="absolute inset-0 stars opacity-50 pointer-events-none"></div>

            <div className="relative grid grid-cols-12 gap-6 md:gap-12 items-center">
                {/* Left: copy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-6"
                >
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                        On your wrist
                    </p>
                    <h2
                        data-testid="wearable-headline"
                        className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink"
                    >
                        Now on Apple Watch
                        <br />
                        and <em className="gradient-text">Wear OS</em>.
                    </h2>
                    <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-md">
                        Let It Go lives where your pulse does. A whisper-soft companion that
                        senses dysregulation before your mind names it — and brings you back
                        with a single, kind tap.
                    </p>

                    {/* Platform chips — now clickable to capture platform preference */}
                    <div className="mt-8 flex flex-wrap gap-3" data-testid="wearable-platforms">
                        <button
                            type="button"
                            data-testid="wearable-platform-apple"
                            onClick={() => {
                                setAudience("watch");
                                setPlatform("apple");
                                const el = document.getElementById("cta");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="group inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-ink hover:bg-white/[0.08] hover:border-white/25 transition-all active:scale-[0.98]"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue"></span>
                            Apple Watch · watchOS 10+
                        </button>
                        <button
                            type="button"
                            data-testid="wearable-platform-android"
                            onClick={() => {
                                setAudience("watch");
                                setPlatform("android");
                                const el = document.getElementById("cta");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="group inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-ink hover:bg-white/[0.08] hover:border-white/25 transition-all active:scale-[0.98]"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink"></span>
                            Wear OS · Galaxy / Pixel
                        </button>
                    </div>

                    <div className="mt-10">
                        <button
                            type="button"
                            data-testid="wearable-cta"
                            onClick={() => {
                                setAudience("watch");
                                const el = document.getElementById("cta");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3 text-sm font-medium transition-all active:scale-[0.98]"
                        >
                            Join the wrist beta
                        </button>
                    </div>

                    <p className="mt-4 text-xs text-ink-soft">
                        Pairs with iOS and Android · works alongside any tier above.
                    </p>
                </motion.div>

                {/* Right: watch mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="col-span-12 md:col-span-6 flex justify-center"
                >
                    <div data-testid="wearable-mockup" className="relative">
                        {/* Watch body */}
                        <div
                            className="relative w-[280px] h-[340px] md:w-[320px] md:h-[390px] rounded-[56px] p-3"
                            style={{
                                background:
                                    "linear-gradient(160deg, #1a1320 0%, #050208 100%)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                boxShadow:
                                    "0 40px 120px -20px rgba(138,77,255,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                            }}
                        >
                            {/* Crown */}
                            <div className="absolute right-[-6px] top-[28%] w-2 h-12 rounded-l-md bg-gradient-to-b from-violet to-pink/80"></div>
                            <div className="absolute right-[-4px] top-[48%] w-1.5 h-8 rounded-l bg-white/15"></div>

                            {/* Screen */}
                            <div
                                className="relative w-full h-full rounded-[44px] overflow-hidden flex items-center justify-center"
                                style={{ background: "#000" }}
                            >
                                {/* Aurora bg */}
                                <div className="absolute inset-0 aurora opacity-80"></div>

                                {/* Pulse rings */}
                                <div className="absolute w-56 h-56 rounded-full border border-blue/30 animate-breath-slow"></div>
                                <div className="absolute w-40 h-40 rounded-full border border-pink/40 animate-breath"></div>

                                {/* Center reading */}
                                <div className="relative text-center">
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/50 mb-1">
                                        EQ now
                                    </p>
                                    <p
                                        className="font-display text-6xl gradient-text leading-none"
                                        style={{ filter: "drop-shadow(0 0 24px rgba(138,77,255,0.6))" }}
                                    >
                                        72
                                    </p>
                                    <p className="text-[10px] text-white/70 mt-2 font-display italic">
                                        breathe with me
                                    </p>
                                </div>

                                {/* Time top */}
                                <div className="absolute top-3 left-0 right-0 flex justify-center">
                                    <span className="text-[10px] font-mono text-white/40 tracking-wider">14:32</span>
                                </div>

                                {/* Mini stats bottom */}
                                <div className="absolute bottom-3 left-0 right-0 px-5 flex items-center justify-between text-[9px] font-mono text-white/50">
                                    <span>HRV 54</span>
                                    <span className="w-1 h-1 rounded-full bg-pink animate-breath"></span>
                                    <span>STR 38</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating notification card */}
                        <div
                            className="absolute -left-6 md:-left-16 top-1/2 -translate-y-1/2 w-[200px] rounded-2xl p-3 backdrop-blur"
                            style={{
                                background: "rgba(17, 8, 32, 0.85)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                boxShadow: "0 20px 60px -10px rgba(138,77,255,0.5)",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-1.5">
                                <Vibrate size={12} className="text-pink" />
                                <span className="text-[9px] uppercase tracking-[0.2em] text-ink-soft">
                                    Haptic nudge
                                </span>
                            </div>
                            <p className="font-display italic text-sm text-ink leading-snug">
                                "Stress is climbing. One slow breath."
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Features row */}
            <div className="relative mt-20 md:mt-28 grid grid-cols-12 gap-4 md:gap-6">
                {FEATURES.map((f, i) => {
                    const Icon = f.icon;
                    return (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            data-testid={`wearable-feature-${i}`}
                            className="col-span-12 sm:col-span-6 lg:col-span-3 gradient-border p-6"
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/10 mb-4">
                                <Icon size={18} strokeWidth={1.5} className="text-ink" />
                            </div>
                            <h3 className="font-display text-2xl text-ink mb-2">{f.title}</h3>
                            <p className="text-sm text-ink-soft leading-relaxed">{f.text}</p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
