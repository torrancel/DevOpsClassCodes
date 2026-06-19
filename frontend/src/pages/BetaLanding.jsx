import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import InfinityGlow from "@/components/landing/InfinityGlow";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ROLES = [
    { value: "individual", label: "Individual" },
    { value: "doctor", label: "Doctor" },
    { value: "attorney", label: "Attorney" },
    { value: "teacher", label: "Teacher" },
    { value: "manager", label: "Manager" },
    { value: "parent", label: "Parent / Kids" },
    { value: "team", label: "Team lead" },
    { value: "other", label: "Other" },
];

/**
 * `/beta` — public beta-program landing + apply form.
 */
export default function BetaLanding() {
    const [form, setForm] = useState({ email: "", name: "", role: "individual", why: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
            toast.error("Please enter a valid email.");
            return;
        }
        if (!form.name.trim()) {
            toast.error("What should we call you?");
            return;
        }
        setSubmitting(true);
        try {
            const { data } = await axios.post(`${API}/beta/apply`, {
                email: form.email,
                name: form.name.trim(),
                role: form.role,
                why: form.why.trim() || null,
                referrer: typeof document !== "undefined" ? document.referrer : null,
            });
            setSubmitted(true);
            if (data?.already_applied) {
                toast.success("You're already on the list.", {
                    description: `Status: ${data.status}.`,
                });
            } else {
                toast.success("Application received. We read every one.");
            }
        } catch {
            toast.error("Something didn't go through. Try again in a moment.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main
            data-testid="beta-landing-page"
            className="min-h-screen bg-bg text-ink font-sans relative overflow-hidden"
        >
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/60 border-b border-white/5">
                <nav className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
                    <Link to="/" data-testid="beta-landing-home" className="flex items-center gap-3 group">
                        <ChevronLeft size={18} className="text-ink-soft group-hover:text-ink transition-colors" />
                        <InfinityGlow size={32} />
                        <span className="font-display text-xl tracking-tight">
                            Let It Go <span className="gradient-text font-sans text-sm align-top">AI</span>
                        </span>
                    </Link>
                    <Link
                        to="/beta/redeem"
                        data-testid="beta-landing-redeem"
                        className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
                    >
                        Have a code? →
                    </Link>
                </nav>
            </header>

            <section
                data-testid="beta-hero"
                className="relative pt-36 pb-16 md:pt-44 md:pb-24 px-6 md:px-12 lg:px-20 overflow-hidden aurora stars grain"
            >
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl"
                >
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6 flex items-center gap-2">
                        <Sparkles size={12} className="text-pink" /> Beta · cohort 01
                    </p>
                    <h1
                        data-testid="beta-headline"
                        className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tight"
                    >
                        Be one of the first
                        <br />
                        to <em className="gradient-text">let it go</em>.
                    </h1>
                    <p className="mt-8 text-lg md:text-xl text-ink-soft max-w-2xl leading-relaxed">
                        We&rsquo;re opening a small, intentional cohort. Daily emotional check-ins, AI-quiet co-regulation,
                        procedural ambient sounds, and a 30-day growth dashboard — yours to bend, break, and tell us about.
                    </p>
                </motion.div>
            </section>

            <section className="px-6 md:px-12 lg:px-20 pb-16">
                <div className="grid grid-cols-12 gap-6 md:gap-10">
                    <div className="col-span-12 lg:col-span-7">
                        <div className="gradient-border p-8 md:p-12">
                            <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-4">Apply</p>
                            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-8">
                                {submitted ? (
                                    <>Thank you. We&rsquo;ll <em className="gradient-text">be in touch</em>.</>
                                ) : (
                                    <>Tell us a little about you.</>
                                )}
                            </h2>

                            {submitted ? (
                                <div data-testid="beta-apply-success" className="space-y-4">
                                    <div className="flex items-center gap-3 text-ink-soft">
                                        <Check size={18} className="text-blue" />
                                        <p>Your application is in. We review every Monday.</p>
                                    </div>
                                    <p className="text-sm text-ink-soft">
                                        If approved, you&rsquo;ll receive a six-character code by email. Have one already?{" "}
                                        <Link to="/beta/redeem" className="link-underline gradient-text">
                                            Redeem it here.
                                        </Link>
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={submit} data-testid="beta-apply-form" className="space-y-5">
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.18em] text-ink-soft mb-2 block">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={set("email")}
                                            data-testid="beta-apply-email"
                                            className="w-full rounded-2xl bg-white/[0.04] border border-white/15 text-ink px-5 py-3.5 outline-none focus:bg-white/[0.08] focus:border-violet/60 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.18em] text-ink-soft mb-2 block">
                                            What should we call you?
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={set("name")}
                                            data-testid="beta-apply-name"
                                            className="w-full rounded-2xl bg-white/[0.04] border border-white/15 text-ink px-5 py-3.5 outline-none focus:bg-white/[0.08] focus:border-violet/60 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.18em] text-ink-soft mb-2 block">
                                            What carries you most of the day?
                                        </label>
                                        <select
                                            value={form.role}
                                            onChange={set("role")}
                                            data-testid="beta-apply-role"
                                            className="w-full rounded-2xl bg-white/[0.04] border border-white/15 text-ink px-5 py-3.5 outline-none focus:bg-white/[0.08] focus:border-violet/60 transition-colors"
                                        >
                                            {ROLES.map((r) => (
                                                <option key={r.value} value={r.value} className="bg-bg">
                                                    {r.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase tracking-[0.18em] text-ink-soft mb-2 block">
                                            Why do you want in? <span className="opacity-60">(optional)</span>
                                        </label>
                                        <textarea
                                            value={form.why}
                                            onChange={set("why")}
                                            rows={4}
                                            data-testid="beta-apply-why"
                                            className="w-full rounded-2xl bg-white/[0.04] border border-white/15 text-ink px-5 py-3.5 outline-none focus:bg-white/[0.08] focus:border-violet/60 transition-colors resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        data-testid="beta-apply-submit"
                                        className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3.5 text-sm font-medium transition-all disabled:opacity-60"
                                    >
                                        {submitting ? "Sending…" : "Send my application"}
                                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-5 space-y-6">
                        {[
                            { t: "Small. Intentional.", b: "We&rsquo;re onboarding in waves of ~50 people so we can hear every voice." },
                            { t: "Real product, real privacy.", b: "Your check-ins are yours. No training. No selling. Encryption in transit and at rest." },
                            { t: "Direct line.", b: "Bug reports and feature wishes go straight to the team — no support queue." },
                            { t: "Lifetime founding pricing locked.", b: "Beta seats are grandfathered into the founding price when we open public." },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.06 }}
                                className="gradient-border p-6"
                            >
                                <h3 className="font-display text-2xl text-ink mb-2">{f.t}</h3>
                                <p
                                    className="text-sm text-ink-soft leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: f.b }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
