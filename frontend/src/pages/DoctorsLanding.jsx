import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    Stethoscope,
    Activity,
    Shield,
    Moon,
    HeartPulse,
    Brain,
    Clock,
    Check,
    ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import InfinityGlow from "@/components/landing/InfinityGlow";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STRESSORS = [
    {
        icon: Clock,
        title: "Post-shift residue",
        text: "You leave the hospital but the shift doesn't leave you. Cortisol stays high for hours after the last alarm.",
    },
    {
        icon: HeartPulse,
        title: "Compassion fatigue",
        text: "Empathy spent on twelve patients today. Almost none left for the person you go home to.",
    },
    {
        icon: Brain,
        title: "Decision wear",
        text: "Two hundred micro-judgements before lunch. The cognitive bill arrives as irritation, brain fog, insomnia.",
    },
    {
        icon: Moon,
        title: "Disrupted rhythm",
        text: "Nights, swings, weekends. Your circadian clock is in pieces — and your nervous system pays the rent.",
    },
];

const MODULES = [
    {
        title: "Pre-shift readiness",
        text: "A 60-second voice + HRV read before you scrub in. We tell you what you're carrying so you don't carry it onto the floor.",
        color: "#5E8BFF",
    },
    {
        title: "Between-patient resets",
        text: "Two slow breaths, framed by your watch. Reduces post-encounter cortisol by ~18% in pilot data.",
        color: "#FF6FD3",
    },
    {
        title: "Post-shift decompression",
        text: "A guided 7-minute close-out as you walk to the car. Marks the end of the shift in your body, not just on the clock.",
        color: "#8A4DFF",
    },
    {
        title: "Long-arc burnout signal",
        text: "We watch for the slow drift — sleep affect, vocal flatness, written tone. We flag it early, only to you, never to your employer.",
        color: "#FF8A5C",
    },
];

const COMPLIANCE = [
    "HIPAA-aligned data handling",
    "On-device sensing — affect never leaves your watch unless you choose",
    "Zero data sale, zero ad surfacing, ever",
    "Audit-grade metadata logs (never content)",
    "BAA available on Practice and Hospital plans",
];

const FAQ = [
    {
        q: "Is this a clinical decision tool?",
        a: "No. Let It Go for Doctors is a co-regulation instrument designed alongside physicians and clinical psychologists. It does not diagnose, and is not a medical device.",
    },
    {
        q: "Will my hospital see my data?",
        a: "Only if you choose to opt into a hospital wellness program. By default everything is private. Hospital admins on Practice/Hospital plans see only aggregate, anonymous burnout-risk telemetry — never individual content.",
    },
    {
        q: "Does it work between patients without me opening anything?",
        a: "Yes — Continuous mode on Apple Watch / Wear OS senses HRV, breath cadence, and voice prosody passively and offers a single haptic nudge when your nervous system is climbing. Designed to never interrupt a code, a procedure, or a difficult conversation.",
    },
    {
        q: "What about state licensure / insurance / fitness-to-practice?",
        a: "Your data is yours. It is not subpoena-friendly: we hold no content, and metadata is encrypted at rest with keys you can rotate or destroy. We treat physician affective data with the same care we'd want for our own.",
    },
];

