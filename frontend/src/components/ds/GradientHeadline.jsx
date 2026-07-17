/**
 * GradientHeadline — a display heading with a gradient accent word/phrase.
 *
 * Props:
 *  - as         → h1 | h2 | h3 (default h2)
 *  - size       → "hero" | "xl" | "lg" | "md"
 *  - accent     → JSX rendered with lg-gradient-text (the highlighted word)
 *  - children   → the surrounding text
 *  - className  → extra classes
 *  - align      → "left" | "center"
 */
export default function GradientHeadline({
    as: Tag = "h2",
    size = "lg",
    accent = null,
    align = "left",
    className = "",
    children,
    ...rest
}) {
    const sizeClass = {
        hero: "lg-h1",
        xl: "text-5xl md:text-7xl leading-[1.02] tracking-[-0.04em] font-semibold",
        lg: "lg-h2",
        md: "text-3xl md:text-5xl leading-[1.05] tracking-[-0.03em] font-semibold",
    }[size];

    const alignClass = align === "center" ? "text-center" : "";

    return (
        <Tag
            className={`text-lg-ink ${sizeClass} ${alignClass} ${className}`}
            {...rest}
        >
            {children}
            {accent && <span className="lg-gradient-text"> {accent}</span>}
        </Tag>
    );
}
