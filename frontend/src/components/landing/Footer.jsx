import InfinityGlow from "./InfinityGlow";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Resolve known link labels (by COLUMN + INDEX, locale-stable) to real routes.
// Anything not listed here falls through to a plain anchor with href="#".
const ROUTES_BY_COL = {
    platform: {},
    // Company: first item is always "Manifesto/Founder", route to /founder.
    company: { 0: "/founder" },
    legal: {},
};

export default function Footer() {
    const { t } = useTranslation();
    const COLS = [
        { key: "platform", title: t("footer.platform"), links: t("footer.linksPlatform", { returnObjects: true }) },
        { key: "company",  title: t("footer.company"),  links: t("footer.linksCompany",  { returnObjects: true }) },
        { key: "legal",    title: t("footer.legal"),    links: t("footer.linksLegal",    { returnObjects: true }) },
    ];
    return (
        <footer
            data-testid="footer-section"
            className="px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-12 border-t border-white/10"
        >
            <div className="grid grid-cols-12 gap-8 mb-20">
                <div className="col-span-12 md:col-span-5">
                    <div className="flex items-center gap-3">
                        <InfinityGlow size={36} />
                        <span className="font-display text-2xl tracking-tight text-ink">
                            Let It Go <span className="gradient-text font-sans text-base font-medium align-top">AI</span>
                        </span>
                    </div>
                    <p className="mt-6 text-lg text-ink-soft max-w-md font-display italic">
                        {t("footer.tagline")}
                    </p>
                </div>

                {COLS.map((c) => (
                    <div key={c.title} className="col-span-6 md:col-span-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] gradient-text mb-4">
                            {c.title}
                        </p>
                        <ul className="space-y-3">
                            {c.links.map((l, i) => {
                                const route = ROUTES_BY_COL[c.key]?.[i];
                                const testId = `footer-link-${l.toLowerCase().replace(/\s+/g, "-")}`;
                                return (
                                    <li key={l}>
                                        {route ? (
                                            <Link
                                                to={route}
                                                data-testid={testId}
                                                className="link-underline text-sm text-ink-soft hover:text-ink"
                                            >
                                                {l}
                                            </Link>
                                        ) : (
                                            <a
                                                href="#"
                                                data-testid={testId}
                                                className="link-underline text-sm text-ink-soft hover:text-ink"
                                            >
                                                {l}
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

            {/* Massive brand */}
            <div className="border-t border-white/10 pt-10 mb-10 overflow-hidden">
                <h3
                    aria-hidden="true"
                    className="font-display italic gradient-text text-[clamp(4rem,18vw,18rem)] leading-none tracking-tight select-none"
                >
                    let it go.
                </h3>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-ink-soft">
                <p>© {new Date().getFullYear()} Let It Go AI · {t("footer.copyright")}</p>
                <div className="flex items-center gap-6">
                    <a href="#" className="link-underline">Twitter</a>
                    <a href="#" className="link-underline">LinkedIn</a>
                    <a href="#" className="link-underline">Substack</a>
                </div>
            </div>
        </footer>
    );
}
