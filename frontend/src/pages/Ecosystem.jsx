import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ChevronLeft, ArrowUpRight, Brain, Heart, Leaf, CircleDot,
    Smartphone, Watch, Disc, Car, Building2, Cloud,
    Activity, Sparkles, User, Shield, Repeat, Check, Circle,
    Users, Globe2,
} from "lucide-react";
import InfinityGlow from "@/components/landing/InfinityGlow";

/**
 * /ecosystem — the full ecosystem experience matching the brand infographic.
 * Mission → Pillars → Ecosystem components → Roadmap → Tech pillars → CTA
 */
export default function Ecosystem() {
    return (
        <main data-testid="ecosystem-page" className="min-h-screen bg-bg text-ink font-sans">
            {/* Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/60 border-b border-white/5">
                <nav className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
                    <Link to="/" data-testid="ecosystem-back-link" className="flex items-center gap-3 group">
                        <ChevronLeft size={18} className="text-ink-soft group-hover:text-ink transition-colors" />
                        <InfinityGlow size={32} />
                        <span className="flex flex-col leading-none"><span className="font-display text-xl tracking-tight">Let It Go <span className="gradient-text font-sans text-sm align-top">AI</span></span><span className="text-[8px] md:text-[9px] tracking-[0.35em] gradient-text uppercase mt-1">Emotional Intelligence Ecosystem</span></span>
                    </Link>
                    <Link to="/beta" data-testid="ecosystem-nav-cta" className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink">
                        Join cohort 01 →
                    </Link>
                </nav>
            </header>

            {/* HERO — Mission */}
            <section data-testid="ecosystem-hero" className="relative pt-36 pb-16 md:pt-48 md:pb-24 px-6 md:px-12 lg:px-20 aurora stars grain overflow-hidden">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">Our mission</p>
                    <h1 data-testid="ecosystem-headline" className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.98] tracking-tight">
                        Building the <em className="gradient-text italic">Emotional Intelligence</em>
                        <br />Layer for Everyday Life.
                    </h1>
                    <p className="mt-8 text-lg md:text-xl text-ink-soft max-w-2xl leading-relaxed">
                        Let It Go AI continuously understands your emotional state in real time and delivers
                        personalized guidance to help you release, recover, and transform.
                    </p>
                </motion.div>

                {/* Pillars row */}
                <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl">
                    {[
                        { Icon: Brain, label: "Understand", color: "text-blue" },
                        { Icon: Heart, label: "Release", color: "text-pink" },
                        { Icon: Leaf, label: "Grow", color: "text-violet" },
                        { Icon: CircleDot, label: "Transform", color: "text-orange" },
                    ].map((p, i) => (
                        <motion.div key={p.label}
                            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            data-testid={`ecosystem-pillar-${p.label.toLowerCase()}`}
                            className="gradient-border p-5 text-center">
                            <p.Icon size={22} strokeWidth={1.5} className={`mx-auto mb-3 ${p.color}`} />
                            <p className="text-xs uppercase tracking-[0.3em] text-ink">{p.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Ecosystem components */}
            <section data-testid="ecosystem-components" className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-bg-soft border-y border-white/5">
                <div className="max-w-3xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">The ecosystem at a glance</p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight">
                        Six surfaces. <em className="gradient-text">One quiet</em> intelligence.
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {[
                        { Icon: Smartphone, title: "Mobile App", text: "Your emotional intelligence hub.", color: "#5E8BFF" },
                        { Icon: Disc, title: "Smart Ring", text: "Continuous emotion tracking.", color: "#8A4DFF" },
                        { Icon: Watch, title: "Smartwatch", text: "Awareness on your wrist.", color: "#FF6FD3" },
                        { Icon: Car, title: "Connected Vehicles", text: "Real-time emotional awareness on the road.", color: "#5E8BFF" },
                        { Icon: Building2, title: "Enterprise & Health", text: "Better outcomes for people and teams.", color: "#FF8A5C" },
                        { Icon: Cloud, title: "AI Cloud Platform", text: "Secure. Scalable. Always learning.", color: "#8A4DFF" },
                    ].map((c, i) => (
                        <motion.div key={c.title}
                            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            data-testid={`ecosystem-surface-${c.title.toLowerCase().replace(/[&\s]+/g, "-")}`}
                            className="relative gradient-border p-6 overflow-hidden">
                            <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: c.color }} />
                            <div className="relative">
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/10 mb-5">
                                    <c.Icon size={18} strokeWidth={1.5} className="text-ink" />
                                </div>
                                <h3 className="font-display text-2xl text-ink mb-2">{c.title}</h3>
                                <p className="text-sm text-ink-soft leading-relaxed">{c.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Roadmap */}
            <section data-testid="ecosystem-roadmap" className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
                <div className="max-w-3xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">Ecosystem roadmap</p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight">
                        Where we are.{" "}
                        <em className="gradient-text">Where we&rsquo;re going.</em>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-4">
                    {[
                        { phase: "Phase 1", title: "Foundation", when: "2024", badge: "Web App Launch", status: "MVP LIVE", live: true,
                          items: ["AI emotional insights", "Real-time biometrics (integrations)", "Guided tools & programs", "Progress analytics", "Secure cloud platform"] },
                        { phase: "Phase 2", title: "Expansion", when: "2024 – 2025", badge: "Apple Watch App", status: "COMING SOON", live: false,
                          items: ["Live mood tracking", "Heart rate & HRV insights", "Stress & recovery alerts", "Breathing & mindfulness tools", "Haptic guidance"] },
                        { phase: "Phase 3", title: "Wearables", when: "2025 – 2026", badge: "AI Smart Ring", status: "COMING SOON", live: false,
                          items: ["24/7 emotion monitoring", "Advanced sensors", "Sleep & recovery tracking", "Discreet insights", "7+ day battery life"] },
                        { phase: "Phase 4", title: "Mobility Integration", when: "2026 – 2027", badge: "Connected Vehicles", status: "COMING SOON", live: false,
                          items: ["Steering wheel sensors", "Real-time emotional state display", "Adaptive in-car guidance", "Driver wellness insights", "Seamless infotainment integration"] },
                        { phase: "Phase 5", title: "Ecosystem Scale", when: "2027+", badge: "Enterprise & Beyond", status: "FUTURE VISION", live: false,
                          items: ["Workplace wellness", "Healthcare partnerships", "Insurance programs", "OEM partnerships", "Global distribution"] },
                    ].map((p, i) => (
                        <motion.div key={p.phase}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            data-testid={`ecosystem-phase-${i + 1}`}
                            className={`relative rounded-3xl p-6 border overflow-hidden flex flex-col ${
                                p.live
                                    ? "border-violet/40 bg-gradient-to-br from-blue/10 via-violet/10 to-pink/10"
                                    : "border-white/10 bg-white/[0.02]"
                            }`}>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">{p.phase}</p>
                            <h3 className="font-display text-xl md:text-2xl mt-2 tracking-tight text-ink">{p.title}</h3>
                            <p className="text-xs text-ink-soft mt-1">{p.when}</p>
                            <div className={`mt-4 inline-flex self-start text-[10px] uppercase tracking-[0.2em] rounded-full px-2.5 py-1 ${
                                p.live ? "bg-gradient-to-r from-blue via-violet to-pink text-white" : "bg-white/5 text-ink-soft border border-white/10"
                            }`}>{p.badge}</div>
                            <ul className="mt-5 space-y-2 flex-1">
                                {p.items.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-xs text-ink-soft leading-relaxed">
                                        <span className="mt-1.5 inline-block h-px w-3 bg-gradient-to-r from-blue to-pink shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]">
                                {p.live ? <Check size={12} className="text-blue" /> : <Circle size={10} className="text-ink-soft" />}
                                <span className={p.live ? "text-blue" : "text-ink-soft"}>{p.status}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tech pillars */}
            <section data-testid="ecosystem-tech" className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-bg-soft border-y border-white/5">
                <div className="max-w-3xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">Powered by advanced AI & biometrics</p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight">
                        The quiet <em className="gradient-text">engine</em> underneath.
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    {[
                        { Icon: Activity, title: "Multi-Modal Biometrics", text: "Combining HRV, heart rate, sleep, activity, and more." },
                        { Icon: Sparkles, title: "Emotional AI Engine", text: "Advanced models detect and predict emotional states." },
                        { Icon: User, title: "Personalized Guidance", text: "AI delivers the right tools at the right moment for you." },
                        { Icon: Shield, title: "Privacy First", text: "Your data is secure, encrypted, and never sold." },
                        { Icon: Repeat, title: "Continuous Learning", text: "The more you use it, the smarter and more accurate it becomes." },
                    ].map((t, i) => (
                        <motion.div key={t.title}
                            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            data-testid={`ecosystem-tech-${i}`}
                            className="gradient-border p-5">
                            <t.Icon size={20} strokeWidth={1.5} className="text-violet mb-4" />
                            <h3 className="font-display text-lg text-ink mb-2 leading-tight">{t.title}</h3>
                            <p className="text-xs text-ink-soft leading-relaxed">{t.text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Closing CTA band */}
            <section data-testid="ecosystem-cta" className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
                <div className="rounded-[2rem] relative overflow-hidden px-6 md:px-16 py-20 md:py-28"
                    style={{ background: "linear-gradient(135deg, #0B0613 0%, #1A0930 45%, #2A1140 100%)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-pink/30 blur-3xl" />
                    <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-blue/30 blur-3xl" />

                    <div className="relative">
                        <h2 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight">
                            <em className="gradient-text">One ecosystem.</em><br />
                            Every moment. Better you.
                        </h2>

                        <div className="mt-10 flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/15 px-4 py-2 text-sm text-ink">
                                <User size={14} /> For You
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/15 px-4 py-2 text-sm text-ink">
                                <Users size={14} /> For Teams
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/15 px-4 py-2 text-sm text-ink">
                                <Globe2 size={14} /> For the World
                            </div>
                        </div>

                        <div className="mt-12 flex flex-wrap gap-3">
                            <Link to="/beta" data-testid="ecosystem-cta-beta"
                                className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3.5 text-sm font-medium">
                                Join cohort 01
                                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                            <Link to="/founder" data-testid="ecosystem-cta-founder"
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 text-ink px-6 py-3.5 text-sm font-medium hover:bg-white/5">
                                Read the founder&rsquo;s letter
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="px-6 md:px-12 lg:px-20 py-10 border-t border-white/10">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-ink-soft">
                    <div className="flex items-center gap-3">
                        <InfinityGlow size={24} />
                        <span className="font-display text-base text-ink">Let It Go AI · Emotional Intelligence Ecosystem</span>
                    </div>
                    <p>© {new Date().getFullYear()} · <Link to="/" className="link-underline">Back to site</Link></p>
                </div>
            </footer>
        </main>
    );
}
