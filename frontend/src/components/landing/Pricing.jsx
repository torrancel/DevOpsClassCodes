import { Check } from "lucide-react";
import { motion } from "framer-motion";

const TIERS = [
    {
        name: "Personal",
        price: "$14",
        cadence: "/ month",
        sub: "For your inner life.",
        features: [
            "Affect sensing on device",
            "Daily 90-sec check-ins",
            "12-month growth memory",
            "End-to-end encrypted",
        ],
        cta: "Start a 14-day quiet trial",
        accent: false,
    },
    {
        name: "Team",
        price: "$9",
        cadence: "/ user / month",
        sub: "For groups that actually want to listen.",
        features: [
            "Everything in Personal",
            "Meeting co-pilot",
            "Anonymous team affect telemetry",
            "Facilitator dashboard",
            "Slack & Zoom integrations",
        ],
        cta: "Book a quiet demo",
        accent: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        cadence: "",
        sub: "For organizations rebuilding around the human.",
        features: [
            "Everything in Team",
            "On-prem & VPC deployment",
            "Agent SDK & evals",
            "SOC 2 · HIPAA · ISO 27001",
            "Dedicated EQ engineer",
        ],
        cta: "Talk to founders",
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
                    Honest prices.
                    <br />
                    <em className="gradient-text">No</em> dark patterns.
                </h2>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {TIERS.map((t, i) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        data-testid={`pricing-tier-${t.name.toLowerCase()}`}
                        className={`col-span-12 md:col-span-4 rounded-3xl p-8 md:p-10 relative flex flex-col overflow-hidden ${
                            t.accent
                                ? "md:scale-[1.04]"
                                : ""
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
                            <span className="self-start text-[10px] uppercase tracking-[0.3em] bg-gradient-to-r from-blue via-violet to-pink text-white px-3 py-1 rounded-full mb-6">
                                Most chosen
                            </span>
                        )}
                        <h3 className="font-display text-4xl text-ink">{t.name}</h3>
                        <p className="mt-2 text-sm text-ink-soft">{t.sub}</p>
                        <div className="mt-8 flex items-baseline gap-2">
                            <span className={`font-display text-5xl md:text-6xl ${t.accent ? "gradient-text" : "text-ink"}`}>
                                {t.price}
                            </span>
                            <span className="text-ink-soft">{t.cadence}</span>
                        </div>
                        <ul className="mt-8 space-y-3 flex-1 text-ink">
                            {t.features.map((f) => (
                                <li key={f} className="flex items-start gap-3 text-sm">
                                    <Check size={16} className={`mt-0.5 ${t.accent ? "text-pink" : "text-violet"}`} />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <a
                            href="#cta"
                            data-testid={`pricing-cta-${t.name.toLowerCase()}`}
                            className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all active:scale-[0.98] ${
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
        </section>
    );
}
