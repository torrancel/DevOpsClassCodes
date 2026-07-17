/**
 * GlassCard — refined glass panel primitive.
 *
 * Props:
 *  - as          → element tag
 *  - hover       → enable subtle lift + border brighten on hover
 *  - padding     → "sm" | "md" | "lg" | "none"
 *  - radius      → "md" | "lg" (large corners)
 *  - accent      → paints a soft gradient sheen at top-right ("cyan" | "violet" | "magenta" | null)
 *  - className   → extra classes
 */
const ACCENT_GRADIENTS = {
    cyan: "radial-gradient(circle at 85% 0%, rgba(33,212,253,0.22), transparent 55%)",
    violet: "radial-gradient(circle at 85% 0%, rgba(139,77,255,0.28), transparent 55%)",
    magenta: "radial-gradient(circle at 85% 0%, rgba(255,60,172,0.22), transparent 55%)",
    blue: "radial-gradient(circle at 85% 0%, rgba(53,107,255,0.24), transparent 55%)",
};

export default function GlassCard({
    as: Tag = "div",
    hover = false,
    padding = "md",
    radius = "md",
    accent = null,
    className = "",
    children,
    ...rest
}) {
    const pad = {
        none: "",
        sm: "p-5 md:p-6",
        md: "p-7 md:p-8",
        lg: "p-8 md:p-12",
    }[padding];

    const radClass = radius === "lg" ? "lg-panel-lg" : "";
    const hoverClass = hover ? "lg-panel-hover" : "";

    return (
        <Tag
            className={`lg-panel ${radClass} ${hoverClass} ${pad} relative overflow-hidden ${className}`}
            {...rest}
        >
            {accent && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: ACCENT_GRADIENTS[accent] || ACCENT_GRADIENTS.violet }}
                />
            )}
            <div className="relative">{children}</div>
        </Tag>
    );
}
