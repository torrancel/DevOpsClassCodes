import { ArrowUpRight } from "lucide-react";
import GlassCard from "./GlassCard";

/**
 * RoadmapCard — one horizon on a roadmap.
 *
 * Props:
 *  - phase       → e.g. "Horizon 01"
 *  - status      → "Live" | "In beta" | "Q2 2026" | ...
 *  - title       → card title
 *  - body        → short paragraph
 *  - href        → optional link (renders as anchor)
 *  - accent      → GlassCard accent
 */
export default function RoadmapCard({
    phase,
    status,
    title,
    body,
    href,
    accent = "violet",
    className = "",
}) {
    const inner = (
        <>
            <div className="flex items-center justify-between mb-8">
                <span className="lg-eyebrow text-lg-ink-muted">{phase}</span>
                {status && (
                    <span className="text-[10.5px] uppercase tracking-[0.24em] font-medium text-lg-ink-soft rounded-full px-3 py-1 border border-white/10 bg-white/[0.03]">
                        {status}
                    </span>
                )}
            </div>
            <h3 className="lg-h3 text-lg-ink mb-3">{title}</h3>
            <p className="text-[15px] leading-relaxed text-lg-ink-soft max-w-[36ch]">
                {body}
            </p>
            {href && (
                <div className="mt-8 inline-flex items-center gap-1.5 text-[13px] text-lg-ink-soft group-hover:text-lg-ink transition-colors">
                    <span className="lg-gradient-text font-medium">Explore</span>
                    <ArrowUpRight size={14} className="text-lg-ink-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
            )}
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                data-testid="roadmap-card"
                className={`group block ${className}`}
            >
                <GlassCard hover padding="lg" radius="lg" accent={accent} className="h-full">
                    {inner}
                </GlassCard>
            </a>
        );
    }

    return (
        <GlassCard
            data-testid="roadmap-card"
            padding="lg"
            radius="lg"
            accent={accent}
            className={`h-full ${className}`}
        >
            {inner}
        </GlassCard>
    );
}
