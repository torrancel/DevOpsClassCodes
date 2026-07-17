/**
 * DeviceFrame — premium phone-style mock frame with ambient glow.
 * Renders a rounded, glass bezel around any children (screen content).
 *
 * Props:
 *  - variant   → "phone" (default, 9:19.5) | "tablet" (4:3)
 *  - glow      → boolean, softly emits color under the device
 *  - className → extra classes
 */
export default function DeviceFrame({
    variant = "phone",
    glow = true,
    className = "",
    children,
}) {
    const aspect = variant === "tablet" ? "aspect-[4/3]" : "aspect-[9/19]";
    const maxW = variant === "tablet" ? "max-w-[560px]" : "max-w-[320px]";

    return (
        <div
            data-testid="device-frame"
            className={`relative mx-auto ${maxW} ${className}`}
        >
            {glow && (
                <div
                    aria-hidden="true"
                    className="absolute -inset-16 -z-10 blur-3xl opacity-70"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 55%, rgba(139,77,255,0.5) 0%, rgba(53,107,255,0.25) 30%, transparent 70%)",
                    }}
                />
            )}
            <div
                className={`${aspect} rounded-[42px] p-[3px] lg-float`}
                style={{
                    background:
                        "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.14) 100%)",
                    boxShadow:
                        "0 40px 100px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
            >
                <div
                    className="w-full h-full rounded-[38px] relative overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(180deg, #0A0A12 0%, #060609 100%)",
                    }}
                >
                    {/* Notch */}
                    {variant === "phone" && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-24 rounded-full bg-black/80 z-10"></div>
                    )}
                    <div className="relative w-full h-full">{children}</div>
                </div>
            </div>
        </div>
    );
}
