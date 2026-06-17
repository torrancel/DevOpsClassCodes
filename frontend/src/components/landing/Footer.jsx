const COLS = [
    {
        title: "Platform",
        links: ["Sensing", "Coaching", "Mediation", "Memory", "Agent SDK"],
    },
    {
        title: "Company",
        links: ["Manifesto", "Research", "Careers", "Press", "Contact"],
    },
    {
        title: "Legal",
        links: ["Privacy", "Security", "Terms", "Data Ethics", "Consent Charter"],
    },
];

export default function Footer() {
    return (
        <footer
            data-testid="footer-section"
            className="px-6 md:px-12 lg:px-24 pt-24 md:pt-32 pb-12 border-t border-line"
        >
            <div className="grid grid-cols-12 gap-8 mb-20">
                <div className="col-span-12 md:col-span-5">
                    <div className="flex items-center gap-3">
                        <span className="relative inline-block w-3 h-3 rounded-full bg-forest">
                            <span className="absolute inset-0 rounded-full bg-forest animate-breath-slow"></span>
                        </span>
                        <span className="font-serif text-2xl tracking-tight text-ink">
                            Aura<span className="text-clay italic">.</span>OS
                        </span>
                    </div>
                    <p className="mt-6 text-lg text-ink-soft max-w-md font-serif italic">
                        An instrument for the inner life. Built quietly in the woods,
                        for the noisy decade ahead.
                    </p>
                </div>

                {COLS.map((c) => (
                    <div key={c.title} className="col-span-6 md:col-span-2">
                        <p className="text-xs uppercase tracking-[0.25em] text-forest mb-4">
                            {c.title}
                        </p>
                        <ul className="space-y-3">
                            {c.links.map((l) => (
                                <li key={l}>
                                    <a
                                        href="#"
                                        data-testid={`footer-link-${l.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="link-underline text-sm text-ink-soft hover:text-ink"
                                    >
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="col-span-12 md:col-span-1"></div>
            </div>

            {/* Massive brand */}
            <div className="border-t border-line pt-10 mb-10">
                <h3
                    aria-hidden="true"
                    className="font-serif italic text-[clamp(4rem,18vw,18rem)] leading-none tracking-tight text-forest/80 select-none"
                >
                    aura.os
                </h3>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-ink-soft">
                <p>© {new Date().getFullYear()} Aura Labs · Made with quiet attention.</p>
                <div className="flex items-center gap-6">
                    <a href="#" className="link-underline">Twitter</a>
                    <a href="#" className="link-underline">LinkedIn</a>
                    <a href="#" className="link-underline">Substack</a>
                </div>
            </div>
        </footer>
    );
}
