import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/ds";

/**
 * FooterV2 — brand block + link groups + dynamic copyright.
 * Compact grid on desktop, stacked on mobile.
 */

const LINKS = [
    { label: "Product", href: "#pillars" },
    { label: "Technology", href: "#experience" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "Founder", href: "#founder" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Contact", href: "mailto:hello@letitgo.ai" },
];

export default function FooterV2() {
    const year = new Date().getFullYear();

    return (
        <footer
            data-testid="footer-section"
            className="relative px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-10"
        >
            <div className="lg-hairline absolute top-0 left-0 right-0" />

            <div className="mx-auto max-w-[1400px]">
                {/* Brand + link row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16 md:mb-20">
                    <div className="md:col-span-5">
                        <BrandLogo size={34} showWordmark />
                        <p className="mt-6 text-[13px] uppercase tracking-[0.32em] lg-gradient-text font-medium">
                            Emotional Intelligence Ecosystem
                        </p>
                        <p
                            data-testid="footer-tagline"
                            className="mt-6 text-lg-ink text-xl md:text-2xl italic tracking-[-0.015em] font-normal max-w-md leading-snug"
                        >
                            One Ecosystem. Every Moment.{" "}
                            <span className="lg-gradient-text">Better You.</span>
                        </p>
                    </div>

                    <div className="md:col-span-7">
                        <p className="lg-eyebrow text-lg-ink-muted mb-6">
                            Explore
                        </p>
                        <ul
                            data-testid="footer-links"
                            className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4"
                        >
                            {LINKS.map((l) => {
                                const testId = `footer-link-${l.label
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`;
                                const isRoute = l.href.startsWith("/");
                                if (isRoute) {
                                    return (
                                        <li key={l.label}>
                                            <Link
                                                to={l.href}
                                                data-testid={testId}
                                                className="text-[15px] text-lg-ink-soft hover:text-lg-ink transition-colors inline-block"
                                            >
                                                {l.label}
                                            </Link>
                                        </li>
                                    );
                                }
                                return (
                                    <li key={l.label}>
                                        <a
                                            href={l.href}
                                            data-testid={testId}
                                            className="text-[15px] text-lg-ink-soft hover:text-lg-ink transition-colors inline-block"
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Mega brand mark */}
                <div className="relative pt-10 overflow-hidden">
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

                {/* Copyright + socials */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 text-xs text-lg-ink-muted">
                    <p data-testid="footer-copyright">
                        © {year} Let It Go AI · Emotional Intelligence Ecosystem.
                        All rights reserved.
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
