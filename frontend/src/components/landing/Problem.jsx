import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Problem() {
    const { t } = useTranslation();
    return (
        <section
            data-testid="problem-section"
            className="relative px-6 md:px-12 lg:px-20 py-24 md:py-40 overflow-hidden"
        >
            <div className="absolute inset-0 aurora opacity-60 pointer-events-none"></div>

            <div className="relative grid grid-cols-12 gap-6 md:gap-12 items-start">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-7"
                >
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                        {t("problem.eyebrow")}
                    </p>
                    <h2
                        data-testid="problem-headline"
                        className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink whitespace-pre-line"
                    >
                        {t("problem.headlinePre")}
                        <em className="gradient-text">{t("problem.headlineGradient1")}</em>
                        {t("problem.headlineMiddle")}
                        <span className="text-pink">{t("problem.headlinePinkWord")}</span>
                        {t("problem.headlineEnd")}
                        <em className="gradient-text">{t("problem.headlineGradient2")}</em>
                        {t("problem.headlineFinal")}
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="col-span-12 md:col-span-5 space-y-8 pt-2 md:pt-24"
                >
                    <p className="text-lg text-ink-soft leading-relaxed">
                        {t("problem.sub")}
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                        <div>
                            <p className="font-display text-5xl gradient-text">71%</p>
                            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft mt-2">
                                {t("problem.stat1Label")}
                            </p>
                        </div>
                        <div>
                            <p className="font-display text-5xl gradient-text">0</p>
                            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft mt-2">
                                {t("problem.stat2Label")}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
