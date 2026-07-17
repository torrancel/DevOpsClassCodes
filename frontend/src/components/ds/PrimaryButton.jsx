import { ArrowUpRight } from "lucide-react";
import { forwardRef } from "react";

/**
 * PrimaryButton — flagship CTA button with cyan→blue→violet→magenta gradient.
 *
 * Props:
 *  - as          → element tag ("button" default, or "a")
 *  - size        → "sm" | "md" | "lg"
 *  - icon        → JSX icon (default: ArrowUpRight); pass false to hide
 *  - loading     → boolean, disables + shows label
 *  - loadingText → text when loading
 */
const SIZE = {
    sm: "px-5 py-2.5 text-[13px]",
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-4 text-[15px]",
};

const PrimaryButton = forwardRef(function PrimaryButton(
    {
        as: Tag = "button",
        size = "md",
        icon,
        loading = false,
        loadingText = "Loading…",
        disabled,
        className = "",
        children,
        ...rest
    },
    ref,
) {
    const Icon = icon === undefined ? ArrowUpRight : icon;
    return (
        <Tag
            ref={ref}
            disabled={disabled || loading}
            className={`lg-btn-primary group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] disabled:opacity-60 disabled:cursor-not-allowed ${SIZE[size]} ${className}`}
            {...rest}
        >
            {loading ? loadingText : children}
            {!loading && Icon && (
                <Icon
                    size={size === "lg" ? 17 : 15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            )}
        </Tag>
    );
});

export default PrimaryButton;
