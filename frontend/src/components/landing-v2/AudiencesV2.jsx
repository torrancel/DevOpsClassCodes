import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const AUDIENCES = [
    {
        key: "kids",
        label: "Kids & Families",
        body:
            "Big feelings become tiny practices. Age-tuned prompts, guardian-safe telemetry, and one shared moment a day.",
        icon: <Users size={20} className="text-lg-cyan" />,
        accent: "cyan",
    },
    {
        key: "individual",
        label: "Individuals",
        body:
            "Your quiet operating system for feelings. Sense the moment, release the weight, grow the pattern.",
        icon: <User size={20} className="text-lg-blue" />,
        accent: "blue",
    },
    {
        key: "team",
        label: "Teams",
        body:
            "Team emotional weather in one glance. Aggregate never identifies — protects mental privacy while surfacing risk.",
        icon: <Building2 size={20} className="text-lg-violet" />,
        accent: "violet",
    },
    {
        key: "professional",
        label: "Professionals",
        body:
            "Between clients, between rounds, between arguments — micro-resets tuned to your specialty.",
        icon: <Briefcase size={20} className="text-lg-magenta" />,
        accent: "magenta",
    },
];

const SPECIALISTS = [
    { slug: "doctors", label: "Doctors", icon: Stethoscope },
    { slug: "attorneys", label: "Attorneys", icon: Scale },
    { slug: "teachers", label: "Teachers", icon: GraduationCap },
    { slug: "managers", label: "Managers", icon: Briefcase },
];

export default function AudiencesV2() {
    const navigate = useNavigate();

    return (
        <Section id="audiences" size="lg">
            <div className="mb-16 md:mb-20 max-w-3xl">
                <StatusBadge tone="magenta" className="mb-8">
                    Built for humans, everywhere
                </StatusBadge>
                <GradientHeadline as="h2" size="lg">
                    Same ecosystem.
                    <br />
                    <span className="lg-gradient-text italic">Different</span> {" "}
                    interior seasons.
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
                    Specialist Modes
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
                                            {s.label}
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
