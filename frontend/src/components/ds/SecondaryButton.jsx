import { forwardRef } from "react";

/**
 * SecondaryButton — subtle glass CTA. Same API surface as PrimaryButton.
 */
const SIZE = {
    sm: "px-5 py-2.5 text-[13px]",
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-4 text-[15px]",
};

const SecondaryButton = forwardRef(function SecondaryButton(
    {
        as: Tag = "button",
        size = "md",
        icon,
        className = "",
        children,
        ...rest
    },
    ref,
) {
    return (
        <Tag
            ref={ref}
            className={`lg-btn-secondary group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] ${SIZE[size]} ${className}`}
            {...rest}
        >
            {children}
            {icon && (
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    {icon}
                </span>
            )}
        </Tag>
    );
});

export default SecondaryButton;
