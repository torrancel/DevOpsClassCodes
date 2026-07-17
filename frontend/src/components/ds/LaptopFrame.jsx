/**
 * LaptopFrame — cinematic browser/laptop window frame.
 * Displays child content inside a premium browser chrome with soft depth.
 *
 * Props:
 *  - url          → address bar text (default "letitgo.ai/app")
 *  - glow         → soft ambient glow under the frame (default true)
 *  - float        → subtle float animation (respects prefers-reduced-motion)
 *  - className    → extra classes on outer wrapper
 */
export default function LaptopFrame({
    url = "letitgo.ai/app",
    glow = true,
    float = true,
    className = "",
    children,
}) {
    return (
        <div
            data-testid="laptop-frame"
            className={`relative w-full ${className}`}
        >
            {glow && (
                <div
                    aria-hidden="true"
                    className="absolute -inset-x-8 -inset-y-6 -z-10 blur-3xl opacity-70 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle at 50% 60%, rgba(139,77,255,0.42) 0%, rgba(53,107,255,0.22) 35%, transparent 72%)",
                    }}
                />
            )}

            <div
                className={`aspect-[16/10] rounded-2xl p-[2px] ${float ? "lg-float" : ""}`}
                style={{
                    background:
                        "linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.16) 100%)",
                    boxShadow:
                        "0 60px 140px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.16)",
                }}
            >
                <div
                    className="w-full h-full rounded-[14px] relative overflow-hidden flex flex-col"
                    style={{
                        background:
                            "linear-gradient(180deg, #0A0A12 0%, #060609 100%)",
                    }}
                >
                    {/* Chrome */}
                    <div
                        className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] shrink-0"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                        }}
                    >
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]/70" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="max-w-[280px] w-full rounded-full bg-white/[0.04] border border-white/[0.06] px-3 py-1 text-center">
                                <span className="text-[10px] text-lg-ink-muted tracking-tight">
                                    {url}
                                </span>
                            </div>
                        </div>
                        <div className="w-14" aria-hidden="true" />
                    </div>

                    {/* Content */}
                    <div className="relative flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
