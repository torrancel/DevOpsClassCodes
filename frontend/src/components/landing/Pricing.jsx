import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { setAudience } from "./audienceStore";

const TIERS = [
    {
        name: "Kids",
        slug: "kids",
        price: "$6",
        cadence: "/ month / child",
        sub: "Big feelings, small words.",
        features: [
            "Story-based emotion learning",
            "Breath games & lullaby mode",
            "Parent dashboard · COPPA-aligned",
            "Zero ads · zero data sale",
        ],
        cta: "Start the gentle plan",
        accent: false,
    },
    {
        name: "Individual",
        slug: "individual",
        price: "$14",
        cadence: "/ month",
        sub: "For your inner life.",
        features: [
            "Stress · anxiety · depression tracking",
            "Daily 90-sec check-ins",
            "12-month growth memory",
            "End-to-end encrypted",
        ],
        cta: "14-day quiet trial",
        accent: false,
    },
    {
        name: "Team",
        slug: "team",
        price: "$9",
        cadence: "/ user / month",
        sub: "For groups that listen.",
        features: [
            "Everything in Individual",
            "Meeting co-pilot",
            "Anonymous team telemetry",
            "Slack & Zoom integrations",
        ],
        cta: "Book a quiet demo",
        accent: true,
    },
    {
        name: "Professional",
        slug: "professional",
        price: "$39",
        cadence: "/ month",
        sub: "Doctors · attorneys · teachers · managers.",
        features: [
            "Profession-tuned mode",
            "Burnout & vicarious-trauma early warning",
            "HIPAA · FERPA · attorney-client",
            "Audit-grade meta logs",
        ],
        cta: "Choose your practice",
        accent: false,
    },
];

export default function Pricing() {
    return (
        <section
            id="pricing"
            data-testid="pricing-section"
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40"
        >
            <div className="mb-16 md:mb-20 max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">Pricing</p>
                <h2 className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink">
                    A plan for every
                    <br />
                    <em className="gradient-text">kind</em> of human.
                </h2>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {TIERS.map((t, i) => (
                    <motion.div
                        key={t.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        data-testid={`pricing-tier-${t.slug}`}
                        className={`col-span-12 md:col-span-6 lg:col-span-3 rounded-3xl p-7 md:p-8 relative flex flex-col overflow-hidden ${
                            t.accent ? "lg:scale-[1.04]" : ""
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
                        <p className="mt-2 text-xs text-ink-soft min-h-[2.5rem]">{t.sub}</p>
                        <div className="mt-6 flex items-baseline gap-2">
                            <span
                                className={`font-display text-4xl md:text-5xl ${
                                    t.accent ? "gradient-text" : "text-ink"
                                }`}
                            >
                                {t.price}
                            </span>
                            <span className="text-ink-soft text-xs">{t.cadence}</span>
                        </div>
                        <ul className="mt-7 space-y-3 flex-1 text-ink">
                            {t.features.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-sm">
                                    <Check
                                        size={15}
                                        className={`mt-0.5 shrink-0 ${
                                            t.accent ? "text-pink" : "text-violet"
                                        }`}
                                    />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="#cta"
                            onClick={() => setAudience(t.slug)}
                            data-testid={`pricing-cta-${t.slug}`}
                            className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all active:scale-[0.98] ${
                                t.accent
                                    ? "btn-glow bg-gradient-to-r from-blue via-violet to-pink text-white"
                                    : "border border-white/15 text-ink hover:bg-white/5"
                            }`}
                        >
                            {t.cta}
                        </a>
                    </motion.div>
                ))}
            </div>

            <p
                data-testid="pricing-enterprise-note"
                className="mt-10 text-sm text-ink-soft text-center max-w-2xl mx-auto"
            >
                Need on-prem, agent SDK, SOC 2, or a custom rollout?
                <a href="#cta" className="link-underline ml-2 text-ink">Talk to founders →</a>
            </p>
        </section>
    );
}
