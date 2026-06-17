const ITEMS = [
    "TRUSTED BY PIONEERS",
    "INTEGRATES WITH YOUR TEAMS",
    "MEDIATES CONFLICTS",
    "CALMS NERVOUS SYSTEMS",
    "BUILT FOR THE AI ERA",
    "FIRST OF ITS KIND",
];

export default function Marquee() {
    const track = [...ITEMS, ...ITEMS];
    return (
        <section
            data-testid="marquee-section"
            className="relative py-10 bg-bg-soft border-y border-line overflow-hidden"
        >
            <div className="marquee-track flex whitespace-nowrap gap-16 will-change-transform">
                {track.map((t, i) => (
                    <div key={i} className="flex items-center gap-16 shrink-0">
                        <span className="font-serif italic text-forest text-2xl md:text-3xl tracking-[0.05em]">
                            {t}
                        </span>
                        <span className="text-clay">✦</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
