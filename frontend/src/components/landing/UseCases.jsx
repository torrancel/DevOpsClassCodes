import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Stethoscope, Scale, GraduationCap, Briefcase } from "lucide-react";
import { setAudience } from "./audienceStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CASE_META = [
    { key: "kids", accent: "blue" },
    { key: "individual", accent: "violet" },
    { key: "team", accent: "pink" },
    { key: "professional", accent: "orange" },
];

const PROFESSIONS = [
    { slug: "doctors", icon: Stethoscope, nameKey: "doctorsName", descKey: "doctorsDesc" },
    { slug: "attorneys", icon: Scale, nameKey: "attorneysName", descKey: "attorneysDesc" },
    { slug: "teachers", icon: GraduationCap, nameKey: "teachersName", descKey: "teachersDesc" },
    { slug: "managers", icon: Briefcase, nameKey: "managersName", descKey: "managersDesc" },
];

const dotColor = { blue: "#5E8BFF", violet: "#8A4DFF", pink: "#FF6FD3", orange: "#FF8A5C" };

export default function UseCases() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <section
            data-testid="usecases-section"
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40"
        >
            <div className="mb-12 md:mb-16">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                    {t("usecases.eyebrow")}
                </p>
                <h2
                    data-testid="usecases-headline"
                    className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink max-w-4xl"
                >
                    {t("usecases.headlinePre")}
                    <br />
                    {t("usecases.headlineMiddle")} <em className="gradient-text">{t("usecases.headlineGradient")}</em> {t("usecases.headlinePost")}
                </h2>
            </div>

            <Tabs defaultValue="individual" className="w-full">
                <TabsList
                    data-testid="usecases-tabs"
                    className="bg-white/[0.04] border border-white/10 rounded-full p-1 h-auto inline-flex mb-12 backdrop-blur flex-wrap"
                >
                    {CASE_META.map((c) => (
                        <TabsTrigger
                            key={c.key}
                            value={c.key}
                            data-testid={`usecases-tab-${c.key}`}
                            className="rounded-full px-5 md:px-6 py-2.5 text-sm text-ink-soft data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue data-[state=active]:via-violet data-[state=active]:to-pink data-[state=active]:text-white data-[state=active]:shadow-none"
                        >
                            {t(`usecases.${c.key}.label`)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {CASE_META.map((c) => (
                    <TabsContent
                        key={c.key}
                        value={c.key}
                        data-testid={`usecases-content-${c.key}`}
                        className="mt-0"
                    >
                        <div className="grid grid-cols-12 gap-6 md:gap-10 items-stretch">
                            <div className="col-span-12 md:col-span-7">
                                <div className="relative h-[360px] md:h-[520px] gradient-border overflow-hidden">
                                    <div className="absolute inset-0 aurora"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-72 h-72 md:w-96 md:h-96">
                                            {[0, 1, 2, 3].map((idx) => (
                                                <div
                                                    key={idx}
                                                    className="absolute inset-0 rounded-full border"
                                                    style={{
                                                        borderColor: dotColor[c.accent],
                                                        opacity: 0.35 - idx * 0.06,
                                                        transform: `scale(${1 - idx * 0.18})`,
                                                        animation: `breath ${4 + idx}s ease-in-out infinite`,
                                                        boxShadow: `0 0 60px ${dotColor[c.accent]}33`,
                                                    }}
                                                />
                                            ))}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="font-display italic text-3xl md:text-5xl gradient-text">
                                                        {t(`usecases.${c.key}.label`)}
                                                    </p>
                                                    <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft mt-2">
                                                        {t(`usecases.${c.key}.eyebrow`)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
                                <h3 className="font-display text-3xl md:text-5xl tracking-tight text-ink leading-tight">
                                    {t(`usecases.${c.key}.title`)}
                                </h3>
                                <p className="mt-6 text-base md:text-lg text-ink-soft leading-relaxed">
                                    {t(`usecases.${c.key}.body`)}
                                </p>
                                <ul className="mt-8 space-y-3">
                                    {[1, 2, 3, 4].map((n) => (
                                        <li key={n} className="flex items-start gap-3 text-base text-ink">
                                            <span className="mt-2 inline-block h-px w-6 bg-gradient-to-r from-blue to-pink"></span>
                                            {t(`usecases.${c.key}.bullet${n}`)}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {c.key === "professional" && (
                                <div className="col-span-12 mt-8">
                                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                                        {t("usecases.specialistModes")}
                                    </p>
                                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                                        {PROFESSIONS.map((p) => {
                                            const Icon = p.icon;
                                            const name = t(`usecases.${p.nameKey}`);
                                            return (
                                                <button
                                                    type="button"
                                                    key={p.slug}
                                                    onClick={() => {
                                                        navigate(`/${p.slug}`);
                                                    }}
                                                    data-testid={`professional-${p.slug}`}
                                                    className="col-span-12 sm:col-span-6 lg:col-span-3 gradient-border p-6 transition-transform duration-500 hover:-translate-y-1 text-left"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/10 mb-5">
                                                        <Icon size={20} strokeWidth={1.5} className="text-ink" />
                                                    </div>
                                                    <h4 className="font-display text-2xl text-ink mb-2">
                                                        {name}
                                                    </h4>
                                                    <p className="text-sm text-ink-soft leading-relaxed">
                                                        {t(`usecases.${p.descKey}`)}
                                                    </p>
                                                    <p className="mt-4 text-[10px] uppercase tracking-[0.25em] gradient-text">
                                                        {t("usecases.openPage", { name: name.toLowerCase() })}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    );
}
