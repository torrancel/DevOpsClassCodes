import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    Users,
    User,
    Building2,
    Briefcase,
    Stethoscope,
    Scale,
    GraduationCap,
    ArrowUpRight,
} from "lucide-react";
import { Section, GradientHeadline, GlassCard, StatusBadge } from "@/components/ds";

const SPECIALISTS = [
    { slug: "doctors", i18n: "doctors", icon: Stethoscope },
    { slug: "attorneys", i18n: "attorneys", icon: Scale },
    { slug: "teachers", i18n: "teachers", icon: GraduationCap },
    { slug: "managers", i18n: "managers", icon: Briefcase },
];

export default function AudiencesV2() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const AUDIENCES = [
        {
            key: "kids",
            label: t("v2Landing.audiences.kidsLabel"),
            body: t("v2Landing.audiences.kidsBody"),
            icon: <Users size={20} className="text-lg-cyan" />,
            accent: "cyan",
        },
        {
            key: "individual",
            label: t("v2Landing.audiences.individualLabel"),
            body: t("v2Landing.audiences.individualBody"),
            icon: <User size={20} className="text-lg-blue" />,
            accent: "blue",
        },
        {
            key: "team",
            label: t("v2Landing.audiences.teamLabel"),
            body: t("v2Landing.audiences.teamBody"),
            icon: <Building2 size={20} className="text-lg-violet" />,
            accent: "violet",
        },
        {
            key: "professional",
            label: t("v2Landing.audiences.professionalLabel"),
            body: t("v2Landing.audiences.professionalBody"),
            icon: <Briefcase size={20} className="text-lg-magenta" />,
            accent: "magenta",
        },
    ];

    return (
        <Section id="audiences" size="lg">
            <div className="mb-16 md:mb-20 max-w-3xl">
                <StatusBadge tone="magenta" className="mb-8">
                    {t("v2Landing.audiences.eyebrow")}
                </StatusBadge>
                <GradientHeadline as="h2" size="lg">
                    {t("v2Landing.audiences.headlinePre")}
                    <br />
                    <span className="lg-gradient-text italic">{t("v2Landing.audiences.headlineGradient")}</span> {t("v2Landing.audiences.headlinePost")}
                </GradientHeadline>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {AUDIENCES.map((a, i) => (
                    <motion.div
                        key={a.key}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: i * 0.06 }}
                    >
                        <GlassCard
                            hover
                            padding="lg"
                            radius="lg"
                            accent={a.accent}
                            data-testid={`audience-${a.key}`}
                            className="h-full"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div
                                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                    }}
                                >
                                    {a.icon}
                                </div>
                                <span className="lg-eyebrow text-lg-ink-muted">
                                    0{i + 1}
                                </span>
                            </div>
                            <h3 className="lg-h3 text-lg-ink mb-3">{a.label}</h3>
                            <p className="text-[15px] leading-relaxed text-lg-ink-soft max-w-[40ch]">
                                {a.body}
                            </p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Specialist strip */}
            <div className="mt-16 md:mt-20">
                <p className="lg-eyebrow text-lg-ink-muted mb-6">
                    {t("v2Landing.audiences.specialistLabel")}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {SPECIALISTS.map((s) => {
                        const Icon = s.icon;
                        return (
                            <button
                                type="button"
                                key={s.slug}
                                onClick={() => navigate(`/${s.slug}`)}
                                data-testid={`professional-${s.slug}`}
                                className="group text-left"
                            >
                                <GlassCard
                                    hover
                                    padding="sm"
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            size={17}
                                            className="text-lg-ink-soft group-hover:text-lg-ink transition-colors"
                                            strokeWidth={1.5}
                                        />
                                        <span className="text-[14px] font-medium text-lg-ink tracking-[-0.005em]">
                                            {t(`v2Landing.audiences.${s.i18n}`)}
                                        </span>
                                    </div>
                                    <ArrowUpRight
                                        size={13}
                                        className="text-lg-ink-muted group-hover:text-lg-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                                    />
                                </GlassCard>
                            </button>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
}
