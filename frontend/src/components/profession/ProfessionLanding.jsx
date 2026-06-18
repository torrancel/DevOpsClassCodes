import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Shield, Check, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useTranslation } from "react-i18next";
import InfinityGlow from "@/components/landing/InfinityGlow";
import FoundingBadge, { foundingPrice } from "@/components/landing/FoundingBadge";
import { PROFESSION_ICONS, PROFESSION_META } from "./professionConfigs";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * Generic, i18n-driven landing page used by:
 *   /doctors, /attorneys, /teachers, /managers
 *
 * All copy is read via t("profession.<slug>.<key>"). Icons & audience metadata come from
 * professionConfigs.js. Pricing tier accent is hard-coded to tier 2 (the "most chosen" middle one).
 */
export default function ProfessionLanding({ slug }) {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const icons = PROFESSION_ICONS[slug];
    const meta = PROFESSION_META[slug];
    const tp = (k, opts) => t(`profession.${slug}.${k}`, opts);
    const tc = (k, opts) => t(`profession.${k}`, opts);

    const submit = async (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error(t("common.validEmailError"));
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API}/waitlist`, {
                email,
                audience: meta.audience,
                source: `${slug}-page`,
            });
            toast.success(`${tp("successLabel")} — ${t("common.lifetimeLocked")}`, {
                description: data.email_sent
                    ? t("cta.emailLanded", { defaultValue: "A quiet confirmation just landed in your inbox." })
                    : `Saved ${email}.`,
            });
            setEmail("");
        } catch {
            toast.error(t("common.genericError"));
        } finally {
            setLoading(false);
        }
    };

    const EyebrowIcon = icons.eyebrowIcon;
    const TestimonialIcon = icons.testimonialIcon;
    const stats = [1, 2, 3, 4].map((n) => ({ v: tp(`stat${n}V`), l: tp(`stat${n}L`) }));
    const stressors = [1, 2, 3, 4].map((n, i) => ({
        Icon: icons.stressorIcons[i],
        title: tp(`s${n}T`),
        text: tp(`s${n}B`),
    }));
    const modules = [
        { title: tp("m1T"), text: tp("m1B"), color: "#5E8BFF" },
        { title: tp("m2T"), text: tp("m2B"), color: "#FF6FD3" },
        { title: tp("m3T"), text: tp("m3B"), color: "#8A4DFF" },
        { title: tp("m4T"), text: tp("m4B"), color: "#FF8A5C" },
    ];
    const compliance = [1, 2, 3, 4, 5].map((n) => tp(`c${n}`));
    const tiers = [1, 2, 3].map((n) => ({
        name: tp(`t${n}N`),
        price: tp(`t${n}P`),
        cadence: tp(`t${n}C`),
        sub: tp(`t${n}S`),
        features: [1, 2, 3, 4].map((k) => tp(`t${n}F${k}`)),
        accent: n === 2,
    }));
    const faq = [1, 2, 3, 4].map((n) => ({ q: tp(`f${n}Q`), a: tp(`f${n}A`) }));

    return (
        <main
            data-testid={`${slug}-landing`}
            className="font-sans bg-bg text-ink min-h-screen"
        >
            {/* Lightweight nav */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/60 border-b border-white/5">
                <nav className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
                    <Link
                        to="/"
                        data-testid={`${slug}-back-link`}
                        className="flex items-center gap-3 group"
                    >
                        <ChevronLeft size={18} className="text-ink-soft group-hover:text-ink transition-colors" />
                        <InfinityGlow size={32} />
                        <span className="font-display text-xl tracking-tight text-ink">
                            Let It Go <span className="gradient-text font-sans text-sm font-medium align-top">AI</span>
                        </span>
                    </Link>
                    <a
                        href={`#${slug}-cta`}
                        data-testid={`${slug}-nav-cta`}
                        className="btn-glow rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-5 py-2.5 text-sm font-medium hover:opacity-95 transition-all active:scale-[0.98]"
                    >
                        {tc("reserveCta")}
                    </a>
                </nav>
            </header>

            {/* HERO */}
            <section
                data-testid={`${slug}-hero`}
                className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-6 md:px-12 lg:px-20 overflow-hidden aurora stars grain"
            >
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-3 mb-10"
                >
                    <EyebrowIcon size={16} className="text-blue" />
                    <span className="text-[11px] uppercase tracking-[0.35em] gradient-text font-medium">
                        {tp("eyebrowLabel")}
                    </span>
                </motion.div>

                <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
                    <div className="col-span-12 lg:col-span-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1 }}
                            data-testid={`${slug}-headline`}
                            className="font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] tracking-tight text-ink whitespace-pre-line"
                        >
                            {tp("heroPre")}
                            <br />
                            <span className="gradient-text italic">{tp("heroGradient")}</span>
                            <span className="text-pink">{tp("heroPost")}</span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="col-span-12 lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/10"
                    >
                        <p className="text-base md:text-lg text-ink-soft leading-relaxed max-w-md">
                            {tp("heroSub")}
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href={`#${slug}-cta`}
                                data-testid={`${slug}-hero-cta`}
                                className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3 text-sm font-medium transition-all active:scale-[0.98]"
                            >
                                {tc("reserveCta")}
                                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                            <Link
                                to="/"
                                data-testid={`${slug}-hero-back`}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 text-ink px-6 py-3 text-sm font-medium hover:bg-white/5 transition-all"
                            >
                                {t("common.seeFullPlatform")}
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
                    {stats.map((s, i) => (
                        <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-3 gradient-border p-6">
                            <p className="font-display text-5xl gradient-text">{s.v}</p>
                            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft mt-3 leading-relaxed">{s.l}</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* STRESSORS */}
            <section
                data-testid={`${slug}-stressors`}
                className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-bg-soft border-y border-white/5"
            >
                <div className="max-w-3xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">{tc("weKnow")}</p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink whitespace-pre-line">
                        {tp("stressorsPre")}
                        <em className="gradient-text">{tp("stressorsGradient")}</em>
                        {tp("stressorsPost")}
                    </h2>
                </div>
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {stressors.map((s, i) => {
                        const Icon = s.Icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                data-testid={`${slug}-stressor-${i}`}
                                className="col-span-12 sm:col-span-6 lg:col-span-3 gradient-border p-7"
                            >
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/10 mb-5">
                                    <Icon size={18} strokeWidth={1.5} className="text-ink" />
                                </div>
                                <h3 className="font-display text-2xl text-ink mb-3">{s.title}</h3>
                                <p className="text-sm text-ink-soft leading-relaxed">{s.text}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* MODULES */}
            <section
                data-testid={`${slug}-modules`}
                className="px-6 md:px-12 lg:px-20 py-24 md:py-40"
            >
                <div className="max-w-4xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">{tp("modulesEyebrow")}</p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink whitespace-pre-line">
                        {tp("modulesPre")}
                        <em className="gradient-text">{tp("modulesGradient")}</em>
                        {tp("modulesPost")}
                    </h2>
                </div>
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {modules.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            data-testid={`${slug}-module-${i}`}
                            className="col-span-12 md:col-span-6 relative gradient-border p-8 md:p-10 overflow-hidden"
                        >
                            <div
                                className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
                                style={{ background: m.color }}
                            />
                            <p className="relative text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">Step 0{i + 1}</p>
                            <h3 className="relative font-display text-3xl md:text-4xl text-ink mb-4">{m.title}</h3>
                            <p className="relative text-base text-ink-soft leading-relaxed">{m.text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* COMPLIANCE */}
            <section
                data-testid={`${slug}-compliance`}
                className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-bg-soft border-y border-white/5"
            >
                <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
                    <div className="col-span-12 md:col-span-5">
                        <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">{tc("privacyEyebrow")}</p>
                        <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight text-ink whitespace-pre-line">
                            {tp("compliancePre")}
                            <em className="gradient-text">{tp("complianceGradient")}</em>
                            {tp("compliancePost")}
                        </h2>
                        <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-ink">
                            <Shield size={14} className="text-blue" />
                            {tp("complianceChip")}
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-7 md:pl-8">
                        <ul className="space-y-4">
                            {compliance.map((c, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                    data-testid={`${slug}-compliance-${i}`}
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
                data-testid={`${slug}-pricing`}
                className="px-6 md:px-12 lg:px-20 py-24 md:py-32"
            >
                <div className="max-w-3xl mb-16">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">{meta.footerBrand} {tc("pricingSuffix")}</p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink">
                        {tp("pricingPre")}
                        <em className="gradient-text">{tp("pricingGradient")}</em>
                        {tp("pricingPost")}
                    </h2>
                </div>

                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            data-testid={`${slug}-tier-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className={`col-span-12 md:col-span-4 rounded-3xl p-8 md:p-10 relative flex flex-col overflow-hidden ${tier.accent ? "md:scale-[1.04]" : ""}`}
                            style={
                                tier.accent
                                    ? {
                                          background: "linear-gradient(160deg, rgba(94,139,255,0.15), rgba(138,77,255,0.18), rgba(255,111,211,0.15))",
                                          border: "1px solid rgba(255,255,255,0.18)",
                                          boxShadow: "0 30px 80px -20px rgba(138,77,255,0.45)",
                                      }
                                    : {
                                          background: "rgba(255,255,255,0.025)",
                                          border: "1px solid rgba(255,255,255,0.08)",
                                      }
                            }
                        >
                            {tier.accent && (
                                <span className="self-start text-[10px] uppercase tracking-[0.3em] bg-gradient-to-r from-blue via-violet to-pink text-white px-3 py-1 rounded-full mb-5">
                                    {t("common.mostChosen")}
                                </span>
                            )}
                            <h3 className="font-display text-3xl text-ink">{tier.name}</h3>
                            <p className="mt-2 text-sm text-ink-soft min-h-[2.5rem]">{tier.sub}</p>
                            <div className="mt-6 flex items-baseline gap-2 flex-wrap">
                                {foundingPrice(tier.price) ? (
                                    <>
                                        <span className={`font-display text-5xl ${tier.accent ? "gradient-text" : "text-ink"}`}>
                                            {foundingPrice(tier.price)}
                                        </span>
                                        <span className="text-ink-soft line-through text-sm font-mono">
                                            {tier.price}
                                        </span>
                                    </>
                                ) : (
                                    <span className={`font-display text-5xl ${tier.accent ? "gradient-text" : "text-ink"}`}>
                                        {tier.price}
                                    </span>
                                )}
                                <span className="text-ink-soft text-xs">{tier.cadence}</span>
                            </div>
                            {foundingPrice(tier.price) && (
                                <p className="mt-1 text-[10px] uppercase tracking-[0.25em] gradient-text">
                                    {t("common.lifetimeLocked")}
                                </p>
                            )}
                            <ul className="mt-7 space-y-3 flex-1 text-ink">
                                {tier.features.map((f, k) => (
                                    <li key={k} className="flex items-start gap-2.5 text-sm">
                                        <Check size={15} className={`mt-0.5 shrink-0 ${tier.accent ? "text-pink" : "text-violet"}`} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={`#${slug}-cta`}
                                data-testid={`${slug}-tier-cta-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
                                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all active:scale-[0.98] ${tier.accent ? "btn-glow bg-gradient-to-r from-blue via-violet to-pink text-white" : "border border-white/15 text-ink hover:bg-white/5"}`}
                            >
                                {tc("reserveSeat")}
                            </a>
                            {i === 0 && (
                                <FoundingBadge
                                    audience={meta.audience}
                                    accent={tier.accent}
                                    label={tp("foundingLabel")}
                                    data-testid={`${slug}-founding-badge`}
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIAL */}
            <section
                data-testid={`${slug}-testimonial`}
                className="px-6 md:px-12 lg:px-20 py-24 md:py-32 bg-bg-soft border-y border-white/5"
            >
                <div className="max-w-3xl mx-auto text-center">
                    <TestimonialIcon size={20} className="text-pink mx-auto mb-6" />
                    <blockquote className="font-display italic text-2xl md:text-4xl text-ink leading-snug">
                        “{tp("testimonialQuote")}”
                    </blockquote>
                    <p className="mt-8 text-xs uppercase tracking-[0.3em] text-ink-soft">
                        — {tp("testimonialAuthor")}
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section data-testid={`${slug}-faq`} className="px-6 md:px-12 lg:px-20 py-24 md:py-32">
                <div className="grid grid-cols-12 gap-6 md:gap-10">
                    <div className="col-span-12 md:col-span-4">
                        <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">{tc("faqEyebrow")}</p>
                        <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight text-ink sticky top-28 whitespace-pre-line">
                            {tc("specificAnswers", { brand: meta.footerBrand }).split("\n").map((line, idx) => (
                                <span key={idx}>
                                    {line.includes(tc("honest")) ? (
                                        line.split(tc("honest")).map((p, j, arr) => (
                                            <span key={j}>
                                                {p}
                                                {j < arr.length - 1 && <em className="gradient-text">{tc("honest")}</em>}
                                            </span>
                                        ))
                                    ) : line}
                                    {idx === 0 && <br />}
                                </span>
                            ))}
                        </h2>
                    </div>
                    <div className="col-span-12 md:col-span-8 space-y-6">
                        {faq.map((f, i) => (
                            <div key={i} data-testid={`${slug}-faq-${i}`} className="border-b border-white/10 pb-6">
                                <h3 className="font-display text-xl md:text-2xl text-ink mb-3">{f.q}</h3>
                                <p className="text-base md:text-lg text-ink-soft leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section
                id={`${slug}-cta`}
                data-testid={`${slug}-cta`}
                className="px-6 md:px-12 lg:px-20 py-20 md:py-32"
            >
                <div
                    className="relative rounded-[2rem] px-6 md:px-16 py-20 md:py-32 overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #0B0613 0%, #1A0930 45%, #2A1140 100%)",
                        border: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    <div className="absolute -right-32 -top-32 w-[28rem] h-[28rem] rounded-full bg-pink/30 blur-3xl"></div>
                    <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-blue/30 blur-3xl"></div>
                    <div className="absolute inset-0 stars opacity-70 pointer-events-none"></div>

                    <div className="relative max-w-3xl">
                        <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-8">{tp("ctaLabel")}</p>
                        <h2 className="font-display text-4xl md:text-7xl leading-[0.95] tracking-tight text-ink whitespace-pre-line">
                            {tp("ctaTitlePre")}
                            <em className="gradient-text">{tp("ctaTitleGradient")}</em>
                            {tp("ctaTitlePost")}
                        </h2>
                        <p className="mt-8 text-lg md:text-xl text-ink-soft max-w-xl">{tp("ctaSub")}</p>

                        <form
                            onSubmit={submit}
                            noValidate
                            data-testid={`${slug}-cta-form`}
                            className="mt-12 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={tp("ctaPlaceholder")}
                                data-testid={`${slug}-cta-email`}
                                className="flex-1 rounded-full bg-white/[0.06] border border-white/15 text-ink placeholder:text-ink-soft/60 px-6 py-4 outline-none focus:bg-white/[0.1] focus:border-violet/60 transition-colors font-sans"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                data-testid={`${slug}-cta-submit`}
                                className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-4 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60"
                            >
                                {loading ? t("common.listening") : tc("reserveCta")}
                                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                        </form>

                        <p className="mt-6 text-xs text-ink-soft">{tp("ctaFootnote")}</p>
                    </div>
                </div>
            </section>

            <footer className="px-6 md:px-12 lg:px-20 py-10 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-ink-soft">
                    <div className="flex items-center gap-3">
                        <InfinityGlow size={24} />
                        <span className="font-display text-base text-ink">Let It Go · {meta.footerBrand}</span>
                    </div>
                    <p>
                        © {new Date().getFullYear()} Let It Go AI ·{" "}
                        <Link to="/" className="link-underline">{t("common.backToSite")}</Link>
                    </p>
                </div>
            </footer>
        </main>
    );
}
