import { motion } from "framer-motion";
import { Section, GradientHeadline, RoadmapCard, StatusBadge, SecondaryButton } from "@/components/ds";
import { ArrowUpRight } from "lucide-react";

const HORIZONS = [
    {
        phase: "Horizon 01",
        status: "Live",
        title: "The Daily Check-in",
        body: "Six sliders, one honest sentence. AI co-regulation in-the-moment. 30-day growth arc.",
        accent: "cyan",
    },
    {
        phase: "Horizon 02",
        status: "In Beta",
        title: "Ambient Sensing",
        body: "Watch + phone signals fuse into a private emotional weather model. Nothing leaves the device without consent.",
        accent: "violet",
    },
    {
        phase: "Horizon 03",
        status: "Q3 2026",
        title: "Room-scale Presence",
        body: "Light, sound, and haptics respond to the room's emotional field. Regulation without ceremony.",
        accent: "magenta",
    },
];

export default function RoadmapV2() {
    return (
        <Section id="roadmap" size="lg">
            <div className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="max-w-2xl">
                    <StatusBadge tone="violet" className="mb-8">
                        Ecosystem Roadmap
                    </StatusBadge>
                    <GradientHeadline as="h2" size="lg">
                        Building the layer,
                        <br />
                        <span className="lg-gradient-text italic">horizon by horizon</span>.
                    </GradientHeadline>
                </div>
                <SecondaryButton
                    as="a"
                    href="/ecosystem"
                    data-testid="roadmap-full-cta"
                    size="md"
                    icon={<ArrowUpRight size={14} />}
                >
                    Full roadmap
                </SecondaryButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                {HORIZONS.map((h, i) => (
                    <motion.div
                        key={h.phase}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: i * 0.08 }}
                    >
                        <RoadmapCard {...h} />
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
