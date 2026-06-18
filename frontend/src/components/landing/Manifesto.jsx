import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Manifesto() {
    const { t } = useTranslation();
    return (
        <section
            id="manifesto"
            data-testid="manifesto-section"
            className="relative px-6 md:px-12 lg:px-20 py-24 md:py-48 overflow-hidden"
        >
            <div className="absolute inset-0 aurora opacity-60 pointer-events-none"></div>
            <div className="absolute inset-0 stars pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative max-w-3xl mx-auto"
            >
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-10 text-center">
                    {t("manifesto.eyebrow")}
                </p>

                <h2 className="font-display text-3xl md:text-5xl leading-[1.15] tracking-tight text-ink text-center">
                    {t("manifesto.title")}
                </h2>

                <div className="mt-16 space-y-6 text-lg md:text-xl text-ink-soft leading-relaxed">
                    <p>{t("manifesto.p1")}</p>
                    <p>{t("manifesto.p2")}</p>
                    <p className="font-display italic text-ink text-2xl md:text-3xl pt-4 whitespace-pre-line">
                        {t("manifesto.p3Plain")}
                        <span className="gradient-text">{t("manifesto.p3Gradient")}</span>
                        {t("manifesto.p3Rest")}
                    </p>
                </div>

                <div className="mt-16 flex items-center justify-center gap-4">
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-violet to-transparent"></div>
                    <p className="text-sm uppercase tracking-[0.3em] text-ink-soft">
                        {t("manifesto.signature")}
                    </p>
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-pink to-transparent"></div>
                </div>
            </motion.div>
        </section>
    );
}
