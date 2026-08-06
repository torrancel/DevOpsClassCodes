import { Check, X, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { setAudience } from "@/components/landing/audienceStore";
import FoundingBadge, { foundingPrice } from "@/components/landing/FoundingBadge";
import {
    Section,
    GradientHeadline,
    GlassCard,
    StatusBadge,
    PrimaryButton,
    SecondaryButton,
} from "@/components/ds";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TIER_META = [
    {
        slug: "kids",
        i18n: "kids",
        price: "$6",
        package: "kids_founding",
        accent: false,
        color: "cyan",
        featuresCount: 4,
    },
    {
        slug: "individual",
        i18n: "individual",
        price: "$14",
        package: "individual_founding",
        accent: false,
        color: "blue",
        featuresCount: 4,
    },
    {
        slug: "team",
        i18n: "team",
        price: "$9",
        package: "team_founding",
        accent: true,
        color: "violet",
        featuresCount: 4,
    },
    {
        slug: "professional",
        i18n: "professional",
        price: "$39",
        package: "professional_founding",
        accent: false,
        color: "magenta",
        featuresCount: 4,
    },
];

export default function PricingV2() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [loadingTier, setLoadingTier] = useState(null);
    const [emailPrompt, setEmailPrompt] = useState(null);
    const [email, setEmail] = useState("");

    const TIERS = TIER_META.map((m) => ({
        ...m,
        name: t(`v2Landing.pricing.${m.i18n}Name`),
        sub: t(`v2Landing.pricing.${m.i18n}Sub`),
        cadence: t(`v2Landing.pricing.${m.i18n}Cadence`),
        features: t(`v2Landing.pricing.${m.i18n}Features`, { returnObjects: true }),
    }));

    const launchCheckout = async (tier, emailOverride) => {
        setLoadingTier(tier.slug);
        setAudience(tier.slug);
        try {
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const body = { package_id: tier.package, origin_url: origin };
            if (emailOverride) body.email = emailOverride;
            const { data } = await axios.post(
                `${API}/payments/checkout/session`,
                body,
                { withCredentials: true },
            );
            if (data?.url) {
                window.location.href = data.url;
            } else {
                toast.error(t("v2Landing.pricing.checkoutError"));
                setLoadingTier(null);
            }
        } catch (err) {
            const msg = err?.response?.data?.detail || t("v2Landing.pricing.checkoutFailed");
            toast.error(msg);
            setLoadingTier(null);
        }
    };

    const startCheckout = (tier) => {
        if (user?.email) {
            launchCheckout(tier);
            return;
        }
        setEmail("");
        setEmailPrompt({ tier });
    };

    const submitEmailPrompt = (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error(t("v2Landing.pricing.receiptError"));
            return;
        }
        const tier = emailPrompt.tier;
        setEmailPrompt(null);
        launchCheckout(tier, email.trim().toLowerCase());
    };

    return (
        <Section id="pricing" size="lg" data-testid="pricing-section">
            <div aria-hidden="true" className="lg-ambient opacity-60" />
            <div className="relative">
                <div className="mb-16 md:mb-20 max-w-3xl">
                    <StatusBadge tone="cyan" className="mb-8">
                        {t("v2Landing.pricing.eyebrow")}
                    </StatusBadge>
                    <GradientHeadline as="h2" size="lg">
                        {t("v2Landing.pricing.headlinePre")}
                        <br />
                        <span className="lg-gradient-text italic">{t("v2Landing.pricing.headlineGradient")}</span>{t("v2Landing.pricing.headlinePost")}
                    </GradientHeadline>
                    <p
                        data-testid="pricing-founding-banner"
                        className="mt-8 text-lg text-lg-ink-soft max-w-2xl leading-relaxed"
                    >
                        {t("v2Landing.pricing.banner")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
                    {TIERS.map((tier, i) => (
                        <motion.div
                            key={tier.slug}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: i * 0.08 }}
                            className={tier.accent ? "xl:scale-[1.04] xl:-my-1" : ""}
                        >
                            <GlassCard
                                data-testid={`pricing-tier-${tier.slug}`}
                                padding="lg"
                                radius="lg"
                                accent={tier.accent ? "violet" : tier.color}
                                className={`h-full flex flex-col ${
                                    tier.accent
                                        ? "!border-white/20"
                                        : ""
                                }`}
                            >
                                {tier.accent && (
                                    <div className="mb-5 flex">
                                        <span className="lg-btn-primary text-[10px] uppercase tracking-[0.3em] px-3 py-1.5 rounded-full font-semibold inline-flex items-center gap-1.5">
                                            <Sparkles size={10} />
                                            {t("v2Landing.pricing.mostChosen")}
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-2xl md:text-[28px] font-semibold text-lg-ink tracking-[-0.02em]">
                                    {tier.name}
                                </h3>
                                <p className="mt-2 text-[13px] text-lg-ink-soft min-h-[3rem] leading-relaxed">
                                    {tier.sub}
                                </p>

                                <div className="mt-6 flex items-baseline gap-2 flex-wrap">
                                    <span
                                        className={`text-[42px] md:text-5xl font-semibold tracking-[-0.03em] ${
                                            tier.accent
                                                ? "lg-gradient-text"
                                                : "text-lg-ink"
                                        }`}
                                    >
                                        {foundingPrice(tier.price) || tier.price}
                                    </span>
                                    {foundingPrice(tier.price) && (
                                        <span className="text-lg-ink-muted line-through text-sm">
                                            {tier.price}
                                        </span>
                                    )}
                                    <span className="text-lg-ink-soft text-xs">
                                        {tier.cadence}
                                    </span>
                                </div>
                                {foundingPrice(tier.price) && (
                                    <p className="mt-1 text-[10px] uppercase tracking-[0.25em] lg-gradient-text font-medium">
                                        {t("v2Landing.pricing.lifetimeLocked")}
                                    </p>
                                )}

                                <ul className="mt-7 space-y-3 flex-1">
                                    {tier.features.map((f, n) => (
                                        <li
                                            key={n}
                                            className="flex items-start gap-2.5 text-[14px] text-lg-ink"
                                        >
                                            <Check
                                                size={14}
                                                className={`mt-1 shrink-0 ${
                                                    tier.accent
                                                        ? "text-lg-magenta"
                                                        : "text-lg-violet"
                                                }`}
                                                strokeWidth={2.5}
                                            />
                                            <span className="leading-snug">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 space-y-3">
                                    {tier.accent ? (
                                        <PrimaryButton
                                            onClick={() => startCheckout(tier)}
                                            loading={loadingTier === tier.slug}
                                            loadingText={t("v2Landing.pricing.openingCheckout")}
                                            data-testid={`pricing-cta-${tier.slug}`}
                                            className="w-full"
                                            icon={null}
                                        >
                                            {t("v2Landing.pricing.becomeFounder")}
                                        </PrimaryButton>
                                    ) : (
                                        <SecondaryButton
                                            onClick={() => startCheckout(tier)}
                                            data-testid={`pricing-cta-${tier.slug}`}
                                            className="w-full"
                                        >
                                            {loadingTier === tier.slug
                                                ? t("v2Landing.pricing.openingCheckout")
                                                : t("v2Landing.pricing.becomeFounder")}
                                        </SecondaryButton>
                                    )}
                                    <a
                                        href="/beta"
                                        onClick={() => setAudience(tier.slug)}
                                        data-testid={`pricing-waitlist-${tier.slug}`}
                                        className="block text-center text-[10.5px] uppercase tracking-[0.25em] text-lg-ink-muted hover:text-lg-ink transition-colors"
                                    >
                                        {t("v2Landing.pricing.orApplyBeta")}
                                    </a>
                                </div>

                                <FoundingBadge
                                    audience={tier.slug}
                                    accent={tier.accent}
                                    data-testid={`founding-${tier.slug}`}
                                />
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                <p
                    data-testid="pricing-enterprise-note"
                    className="mt-12 text-sm text-lg-ink-soft text-center max-w-2xl mx-auto"
                >
                    {t("v2Landing.pricing.enterpriseNote")}{" "}
                    <a
                        href="#cta"
                        className="text-lg-ink underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
                    >
                        {t("v2Landing.pricing.talkToFounders")}
                    </a>
                </p>
            </div>

            {/* Email prompt modal */}
            {emailPrompt && (
                <div
                    data-testid="pricing-email-modal"
                    className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[rgba(5,5,7,0.75)] backdrop-blur-md px-4"
                    onClick={(e) => e.target === e.currentTarget && setEmailPrompt(null)}
                >
                    <form
                        onSubmit={submitEmailPrompt}
                        className="relative w-full md:max-w-md lg-panel lg-panel-lg p-7 md:p-8 space-y-5"
                    >
                        <button
                            type="button"
                            onClick={() => setEmailPrompt(null)}
                            data-testid="pricing-email-modal-close"
                            aria-label="Close"
                            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-lg-ink-soft hover:text-lg-ink hover:bg-white/5 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <div>
                            <p className="lg-eyebrow lg-gradient-text mb-2">
                                {t("v2Landing.pricing.emailModalEyebrow")}
                            </p>
                            <h3 className="text-2xl md:text-[28px] font-semibold text-lg-ink tracking-[-0.02em]">
                                {t("v2Landing.pricing.emailModalTitlePre")}{" "}
                                <span className="lg-gradient-text italic">{t("v2Landing.pricing.emailModalTitleGradient")}</span>?
                            </h3>
                            <p className="mt-2 text-sm text-lg-ink-soft">
                                {t("v2Landing.pricing.emailModalSub")}
                            </p>
                        </div>
                        <div className="relative">
                            <Mail
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-lg-violet"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                placeholder="you@quietmail.com"
                                data-testid="pricing-email-modal-input"
                                className="w-full rounded-full bg-white/[0.06] border border-white/15 text-lg-ink placeholder:text-lg-ink-muted pl-11 pr-5 py-3.5 outline-none focus:bg-white/[0.1] focus:border-lg-violet transition-colors"
                            />
                        </div>
                        <PrimaryButton
                            type="submit"
                            data-testid="pricing-email-modal-submit"
                            className="w-full"
                            icon={null}
                        >
                            {t("v2Landing.pricing.emailModalContinue")}
                        </PrimaryButton>
                    </form>
                </div>
            )}
        </Section>
    );
}
