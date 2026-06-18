import { useTranslation } from "react-i18next";

export default function Marquee() {
    const { t } = useTranslation();
    const ITEMS = [
        t("marquee.aware"),
        t("marquee.release"),
        t("marquee.grow"),
        t("marquee.transform"),
        t("marquee.firstOfKind"),
        t("marquee.builtForAIEra"),
    ];
    const track = [...ITEMS, ...ITEMS, ...ITEMS];
    return (
        <section
            data-testid="marquee-section"
            className="relative py-10 bg-bg-soft border-y border-white/5 overflow-hidden"
        >
            <div className="marquee-track flex whitespace-nowrap gap-16 will-change-transform">
                {track.map((label, i) => (
                    <div key={i} className="flex items-center gap-16 shrink-0">
                        <span className="font-display italic gradient-text text-2xl md:text-3xl tracking-[0.05em]">
                            {label}
                        </span>
                        <span className="text-violet">✦</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
