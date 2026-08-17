import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/ds";

/**
 * AuthShell — shared matte-black auth page frame.
 * Renders brand mark, headline, form slot, and footer link.
 */
export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
    return (
        <main
            data-testid="auth-shell"
            className="lg-root relative min-h-screen bg-lg-bg text-lg-ink flex flex-col"
        >
            <div aria-hidden="true" className="lg-ambient opacity-70" />
            <div aria-hidden="true" className="absolute inset-0 lg-grid-bg pointer-events-none opacity-60" />

            {/* Top brand strip */}
            <header className="relative z-10 px-6 md:px-12 py-6 md:py-8">
                <Link to="/" className="inline-flex items-center gap-3" data-testid="auth-brand-home">
                    <BrandLogo size={28} showWordmark />
                </Link>
            </header>

            {/* Card */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-5 py-10 md:py-16">
                <div className="w-full max-w-md">
                    <div className="lg-panel lg-panel-lg p-7 md:p-10">
                        {eyebrow && (
                            <p className="lg-eyebrow lg-gradient-text mb-4">{eyebrow}</p>
                        )}
                        <h1 className="text-3xl md:text-[36px] font-semibold text-lg-ink tracking-[-0.02em] leading-[1.05]">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-4 text-[15px] text-lg-ink-soft leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                        <div className="mt-8">{children}</div>
                    </div>
                    {footer && (
                        <p className="mt-6 text-center text-sm text-lg-ink-soft">{footer}</p>
                    )}
                </div>
            </div>
        </main>
    );
}
