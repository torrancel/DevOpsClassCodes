import { Check, X, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { setAudience } from "./audienceStore";
import FoundingBadge, { foundingPrice } from "./FoundingBadge";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TIERS = [
    { slug: "kids",         price: "$6",  cadenceKey: "common.child",   accent: false, package: "kids_founding" },
    { slug: "individual",   price: "$14", cadenceKey: "common.month",   accent: false, package: "individual_founding" },
    { slug: "team",         price: "$9",  cadenceKey: "common.perUser", accent: true,  package: "team_founding" },
    { slug: "professional", price: "$39", cadenceKey: "common.month",   accent: false, package: "professional_founding" },
];

export default function Pricing() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loadingTier, setLoadingTier] = useState(null);
    const [emailPrompt, setEmailPrompt] = useState(null); // { tier } when modal is open
    const [email, setEmail] = useState("");

    const launchCheckout = async (tier, emailOverride) => {
        setLoadingTier(tier.slug);
        setAudience(tier.slug);
        try {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const body = { package_id: tier.package, origin_url: origin };
            if (emailOverride) body.email = emailOverride;
            const { data } = await axios.post(`${API}/payments/checkout/session`, body, { withCredentials: true });
            if (data?.url) {
                window.location.href = data.url;
            } else {
                toast.error("Couldn't open checkout. Try again in a moment.");
                setLoadingTier(null);
            }
        } catch (err) {
            const msg = err?.response?.data?.detail || "Checkout failed.";
            toast.error(msg);
            setLoadingTier(null);
        }
    };

    const startCheckout = (tier) => {
        // Logged-in users: backend already has their email
        if (user?.email) {
            launchCheckout(tier);
            return;
        }
        // Anonymous: collect email so we can email a receipt + reconcile entitlement at signup
        setEmail("");
        setEmailPrompt({ tier });
    };

    const submitEmailPrompt = (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Drop a valid email so we can send your receipt.");
            return;
        }
        const tier = emailPrompt.tier;
        setEmailPrompt(null);
        launchCheckout(tier, email.trim().toLowerCase());
    };

    return (
        <section
            id="pricing"
            data-testid="pricing-section"
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40"
        >
            <div className="mb-16 md:mb-20 max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">{t("pricing.eyebrow")}</p>
                <h2 className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink">
                    {t("pricing.headlinePre")}
                    <br />
                    <em className="gradient-text">{t("pricing.headlineGradient")}</em> {t("pricing.headlinePost")}
                </h2>
                <p className="mt-6 text-base md:text-lg text-ink-soft max-w-xl" data-testid="pricing-founding-banner">
                    <span className="gradient-text font-medium">{t("pricing.banner")}</span>{" "}
                    {t("pricing.bannerRest")}
                </p>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {TIERS.map((tier, i) => (
                    <motion.div
                        key={tier.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        data-testid={`pricing-tier-${tier.slug}`}
                        className={`col-span-12 md:col-span-6 lg:col-span-3 rounded-3xl p-7 md:p-8 relative flex flex-col overflow-hidden ${
                            tier.accent ? "lg:scale-[1.04]" : ""
                        }`}
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
                        <h3 className="font-display text-3xl text-ink">{t(`pricing.${tier.slug}.name`)}</h3>
                        <p className="mt-2 text-xs text-ink-soft min-h-[2.5rem]">{t(`pricing.${tier.slug}.sub`)}</p>
                        <div className="mt-6 flex items-baseline gap-2 flex-wrap">
                            <span className={`font-display text-4xl md:text-5xl ${tier.accent ? "gradient-text" : "text-ink"}`}>
                                {foundingPrice(tier.price) || tier.price}
                            </span>
                            {foundingPrice(tier.price) && (
                                <span className="text-ink-soft line-through text-sm font-mono">{tier.price}</span>
                            )}
                            <span className="text-ink-soft text-xs">{t(tier.cadenceKey)}</span>
                        </div>
                        {foundingPrice(tier.price) && (
                            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] gradient-text">
                                {t("common.lifetimeLocked")}
                            </p>
                        )}
                        <ul className="mt-7 space-y-3 flex-1 text-ink">
                            {[1, 2, 3, 4].map((n) => (
                                <li key={n} className="flex items-start gap-2.5 text-sm">
                                    <Check size={15} className={`mt-0.5 shrink-0 ${tier.accent ? "text-pink" : "text-violet"}`} />
                                    {t(`pricing.${tier.slug}.feature${n}`)}
                                </li>
                            ))}
                        </ul>
                        <button
                            type="button"
                            onClick={() => startCheckout(tier)}
                            disabled={loadingTier === tier.slug}
                            data-testid={`pricing-cta-${tier.slug}`}
                            className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60 ${
                                tier.accent
                                    ? "btn-glow bg-gradient-to-r from-blue via-violet to-pink text-white"
                                    : "border border-white/15 text-ink hover:bg-white/5"
                            }`}
                        >
                            {loadingTier === tier.slug ? "Opening checkout…" : t(`pricing.${tier.slug}.cta`)}
                        </button>
                        <a
                            href="#cta"
                            onClick={() => setAudience(tier.slug)}
                            data-testid={`pricing-waitlist-${tier.slug}`}
                            className="mt-3 text-[10px] uppercase tracking-[0.25em] text-ink-soft hover:text-ink text-center link-underline"
                        >
                            Or apply for the beta →
                        </a>
                        <FoundingBadge
                            audience={tier.slug}
                            accent={tier.accent}
                            data-testid={`founding-${tier.slug}`}
                        />
                    </motion.div>
                ))}
            </div>

            <p
                data-testid="pricing-enterprise-note"
                className="mt-10 text-sm text-ink-soft text-center max-w-2xl mx-auto"
            >
                {t("pricing.enterpriseNote")}
                <a href="#cta" className="link-underline ml-2 text-ink">{t("common.talkToFounders")} →</a>
            </p>

            {/* Email-prompt modal for anonymous checkout */}
            {emailPrompt && (
                <div
                    data-testid="pricing-email-modal"
                    className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-bg/80 backdrop-blur-sm px-4"
                    onClick={(e) => e.target === e.currentTarget && setEmailPrompt(null)}
                >
                    <form
                        onSubmit={submitEmailPrompt}
                        className="relative w-full md:max-w-md bg-bg-soft border border-white/15 rounded-t-3xl md:rounded-3xl p-7 md:p-8 space-y-5"
                    >
                        <button
                            type="button"
                            onClick={() => setEmailPrompt(null)}
                            data-testid="pricing-email-modal-close"
                            aria-label="Close"
                            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-white/5 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] gradient-text mb-2">One step before checkout</p>
                            <h3 className="font-display text-2xl md:text-3xl tracking-tight">
                                Where should we send your <em className="gradient-text">receipt</em>?
                            </h3>
                            <p className="mt-2 text-sm text-ink-soft">
                                We&rsquo;ll lock your founding seat to this email so you can sign in later.
                            </p>
                        </div>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-violet" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                placeholder="you@quietmail.com"
                                data-testid="pricing-email-modal-input"
                                className="w-full rounded-full bg-white/[0.06] border border-white/15 text-ink placeholder:text-ink-soft/60 pl-11 pr-5 py-3.5 outline-none focus:bg-white/[0.1] focus:border-violet/60 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            data-testid="pricing-email-modal-submit"
                            className="btn-glow w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3.5 text-sm font-medium transition-all"
                        >
                            Continue to checkout
                        </button>
                    </form>
                </div>
            )}
        </section>
    );
}
