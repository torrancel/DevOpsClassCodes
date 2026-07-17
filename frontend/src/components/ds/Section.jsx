/**
 * Section — consistent container with premium spacing.
 * All landing sections should be wrapped in <Section>.
 *
 * Props:
 *  - id           → anchor id
 *  - tone         → "default" (matte black) | "elevated" (subtle wash)
 *  - size         → "sm" | "md" | "lg" (padding y)
 *  - noX          → drop horizontal padding (for edge-to-edge visuals)
 *  - as           → element tag (default section)
 */
export default function Section({
    id,
    tone = "default",
    size = "lg",
    noX = false,
    as: Tag = "section",
    className = "",
    children,
    ...rest
}) {
    const paddingY = {
        sm: "py-16 md:py-24",
        md: "py-24 md:py-32",
        lg: "py-28 md:py-44",
    }[size];

    const paddingX = noX ? "" : "px-6 md:px-12 lg:px-20";
    const toneClass = tone === "elevated"
        ? "bg-[rgba(255,255,255,0.015)]"
        : "";

    return (
        <Tag
            id={id}
            className={`relative ${paddingX} ${paddingY} ${toneClass} ${className}`}
            {...rest}
        >
            <div className="relative mx-auto max-w-[1400px]">
                {children}
            </div>
        </Tag>
    );
}
