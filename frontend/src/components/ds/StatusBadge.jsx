/**
 * StatusBadge — pill with pulsing dot + eyebrow text.
 * Used for "Now in private beta", "Founding cohort open", etc.
 *
 * Props:
 *  - tone       → "cyan" (default) | "violet" | "magenta"
 *  - children   → label
 */
const TONE = {
    cyan:   { dot: "#21D4FD", ring: "rgba(33,212,253,0.35)" },
    violet: { dot: "#8B4DFF", ring: "rgba(139,77,255,0.35)" },
    magenta:{ dot: "#FF3CAC", ring: "rgba(255,60,172,0.35)" },
};

export default function StatusBadge({
    tone = "cyan",
    className = "",
    children,
    ...rest
}) {
    const c = TONE[tone] || TONE.cyan;
    return (
        <span
            data-testid="status-badge"
            className={`inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[10.5px] uppercase font-medium tracking-[0.28em] text-lg-ink-soft bg-white/[0.04] border border-white/10 backdrop-blur ${className}`}
            {...rest}
        >
            <span
                aria-hidden="true"
                className="relative inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: c.dot, boxShadow: `0 0 12px ${c.ring}` }}
            />
            {children}
        </span>
    );
}
