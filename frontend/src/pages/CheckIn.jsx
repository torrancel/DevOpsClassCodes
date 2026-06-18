import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import InfinityGlow from "@/components/landing/InfinityGlow";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SIGNALS = [
    { key: "calm",       label: "Calm",       desc: "How settled does your body feel?",     color: "#5E8BFF" },
    { key: "focus",      label: "Focus",      desc: "How clear is your attention?",          color: "#8A4DFF" },
    { key: "stress",     label: "Stress",     desc: "How activated is your nervous system?", color: "#FF8A5C" },
    { key: "anxiety",    label: "Anxiety",    desc: "How loud is the worry voice?",          color: "#FF6FD3" },
    { key: "depression", label: "Depression", desc: "How heavy does today feel?",            color: "#6B5BFF" },
    { key: "warmth",     label: "Warmth",     desc: "How open does your heart feel?",        color: "#FFB36F" },
];

export default function CheckIn() {
    const navigate = useNavigate();
    const [values, setValues] = useState({ calm: 50, focus: 50, stress: 30, anxiety: 30, depression: 20, warmth: 60 });
    const [reflection, setReflection] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const submit = async () => {
        setSubmitting(true);
        try {
            const { data } = await axios.post(
                `${API}/checkins`,
                { ...values, reflection: reflection || null },
                { withCredentials: true }
            );
            setResult(data);
        } catch (e) {
            toast.error("Couldn't save the check-in. Try again in a moment.");
        } finally {
            setSubmitting(false);
        }
    };

    if (result) {
        return (
            <main data-testid="checkin-result" className="min-h-screen bg-bg text-ink font-sans">
                <section className="max-w-2xl mx-auto px-6 py-24">
                    <div className="flex items-center gap-3 mb-12">
                        <InfinityGlow size={36} />
                        <span className="font-display text-xl">Let It Go <span className="gradient-text text-sm font-sans align-top">AI</span></span>
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">Your reading</p>
                    <div className="relative h-56 flex items-center justify-center mb-10">
                        <div className="absolute w-56 h-56 rounded-full bg-violet/10 animate-breath-slow"></div>
                        <div className="absolute w-40 h-40 rounded-full bg-pink/15 animate-breath"></div>
                        <div
                            className="relative w-28 h-28 rounded-full flex items-center justify-center text-white"
                            style={{
                                background: "linear-gradient(135deg,#5E8BFF,#8A4DFF,#FF6FD3)",
                                boxShadow: "0 0 80px rgba(138,77,255,0.7)",
                            }}
                        >
                            <div className="text-center">
                                <p className="font-display text-5xl leading-none">{result.eq}</p>
                                <p className="text-[10px] uppercase tracking-[0.2em] mt-1 opacity-80">EQ</p>
                            </div>
                        </div>
                    </div>
                    <div data-testid="checkin-suggestion" className="rounded-3xl p-8 border border-white/10 bg-white/[0.04] mb-8">
                        <p className="text-[10px] uppercase tracking-[0.3em] gradient-text mb-3 flex items-center gap-2">
                            <Sparkles size={12} /> A small thing to try
                        </p>
                        <p className="font-display italic text-2xl md:text-3xl leading-snug">{result.suggestion}</p>
                    </div>
                    <button
                        onClick={() => navigate("/app")}
                        data-testid="checkin-done"
                        className="btn-glow w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-4 text-sm font-medium transition-all active:scale-[0.98]"
                    >
                        Back to my growth <ArrowUpRight size={16} />
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main data-testid="checkin-page" className="min-h-screen bg-bg text-ink font-sans">
            <header className="border-b border-white/10 backdrop-blur-xl bg-bg/70 sticky top-0 z-40">
                <div className="px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
                    <Link to="/app" data-testid="checkin-back" className="flex items-center gap-3 group">
                        <ChevronLeft size={18} className="text-ink-soft group-hover:text-ink" />
                        <InfinityGlow size={28} />
                        <span className="font-display text-lg">Let It Go <span className="gradient-text text-xs font-sans align-top">AI</span></span>
                    </Link>
                </div>
            </header>

            <section className="max-w-3xl mx-auto px-6 py-16">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">Check-in · 90 seconds</p>
                <h1 className="font-display text-4xl md:text-6xl tracking-tight mb-3">
                    How are you, <em className="gradient-text">really</em>?
                </h1>
                <p className="text-ink-soft text-base md:text-lg max-w-xl">
                    Six slow sliders. There's no right answer — only the one that's true right now.
                </p>

                <div className="mt-12 space-y-8">
                    {SIGNALS.map((s, i) => (
                        <motion.div
                            key={s.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            data-testid={`slider-${s.key}`}
                        >
                            <div className="flex items-baseline justify-between mb-2">
                                <div>
                                    <p className="font-display text-2xl">{s.label}</p>
                                    <p className="text-xs text-ink-soft mt-0.5">{s.desc}</p>
                                </div>
                                <span className="font-mono text-2xl text-ink">{values[s.key]}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={values[s.key]}
                                onChange={(e) => setValues({ ...values, [s.key]: parseInt(e.target.value, 10) })}
                                data-testid={`slider-input-${s.key}`}
                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer focus:outline-none"
                                style={{
                                    background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${values[s.key]}%, rgba(255,255,255,0.08) ${values[s.key]}%, rgba(255,255,255,0.08) 100%)`,
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-ink-soft mb-3">Reflection · optional</p>
                    <textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        rows={3}
                        placeholder="One sentence about what's actually going on…"
                        data-testid="reflection-input"
                        className="w-full rounded-2xl bg-white/[0.04] border border-white/10 text-ink placeholder:text-ink-soft/60 px-5 py-4 outline-none focus:bg-white/[0.07] focus:border-violet/60 transition-colors font-sans resize-none"
                    />
                </div>

                <button
                    onClick={submit}
                    disabled={submitting}
                    data-testid="checkin-submit"
                    className="btn-glow mt-10 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-4 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60"
                >
                    {submitting ? "Listening…" : "Read me"}
                    <ArrowUpRight size={16} />
                </button>
            </section>
        </main>
    );
}
