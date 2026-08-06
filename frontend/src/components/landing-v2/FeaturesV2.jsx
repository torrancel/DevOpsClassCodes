import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Brain, Heart, Leaf, Sparkles } from "lucide-react";
import { Section, GradientHeadline, FeatureCard, StatusBadge } from "@/components/ds";

export default function FeaturesV2() {
    const { t } = useTranslation();
    const PILLARS = [
        {
            icon: <Brain size={22} strokeWidth={1.5} className="text-lg-cyan" />,
            eyebrow: "01",
            title: t("v2Landing.features.p1t"),
            body: t("v2Landing.features.p1b"),
            accent: "cyan",
        },
        {
            icon: <Heart size={22} strokeWidth={1.5} className="text-lg-magenta" />,
            eyebrow: "02",
            title: t("v2Landing.features.p2t"),
            body: t("v2Landing.features.p2b"),
            accent: "magenta",
        },
        {
            icon: <Leaf size={22} strokeWidth={1.5} className="text-lg-violet" />,
            eyebrow: "03",
            title: t("v2Landing.features.p3t"),
            body: t("v2Landing.features.p3b"),
            accent: "violet",
        },
        {
            icon: <Sparkles size={22} strokeWidth={1.5} className="text-lg-blue" />,
            eyebrow: "04",
            title: t("v2Landing.features.p4t"),
            body: t("v2Landing.features.p4b"),
            accent: "blue",
        },
    ];
    return (
        <Section id="pillars" size="lg">
            <div className="mb-16 md:mb-20 max-w-3xl">
                <StatusBadge tone="violet" className="mb-8">
                    {t("v2Landing.features.eyebrow")}
                </StatusBadge>
                <GradientHeadline as="h2" size="lg">
                    {t("v2Landing.features.headlinePre")}
                    <br />
                    <span className="lg-gradient-text italic">{t("v2Landing.features.headlineGradient")}</span>{t("v2Landing.features.headlinePost")}
                </GradientHeadline>
                <p className="mt-8 text-lg text-lg-ink-soft max-w-2xl leading-relaxed">
                    {t("v2Landing.features.sub")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {PILLARS.map((p, i) => (
                    <motion.div
                        key={p.title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: i * 0.08 }}
                        data-testid={`feature-${p.title.toLowerCase()}`}
                    >
                        <FeatureCard {...p} />
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
