import { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/landing/LanguageSwitcher";
import { BrandLogo, PrimaryButton } from "@/components/ds";

const INVESTOR_MAILTO = "mailto:founders@letitgo.ai?subject=Investor%20Inquiry";

const LINKS = [
    { key: "product", label: "Product", href: "#pillars" },
    { key: "technology", label: "Technology", href: "#experience" },
    { key: "roadmap", label: "Roadmap", href: "#roadmap" },
    { key: "founder", label: "Founder", href: "/founder" },
    { key: "investors", label: "Investors", href: INVESTOR_MAILTO },
];

export default function NavigationV2() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on Escape or on navigation
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        // lock body scroll while menu is open
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);

    const closeMenu = useCallback(() => setOpen(false), []);

    return (
        <header
            data-testid="main-navigation"
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
                scrolled
                    ? "backdrop-blur-2xl bg-[rgba(5,5,7,0.72)] border-b border-white/[0.06]"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <nav
                aria-label="Primary"
                className="px-6 md:px-10 lg:px-14 py-4 md:py-5 flex items-center justify-between max-w-[1400px] mx-auto"
            >
                <BrandLogo size={30} showWordmark data-testid="nav-brand" />

                {/* Center links */}
                <ul className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
                    {LINKS.map((l) => (
                        <li key={l.key}>
                            <a
                                href={l.href}
                                data-testid={`nav-link-${l.key}`}
                                className="lg-nav-link text-[13.5px] text-lg-ink-soft hover:text-lg-ink transition-colors font-medium tracking-[-0.005em]"
                            >
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Right side */}
                <div className="hidden lg:flex items-center gap-3">
                    <LanguageSwitcher />
                    <PrimaryButton
                        as="a"
                        href="#cta"
                        data-testid="nav-cta-button"
                        size="sm"
                        icon={null}
                    >
                        Request Early Access
                    </PrimaryButton>
                </div>

                {/* Mobile toggle */}
                <div className="lg:hidden flex items-center gap-2">
                    <LanguageSwitcher />
                    <button
                        type="button"
                        data-testid="nav-mobile-toggle"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls="lg-mobile-menu"
                        aria-label={open ? "Close menu" : "Open menu"}
                        className="text-lg-ink p-2 rounded-md"
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {open && (
                <div
                    id="lg-mobile-menu"
                    data-testid="nav-mobile-menu"
                    role="dialog"
                    aria-modal="true"
                    className="lg:hidden px-6 pb-6 bg-[rgba(5,5,7,0.96)] backdrop-blur-2xl border-b border-white/[0.06]"
                >
                    <ul className="flex flex-col gap-1 pt-4">
                        {LINKS.map((l) => (
                            <li key={l.key}>
                                <a
                                    href={l.href}
                                    onClick={closeMenu}
                                    data-testid={`nav-mobile-link-${l.key}`}
                                    className="block text-lg-ink text-base py-3 border-b border-white/[0.04]"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                        <li className="pt-4">
                            <PrimaryButton
                                as="a"
                                href="#cta"
                                onClick={closeMenu}
                                className="w-full"
                                data-testid="nav-mobile-cta"
                                icon={null}
                            >
                                Request Early Access
                            </PrimaryButton>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
