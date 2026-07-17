/**
 * BrandLogo — single source of truth for Let It Go AI brand mark.
 *
 * Props:
 *  - size          → pixel size of the mark (default 32)
 *  - showWordmark  → renders "LET IT GO AI / EMOTIONAL INTELLIGENCE ECOSYSTEM"
 *  - variant       → "compact" (nav) | "stacked" (footer) — only used when showWordmark
 *  - className     → extra classes for outer wrapper
 */
export const LOGO_URL =
    "https://customer-assets.emergentagent.com/job_page-launch-106/artifacts/s6pvfpc6_Ecosystem%20Roadmap%20%202.PNG";

export default function BrandLogo({
    size = 32,
    showWordmark = false,
    variant = "compact",
    className = "",
}) {
    if (!showWordmark) {
        return (
            <img
                src={LOGO_URL}
                alt="Let It Go AI"
                width={size}
                height={size}
                data-testid="brand-logo"
                className={`inline-block object-contain ${className}`}
                style={{
                    width: size,
                    height: size,
                    filter: "drop-shadow(0 0 24px rgba(139,77,255,0.35))",
                }}
                loading="eager"
                decoding="async"
            />
        );
    }

    return (
        <a
            href="/"
            data-testid="brand-logo"
            aria-label="Let It Go AI — Emotional Intelligence Ecosystem"
            className={`inline-flex items-center gap-3 group ${className}`}
        >
            <img
                src={LOGO_URL}
                alt=""
                width={size}
                height={size}
                className="object-contain"
                style={{
                    width: size,
                    height: size,
                    filter: "drop-shadow(0 0 20px rgba(139,77,255,0.35))",
                }}
                loading="eager"
                decoding="async"
            />
            <span className="flex flex-col leading-none min-w-0">
                <span
                    className="text-[15px] md:text-base font-semibold tracking-[0.02em] text-lg-ink whitespace-nowrap"
                    style={{ letterSpacing: "0.06em" }}
                >
                    LET IT GO <span className="lg-gradient-text">AI</span>
                </span>
                <span
                    className="text-[9px] md:text-[10px] tracking-[0.22em] text-lg-ink-muted uppercase mt-1 whitespace-nowrap hidden sm:inline-block"
                >
                    Emotional Intelligence Ecosystem
                </span>
            </span>
        </a>
    );
}
