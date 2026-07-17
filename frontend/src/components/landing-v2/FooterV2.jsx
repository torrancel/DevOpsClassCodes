import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/ds";

const COLS = [
    {
        title: "Ecosystem",
        links: [
            { label: "Pillars", href: "#pillars" },
            { label: "Experience", href: "#experience" },
            { label: "Audiences", href: "#audiences" },
            { label: "Roadmap", to: "/ecosystem" },
            { label: "Pricing", href: "#pricing" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Founder Story", to: "/founder" },
            { label: "Beta Program", to: "/beta" },
            { label: "Manifesto", href: "#cta" },
            { label: "Contact", href: "mailto:founders@letitgo.ai" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
            { label: "Security", href: "#" },
        ],
    },
];

export default function FooterV2() {
    return (
        <footer
            data-testid="footer-section"
            className="relative px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-12"
        >
            <div className="lg-hairline absolute top-0 left-0 right-0" />

            <div className="mx-auto max-w-[1400px]">
                <div className="grid grid-cols-12 gap-8 mb-20">
                    <div className="col-span-12 md:col-span-5">
                        <BrandLogo size={32} showWordmark />
                        <p className="mt-8 text-lg text-lg-ink-soft max-w-md leading-relaxed">
                            One ecosystem. Every moment.{" "}
                            <span className="lg-gradient-text italic">
                                Better you.
                            </span>
                        </p>
                    </div>

                    {COLS.map((c) => (
                        <div key={c.title} className="col-span-6 md:col-span-2">
                            <p className="lg-eyebrow lg-gradient-text mb-5">
                                {c.title}
                            </p>
                            <ul className="space-y-3.5">
                                {c.links.map((l) => {
                                    const testId = `footer-link-${l.label
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`;
                                    return (
                                        <li key={l.label}>
                                            {l.to ? (
                                                <Link
                                                    to={l.to}
                                                    data-testid={testId}
                                                    className="text-[14px] text-lg-ink-soft hover:text-lg-ink transition-colors"
                                                >
                                                    {l.label}
                                                </Link>
                                            ) : (
                                                <a
                                                    href={l.href}
                                                    data-testid={testId}
                                                    className="text-[14px] text-lg-ink-soft hover:text-lg-ink transition-colors"
                                                >
                                                    {l.label}
                                                </a>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}

                    <div className="col-span-12 md:col-span-1"></div>
                </div>

                {/* Massive brand mark */}
                <div className="relative pt-12 overflow-hidden">
                    <div className="lg-hairline absolute top-0 left-0 right-0" />
                    <h3
                        aria-hidden="true"
                        className="text-[clamp(4rem,17vw,17rem)] leading-none tracking-[-0.055em] font-semibold select-none text-transparent bg-clip-text"
                        style={{
                            backgroundImage:
                                "linear-gradient(180deg, rgba(247,247,250,0.14) 0%, rgba(247,247,250,0.02) 90%)",
                        }}
                    >
                        let it go.
                    </h3>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 text-xs text-lg-ink-muted">
                    <p>
                        © {new Date().getFullYear()} Let It Go AI · Emotional
                        Intelligence Ecosystem. All rights, and all feelings, reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a
                            href="#"
                            className="hover:text-lg-ink transition-colors"
                        >
                            Twitter
                        </a>
                        <a
                            href="#"
                            className="hover:text-lg-ink transition-colors"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="#"
                            className="hover:text-lg-ink transition-colors"
                        >
                            Substack
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
