import { motion } from "framer-motion";
import { Brain, Heart, Leaf, Sparkles } from "lucide-react";
import { Section, GradientHeadline, FeatureCard, StatusBadge } from "@/components/ds";

const PILLARS = [
    {
        icon: <Brain size={22} strokeWidth={1.5} className="text-lg-cyan" />,
        eyebrow: "01",
        title: "Aware",
        body:
            "Sub-verbal signals — tone, cadence, physiology — become gentle mirrors. You feel what you feel, sooner.",
        accent: "cyan",
    },
    {
        icon: <Heart size={22} strokeWidth={1.5} className="text-lg-magenta" />,
        eyebrow: "02",
        title: "Release",
        body:
            "Breath, sound, movement, or a single spoken sentence. In-the-moment co-regulation, personalised.",
        accent: "magenta",
    },
    {
        icon: <Leaf size={22} strokeWidth={1.5} className="text-lg-violet" />,
        eyebrow: "03",
        title: "Grow",
        body:
            "Patterns become insight. Weekly EQ trend, triggers made legible, tiny practices that compound.",
        accent: "violet",
    },
    {
        icon: <Sparkles size={22} strokeWidth={1.5} className="text-lg-blue" />,
        eyebrow: "04",
        title: "Transform",
        body:
            "Ambient presence across your day — watch, phone, room. Regulation without ceremony.",
        accent: "blue",
    },
];

export default function FeaturesV2() {
    return (
        <Section id="pillars" size="lg">
            <div className="mb-16 md:mb-20 max-w-3xl">
                <StatusBadge tone="violet" className="mb-8">
                    Four Pillars
                </StatusBadge>
                <GradientHeadline as="h2" size="lg">
                    An operating layer for
                    <br />
                    <span className="lg-gradient-text italic">feelings</span>, not features.
                </GradientHeadline>
                <p className="mt-8 text-lg text-lg-ink-soft max-w-2xl leading-relaxed">
                    Every module works in the background — sensing, releasing, growing,
                    transforming — so the moment finds you before the moment overwhelms you.
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
