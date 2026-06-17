import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import InfinityGlow from "./InfinityGlow";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navigation() {
    const { t } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const links = [
        { key: "pillars", label: t("nav.pillars"), href: "#pillars" },
        { key: "experience", label: t("nav.experience"), href: "#experience" },
        { key: "wearable", label: t("nav.wearable"), href: "#wearable" },
        { key: "pricing", label: t("nav.pricing"), href: "#pricing" },
    ];

    return (
        <header
            data-testid="main-navigation"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "backdrop-blur-xl bg-bg/70 border-b border-white/5"
                    : "bg-transparent"
            }`}
        >
            <nav className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
                <a href="#top" data-testid="nav-brand" className="flex items-center gap-3 group">
                    <InfinityGlow size={36} />
                    <span className="font-display text-2xl tracking-tight text-ink">
                        Let It Go <span className="gradient-text font-sans text-base font-medium align-top">AI</span>
                    </span>
                </a>

                <ul className="hidden md:flex items-center gap-10">
                    {links.map((l) => (
                        <li key={l.key}>
                            <a
                                href={l.href}
                                data-testid={`nav-link-${l.key}`}
                                className="link-underline text-sm text-ink-soft hover:text-ink transition-colors"
                            >
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden md:flex items-center gap-3">
                    <LanguageSwitcher />
                    <a
                        href="#cta"
                        data-testid="nav-cta-button"
                        className="btn-glow rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-5 py-2.5 text-sm font-medium hover:opacity-95 transition-all active:scale-[0.98]"
                    >
                        {t("nav.cta")}
                    </a>
                </div>

                <div className="md:hidden flex items-center gap-2">
                    <LanguageSwitcher />
                    <button
                        data-testid="nav-mobile-toggle"
                        onClick={() => setOpen(!open)}
                        className="text-ink p-2"
                        aria-label="Menu"
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {open && (
                <div
                    data-testid="nav-mobile-menu"
                    className="md:hidden px-6 pb-6 bg-bg/95 backdrop-blur-xl border-b border-white/5"
                >
                    <ul className="flex flex-col gap-4 pt-4">
                        {links.map((l) => (
                            <li key={l.key}>
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
                                className="inline-block mt-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-5 py-2.5 text-sm font-medium"
                            >
                                {t("nav.cta")}
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
