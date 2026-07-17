import GlassCard from "./GlassCard";

/**
 * FeatureCard — icon + title + body, for feature grids.
 *
 * Props:
 *  - icon       → JSX (Lucide icon usually)
 *  - eyebrow    → optional small label (e.g. "01")
 *  - title      → feature title
 *  - body       → feature description
 *  - accent     → GlassCard accent
 */
export default function FeatureCard({
    icon = null,
    eyebrow,
    title,
    body,
    accent = "violet",
    className = "",
}) {
    return (
        <GlassCard
            data-testid="feature-card"
            hover
            padding="lg"
            radius="lg"
            accent={accent}
            className={`h-full ${className}`}
        >
            <div className="flex items-start justify-between mb-10">
                {icon && (
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        {icon}
                    </div>
                )}
                {eyebrow && (
                    <span className="lg-eyebrow text-lg-ink-muted">
                        {eyebrow}
                    </span>
                )}
            </div>
            <h3 className="lg-h3 text-lg-ink mb-3">{title}</h3>
            <p className="text-[15px] leading-relaxed text-lg-ink-soft max-w-[38ch]">
                {body}
            </p>
        </GlassCard>
    );
}