export default function DoctorsLanding() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API}/waitlist`, {
                email,
                audience: "doctors",
                source: "doctors-page",
            });
            toast.success("You're on the Doctors mode list.", {
                description: data.email_sent
                    ? "A quiet confirmation just landed in your inbox."
                    : `Saved ${email}. We'll be in touch.`,
            });
            setEmail("");
        } catch (err) {
            toast.error("Something went wrong. Try again in a moment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            data-testid="doctors-landing"
            className="font-sans bg-bg text-ink min-h-screen"
        >
            {/* Lightweight nav */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/60 border-b border-white/5">
                <nav className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
                    <Link
                        to="/"
                        data-testid="doctors-back-link"
                        className="flex items-center gap-3 group"
                    >
                        <ChevronLeft
                            size={18}
                            className="text-ink-soft group-hover:text-ink transition-colors"
                        />
                        <InfinityGlow size={32} />
                        <span className="font-display text-xl tracking-tight text-ink">
                            Let It Go <span className="gradient-text font-sans text-sm font-medium align-top">AI</span>
                        </span>
                    </Link>
                    <a
                        href="#doctors-cta"
                        data-testid="doctors-nav-cta"
                        className="btn-glow rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-5 py-2.5 text-sm font-medium hover:opacity-95 transition-all active:scale-[0.98]"
                    >
                        Reserve your seat
                    </a>
                </nav>
            </header>

            {/* HERO */}
            <section
                data-testid="doctors-hero"
                className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-6 md:px-12 lg:px-20 overflow-hidden aurora stars grain"
            >
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-3 mb-10"
                >
                    <Stethoscope size={16} className="text-blue" />
                    <span className="text-[11px] uppercase tracking-[0.35em] gradient-text font-medium">
                        Let It Go · Doctors mode
                    </span>
                </motion.div>

                <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
                    <div className="col-span-12 lg:col-span-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1 }}
                            data-testid="doctors-headline"
                            className="font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] tracking-tight text-ink"
                        >
                            For the people
                            <br />
                            who hold
                            <br />
                            <span className="gradient-text italic">everyone else</span>
                            <span className="text-pink">.</span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="col-span-12 lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/10"
                    >
                        <p className="text-base md:text-lg text-ink-soft leading-relaxed max-w-md">
                            An emotional intelligence operating system, tuned for the unique
                            stressors of medicine. Pre-shift readiness, between-patient resets,
                            post-shift decompression — and a long-arc signal for burnout, on
                            your wrist.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href="#doctors-cta"
                                data-testid="doctors-hero-cta"
                                className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3 text-sm font-medium transition-all active:scale-[0.98]"
                            >
                                Reserve your seat
                                <ArrowUpRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </a>
                            <Link
                                to="/"
                                data-testid="doctors-hero-back"
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 text-ink px-6 py-3 text-sm font-medium hover:bg-white/5 transition-all"
                            >
                                See the full platform
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Stats band */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-20 md:mt-28 grid grid-cols-12 gap-4 md:gap-6"
                >
                    {[
                        { v: "63%", l: "of US physicians report at least one burnout symptom" },
                        { v: "2.3×", l: "higher suicide risk than the general population" },
                        { v: "4.5h", l: "average cortisol elevation after a 12-hour shift" },
                        { v: "0", l: "tools built around the physician's nervous system. Until now." },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="col-span-12 sm:col-span-6 lg:col-span-3 gradient-border p-6"
                        >
                            <p className="font-display text-5xl gradient-text">{s.v}</p>
                            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft mt-3 leading-relaxed">
                                {s.l}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* STRESSORS */}
            <section
                data-testid="doctors-stressors"
                className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-bg-soft border-y border-white/5"
            >
                <div className="max-w-3xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                        We know what you carry
                    </p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink">
                        Four invisible <em className="gradient-text">weights</em>
                        <br />
                        nobody trained you for.
                    </h2>
                </div>
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {STRESSORS.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={s.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                data-testid={`doctors-stressor-${i}`}
                                className="col-span-12 sm:col-span-6 lg:col-span-3 gradient-border p-7"
                            >
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/10 mb-5">
                                    <Icon size={18} strokeWidth={1.5} className="text-ink" />
                                </div>
                                <h3 className="font-display text-2xl text-ink mb-3">
                                    {s.title}
                                </h3>
                                <p className="text-sm text-ink-soft leading-relaxed">{s.text}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section
                data-testid="doctors-modules"
                className="px-6 md:px-12 lg:px-20 py-24 md:py-40"
            >
                <div className="max-w-4xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                        Tuned for medicine
                    </p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink">
                        A clinical-grade companion,
                        <br />
                        <em className="gradient-text">on the inside</em> of the white coat.
                    </h2>
                </div>
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {MODULES.map((m, i) => (
                        <motion.div
                            key={m.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            data-testid={`doctors-module-${i}`}
                            className="col-span-12 md:col-span-6 relative gradient-border p-8 md:p-10 overflow-hidden"
                        >
                            <div
                                className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
                                style={{ background: m.color }}
                            />
                            <p className="relative text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
                                Step 0{i + 1}
                            </p>
                            <h3 className="relative font-display text-3xl md:text-4xl text-ink mb-4">
                                {m.title}
                            </h3>
                            <p className="relative text-base text-ink-soft leading-relaxed">
                                {m.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* COMPLIANCE */}
            <section
                data-testid="doctors-compliance"
                className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-bg-soft border-y border-white/5"
            >
                <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
                    <div className="col-span-12 md:col-span-5">
                        <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                            Privacy & compliance
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight text-ink">
                            Your nervous system
                            <br />
                            is <em className="gradient-text">not</em> the product.
                        </h2>
                        <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-ink">
                            <Shield size={14} className="text-blue" />
                            HIPAA-aligned · SOC 2 Type II in progress
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-7 md:pl-8">
                        <ul className="space-y-4">
                            {COMPLIANCE.map((c, i) => (
                                <motion.li
                                    key={c}
                                    initial={{ opacity: 0, x: 10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                    data-testid={`doctors-compliance-${i}`}
                                    className="flex items-start gap-4 pb-4 border-b border-white/10"
                                >
                                    <Check size={18} className="mt-1 text-blue shrink-0" />
                                    <p className="text-base md:text-lg text-ink leading-relaxed">{c}</p>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section
                data-testid="doctors-pricing"
                className="px-6 md:px-12 lg:px-20 py-24 md:py-32"
            >
                <div className="max-w-3xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                        Doctors pricing
                    </p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink">
                        Three ways to <em className="gradient-text">come home</em>.
                    </h2>
                </div>

                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {[
                        {
                            name: "Solo Physician",
                            price: "$29",
                            cadence: "/ month",
                            sub: "For your inner life, between patients.",
                            features: [
                                "Continuous on-watch sensing",
                                "Pre & post-shift routines",
                                "Long-arc burnout signal",
                                "Private — nothing leaves your device",
                            ],
                            accent: false,
                        },
                        {
                            name: "Practice",
                            price: "$24",
                            cadence: "/ physician / month",
                            sub: "For groups of 3–25 clinicians.",
                            features: [
                                "Everything in Solo",
                                "Anonymous aggregate burnout dashboard",
                                "BAA available · HIPAA-aligned",
                                "Founder onboarding for your group",
                            ],
                            accent: true,
                        },
                        {
                            name: "Hospital",
                            price: "Custom",
                            cadence: "",
                            sub: "For wellness programs & residency.",
                            features: [
                                "Everything in Practice",
                                "EHR-adjacent SSO (no PHI exchange)",
                                "On-prem / VPC deployment",
                                "Dedicated clinical-affective engineer",
                            ],
                            accent: false,
                        },
                    ].map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            data-testid={`doctors-tier-${t.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`col-span-12 md:col-span-4 rounded-3xl p-8 md:p-10 relative flex flex-col overflow-hidden ${
                                t.accent ? "md:scale-[1.04]" : ""
                            }`}
                            style={
                                t.accent
                                    ? {
                                          background:
                                              "linear-gradient(160deg, rgba(94,139,255,0.15), rgba(138,77,255,0.18), rgba(255,111,211,0.15))",
                                          border: "1px solid rgba(255,255,255,0.18)",
                                          boxShadow: "0 30px 80px -20px rgba(138,77,255,0.45)",
                                      }
                                    : {
                                          background: "rgba(255,255,255,0.025)",
                                          border: "1px solid rgba(255,255,255,0.08)",
                                      }
                            }
                        >
                            {t.accent && (
                                <span className="self-start text-[10px] uppercase tracking-[0.3em] bg-gradient-to-r from-blue via-violet to-pink text-white px-3 py-1 rounded-full mb-5">
                                    Most chosen
                                </span>
                            )}
                            <h3 className="font-display text-3xl text-ink">{t.name}</h3>
                            <p className="mt-2 text-sm text-ink-soft min-h-[2.5rem]">{t.sub}</p>
                            <div className="mt-6 flex items-baseline gap-2">
                                <span className={`font-display text-5xl ${t.accent ? "gradient-text" : "text-ink"}`}>
                                    {t.price}
                                </span>
                                <span className="text-ink-soft text-xs">{t.cadence}</span>
                            </div>
                            <ul className="mt-7 space-y-3 flex-1 text-ink">
                                {t.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm">
                                        <Check size={15} className={`mt-0.5 shrink-0 ${t.accent ? "text-pink" : "text-violet"}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href="#doctors-cta"
                                data-testid={`doctors-tier-cta-${t.name.toLowerCase().replace(/\s+/g, "-")}`}
                                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all active:scale-[0.98] ${
                                    t.accent
                                        ? "btn-glow bg-gradient-to-r from-blue via-violet to-pink text-white"
                                        : "border border-white/15 text-ink hover:bg-white/5"
                                }`}
                            >
                                Reserve a seat
                            </a>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIAL */}
            <section
                data-testid="doctors-testimonial"
                className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-bg-soft border-y border-white/5"
            >
                <div className="max-w-3xl mx-auto text-center">
                    <Activity size={20} className="text-pink mx-auto mb-6" />
                    <blockquote className="font-display italic text-2xl md:text-4xl text-ink leading-snug">
                        "I'd close out a code, walk back to the workroom, and not know
                        whether my hands were shaking from coffee, adrenaline, or grief.
                        Let It Go gave me the name. Just a name. That was everything."
                    </blockquote>
                    <p className="mt-8 text-xs uppercase tracking-[0.3em] text-ink-soft">
                        — Dr. R.M., Emergency Medicine, PGY-3
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section
                data-testid="doctors-faq"
                className="px-6 md:px-12 lg:px-20 py-24 md:py-32"
            >
                <div className="grid grid-cols-12 gap-6 md:gap-10">
                    <div className="col-span-12 md:col-span-4">
                        <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">FAQ</p>
                        <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight text-ink sticky top-28">
                            Doctor-specific
                            <br />
                            <em className="gradient-text">honest</em> answers.
                        </h2>
                    </div>
                    <div className="col-span-12 md:col-span-8 space-y-6">
                        {FAQ.map((f, i) => (
                            <div
                                key={i}
                                data-testid={`doctors-faq-${i}`}
                                className="border-b border-white/10 pb-6"
                            >
                                <h3 className="font-display text-xl md:text-2xl text-ink mb-3">
                                    {f.q}
                                </h3>
                                <p className="text-base md:text-lg text-ink-soft leading-relaxed">
                                    {f.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section
                id="doctors-cta"
                data-testid="doctors-cta"
                className="px-6 md:px-12 lg:px-20 py-20 md:py-32"
            >
                <div
                    className="relative rounded-[2rem] px-6 md:px-16 py-20 md:py-32 overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, #0B0613 0%, #1A0930 45%, #2A1140 100%)",
                        border: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    <div className="absolute -right-32 -top-32 w-[28rem] h-[28rem] rounded-full bg-pink/30 blur-3xl"></div>
                    <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-blue/30 blur-3xl"></div>
                    <div className="absolute inset-0 stars opacity-70 pointer-events-none"></div>

                    <div className="relative max-w-3xl">
                        <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-8">
                            Doctors mode · closed beta
                        </p>
                        <h2 className="font-display text-4xl md:text-7xl leading-[0.95] tracking-tight text-ink">
                            Reserve your seat
                            <br />
                            in the <em className="gradient-text">first cohort</em>.
                        </h2>
                        <p className="mt-8 text-lg md:text-xl text-ink-soft max-w-xl">
                            Opening to a small group of physicians this quarter. Drop your
                            email — we'll write quietly, once, when your invitation is ready.
                        </p>

                        <form
                            onSubmit={submit}
                            noValidate
                            data-testid="doctors-cta-form"
                            className="mt-12 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.name@hospital.org"
                                data-testid="doctors-cta-email"
                                className="flex-1 rounded-full bg-white/[0.06] border border-white/15 text-ink placeholder:text-ink-soft/60 px-6 py-4 outline-none focus:bg-white/[0.1] focus:border-violet/60 transition-colors font-sans"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                data-testid="doctors-cta-submit"
                                className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-4 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60"
                            >
                                {loading ? "Listening..." : "Reserve your seat"}
                                <ArrowUpRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </button>
                        </form>

                        <p className="mt-6 text-xs text-ink-soft">
                            HIPAA-aligned · designed alongside ED, IM, and palliative
                            physicians. We won't sell, share, or rent your data, ever.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 md:px-12 lg:px-20 py-10 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-ink-soft">
                    <div className="flex items-center gap-3">
                        <InfinityGlow size={24} />
                        <span className="font-display text-base text-ink">
                            Let It Go · Doctors
                        </span>
                    </div>
                    <p>
                        © {new Date().getFullYear()} Let It Go AI ·{" "}
                        <Link to="/" className="link-underline">Back to main site</Link>
                    </p>
                </div>
            </footer>
        </main>
    );
}
