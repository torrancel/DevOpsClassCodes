import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Platform", href: "#modules" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Manifesto", href: "#manifesto" },
    { label: "Pricing", href: "#pricing" },
];

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            data-testid="main-navigation"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "backdrop-blur-xl bg-bg/70 border-b border-line/60"
                    : "bg-transparent"
            }`}
        >
            <nav className="px-6 md:px-12 lg:px-24 py-5 flex items-center justify-between">
                <a
                    href="#top"
                    data-testid="nav-brand"
                    className="flex items-center gap-2 group"
                >
                    <span className="relative inline-block w-3 h-3 rounded-full bg-forest">
                        <span className="absolute inset-0 rounded-full bg-forest animate-breath-slow"></span>
                    </span>
                    <span className="font-serif text-2xl tracking-tight text-ink">
                        Aura<span className="text-clay italic">.</span>OS
                    </span>
                </a>

                <ul className="hidden md:flex items-center gap-10">
                    {NAV_LINKS.map((l) => (
                        <li key={l.href}>
                            <a
                                href={l.href}
                                data-testid={`nav-link-${l.label.toLowerCase().replace(" ", "-")}`}
                                className="link-underline text-sm text-ink-soft hover:text-ink transition-colors"
                            >
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden md:flex items-center gap-4">
                    <a
                        href="#cta"
                        data-testid="nav-cta-button"
                        className="rounded-full bg-forest text-bg px-5 py-2.5 text-sm font-medium hover:bg-forest-deep transition-all active:scale-[0.98]"
                    >
                        Request Access
                    </a>
                </div>

                <button
                    data-testid="nav-mobile-toggle"
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-ink p-2"
                    aria-label="Menu"
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {open && (
                <div
                    data-testid="nav-mobile-menu"
                    className="md:hidden px-6 pb-6 bg-bg/95 backdrop-blur-xl border-b border-line/60"
                >
                    <ul className="flex flex-col gap-4 pt-4">
                        {NAV_LINKS.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="block text-ink text-base py-2"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a
                                href="#cta"
                                onClick={() => setOpen(false)}
                                className="inline-block mt-2 rounded-full bg-forest text-bg px-5 py-2.5 text-sm font-medium"
                            >
                                Request Access
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
