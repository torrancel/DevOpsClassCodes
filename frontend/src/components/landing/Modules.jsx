import { Brain, Heart, Leaf, CircleDot } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const dotColor = {
    blue: "bg-blue",
    pink: "bg-pink",
    violet: "bg-violet",
    orange: "bg-orange",
};

export default function Modules() {
    const { t } = useTranslation();
    const PILLARS = [
        { icon: Brain, key: "aware", sub: "01", color: "blue", gradient: "from-blue/30 to-blue/0" },
        { icon: Heart, key: "release", sub: "02", color: "pink", gradient: "from-pink/30 to-pink/0" },
        { icon: Leaf, key: "grow", sub: "03", color: "violet", gradient: "from-violet/30 to-violet/0" },
        { icon: CircleDot, key: "transform", sub: "04", color: "orange", gradient: "from-orange/30 to-orange/0" },
    ];
    return (
        <section
            id="pillars"
            data-testid="modules-section"
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40"
        >
            <div className="mb-16 md:mb-24 max-w-4xl">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                    {t("modules.eyebrow")}
                </p>
                <h2
                    data-testid="modules-headline"
                    className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink"
                >
                    {t("modules.headlinePre")}
                    <br />
                    <em className="gradient-text">{t("modules.headlineGradient")}</em>{t("modules.headlinePost")}
                </h2>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {PILLARS.map((p, i) => {
                    const Icon = p.icon;
                    return (
                        <motion.div
                            key={p.key}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.08 }}
                            data-testid={`module-card-${i}`}
                            className="col-span-12 md:col-span-6 relative gradient-border p-8 md:p-10 overflow-hidden group transition-transform duration-500 hover:-translate-y-1"
                        >
                            <div
                                className={`absolute -top-32 -right-32 w-72 h-72 rounded-full bg-gradient-to-br ${p.gradient} blur-3xl opacity-70 pointer-events-none`}
                            ></div>

                            <div className="relative flex items-start justify-between mb-10">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/10">
                                    <Icon
                                        size={22}
                                        strokeWidth={1.5}
                                        className={
                                            p.color === "blue" ? "text-blue" :
                                            p.color === "pink" ? "text-pink" :
                                            p.color === "violet" ? "text-violet" :
                                            "text-orange"
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${dotColor[p.color]}`}></span>
                                    <span className="text-xs tracking-[0.3em] text-ink-soft">{p.sub}</span>
                                </div>
                            </div>

                            <h3 className="relative font-display text-4xl md:text-5xl tracking-tight mb-4 text-ink">
                                {t(`modules.${p.key}.title`)}
                            </h3>
                            <p className="relative text-base md:text-lg leading-relaxed max-w-xl text-ink-soft">
                                {t(`modules.${p.key}.text`)}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
