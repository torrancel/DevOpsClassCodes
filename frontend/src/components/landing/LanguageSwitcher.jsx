import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { LANGUAGES } from "@/i18n";

export default function LanguageSwitcher({ variant = "nav" }) {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onDoc = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) || LANGUAGES[0];

    const change = (code) => {
        i18n.changeLanguage(code);
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                data-testid="language-switcher-toggle"
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`inline-flex items-center gap-2 rounded-full transition-all ${
                    variant === "nav"
                        ? "border border-white/15 bg-white/[0.02] hover:bg-white/[0.06] px-3 py-2 text-xs"
                        : "border border-white/15 px-3 py-1.5 text-xs"
                } text-ink-soft hover:text-ink`}
            >
                <Globe size={13} />
                <span className="font-medium">{current.native}</span>
            </button>

            {open && (
                <div
                    data-testid="language-switcher-menu"
                    role="listbox"
                    className="absolute right-0 mt-2 w-56 max-h-[420px] overflow-auto rounded-2xl backdrop-blur-xl bg-bg/95 border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.5)] p-1.5 z-50"
                >
                    {LANGUAGES.map((l) => {
                        const active = l.code === i18n.resolvedLanguage;
                        return (
                            <button
                                key={l.code}
                                type="button"
                                role="option"
                                aria-selected={active}
                                onClick={() => change(l.code)}
                                data-testid={`language-option-${l.code}`}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-colors ${
                                    active
                                        ? "bg-white/[0.06] text-ink"
                                        : "text-ink-soft hover:bg-white/[0.04] hover:text-ink"
                                }`}
                            >
                                <span className="flex flex-col leading-tight">
                                    <span className="font-medium">{l.native}</span>
                                    <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft/70">
                                        {l.label}
                                    </span>
                                </span>
                                {active && <Check size={14} className="text-pink shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
