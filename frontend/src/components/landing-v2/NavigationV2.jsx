import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/landing/LanguageSwitcher";
import { BrandLogo, PrimaryButton, SecondaryButton } from "@/components/ds";

const LINKS = [
    { key: "pillars", label: "Pillars", href: "#pillars" },
    { key: "experience", label: "Experience", href: "#experience" },
    { key: "audiences", label: "Audiences", href: "#audiences" },
    { key: "ecosystem", label: "Roadmap", href: "/ecosystem" },
    { key: "pricing", label: "Pricing", href: "#pricing" },
];

export default function NavigationV2() {
    const { user, login } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            data-testid="main-navigation"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "backdrop-blur-2xl bg-[rgba(5,5,7,0.72)] border-b border-white/[0.06]"
                    : "bg-transparent"
            }`}
        >
            <nav className="px-6 md:px-10 lg:px-14 py-4 md:py-5 flex items-center justify-between max-w-[1400px] mx-auto">
                <BrandLogo size={30} showWordmark data-testid="nav-brand" />

                <ul className="hidden lg:flex items-center gap-9">
                    {LINKS.map((l) => (
                        <li key={l.key}>
                            <a
                                href={l.href}
                                data-testid={`nav-link-${l.key}`}
                                className="text-[13.5px] text-lg-ink-soft hover:text-lg-ink transition-colors font-medium tracking-[-0.005em]"
                            >
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden lg:flex items-center gap-3">
                    <LanguageSwitcher />
                    {user ? (
                        <PrimaryButton
                            as="a"
                            href="/app"
                            data-testid="nav-app-link"
                            size="sm"
                            icon={null}
                        >
                            Open the app
                        </PrimaryButton>
                    ) : (
                        <>
                            <button
                                onClick={login}
                                data-testid="nav-signin"
                                className="text-[13.5px] text-lg-ink-soft hover:text-lg-ink transition-colors font-medium"
                            >
                                Sign in
                            </button>
                            <PrimaryButton
                                as="a"
                                href="#cta"
                                data-testid="nav-cta-button"
                                size="sm"
                                icon={null}
                            >
                                Join waitlist
                            </PrimaryButton>
                        </>
                    )}
                </div>

                <div className="lg:hidden flex items-center gap-2">
                    <LanguageSwitcher />
                    <button
                        data-testid="nav-mobile-toggle"
                        onClick={() => setOpen(!open)}
                        className="text-lg-ink p-2"
                        aria-label="Menu"
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {open && (
                <div
                    data-testid="nav-mobile-menu"
                    className="lg:hidden px-6 pb-6 bg-[rgba(5,5,7,0.94)] backdrop-blur-2xl border-b border-white/[0.06]"
                >
                    <ul className="flex flex-col gap-1 pt-4">
                        {LINKS.map((l) => (
                            <li key={l.key}>
                                <a
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="block text-lg-ink text-base py-3 border-b border-white/[0.04]"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                        <li className="pt-4">
                            <PrimaryButton
                                as="a"
                                href={user ? "/app" : "#cta"}
                                onClick={() => setOpen(false)}
                                className="w-full"
                            >
                                {user ? "Open the app" : "Join waitlist"}
                            </PrimaryButton>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
