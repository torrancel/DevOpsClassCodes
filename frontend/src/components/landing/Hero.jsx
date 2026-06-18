import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const LOGO_URL =
    "https://customer-assets.emergentagent.com/job_page-launch-106/artifacts/sl9ndszy_IMG_1175.png";

export default function Hero() {
    const { t } = useTranslation();
    return (
        <section
            id="top"
            data-testid="hero-section"
            className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-6 md:px-12 lg:px-20 overflow-hidden aurora stars grain"
        >
            {/* Floating eyebrow */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-3 mb-10"
            >
                <span className="h-px w-12 bg-gradient-to-r from-blue to-pink"></span>
                <span
                    data-testid="hero-eyebrow"
                    className="text-[11px] uppercase tracking-[0.35em] gradient-text font-medium"
                >
                    {t("hero.eyebrow")}
                </span>
            </motion.div>

            <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
                {/* Left: Headline */}
                <div className="col-span-12 lg:col-span-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1 }}
                        data-testid="hero-headline"
                        className="font-display text-[clamp(3rem,7.5vw,7.5rem)] leading-[0.95] tracking-tight text-ink"
                    >
                        {t("hero.headlinePre")}
                        <br />
                        {t("hero.headlineLine2")} <span className="gradient-text italic">{t("hero.headlineGradient")}</span>
                        <span className="text-pink">{t("hero.headlinePunct")}</span>
                    </motion.h1>
                </div>

                {/* Right: subline + CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="col-span-12 lg:col-span-4 lg:pl-8 lg:border-l lg:border-white/10"
                >
                    <p
                        data-testid="hero-subline"
                        className="text-base md:text-lg text-ink-soft leading-relaxed max-w-md"
                    >
                        {t("hero.sub")}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <a
                            href="#cta"
                            data-testid="hero-primary-cta"
                            className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3 text-sm font-medium transition-all active:scale-[0.98]"
                        >
                            {t("hero.ctaPrimary")}
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                        <a
                            href="#experience"
                            data-testid="hero-secondary-cta"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 text-ink px-6 py-3 text-sm font-medium hover:bg-white/5 transition-all"
                        >
                            {t("hero.ctaSecondary")}
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Visual band */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="mt-20 md:mt-28 grid grid-cols-12 gap-4 md:gap-6"
            >
                <div className="col-span-12 md:col-span-7 relative h-[360px] md:h-[520px] gradient-border overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img
                            src={LOGO_URL}
                            alt="Let It Go AI"
                            className="w-[78%] h-auto animate-drift"
                            style={{
                                filter: "drop-shadow(0 0 80px rgba(138,77,255,0.4))",
                            }}
                        />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">{t("hero.nowSensing")}</p>
                            <p className="font-display text-ink text-2xl md:text-3xl mt-1">
                                {t("hero.nowSensingTitle")}
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-4 py-2 backdrop-blur">
                            <span className="relative inline-block w-2 h-2 rounded-full bg-pink animate-breath"></span>
                            <span className="text-xs text-ink-soft">{t("hero.liveSignals")}</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-4 md:gap-6">
                    <div className="relative gradient-border p-8 overflow-hidden">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">{t("hero.side1Eyebrow")}</p>
                        <p className="font-display text-3xl md:text-4xl mt-4 leading-tight text-ink">
                            {t("hero.side1Pre")}
                            <br />
                            {t("hero.side1Post")} <em className="gradient-text not-italic">{t("hero.side1Gradient")}</em>.
                        </p>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-violet/30 blur-3xl"></div>
                    </div>
                    <div className="relative rounded-3xl bg-white/[0.03] p-8 border border-white/10 overflow-hidden backdrop-blur">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-2 w-2 rounded-full bg-blue"></span>
                            <span className="h-2 w-2 rounded-full bg-violet"></span>
                            <span className="h-2 w-2 rounded-full bg-pink"></span>
                        </div>
                        <p className="font-display text-2xl text-ink leading-snug italic">
                            &ldquo;{t("hero.side2Quote")}&rdquo;
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-ink-soft mt-6">
                            {t("hero.side2Author")}
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
