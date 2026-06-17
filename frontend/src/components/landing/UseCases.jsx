import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Stethoscope, Scale, GraduationCap, Briefcase } from "lucide-react";
import { setAudience } from "./audienceStore";
import { useNavigate } from "react-router-dom";

const CASES = [
    {
        key: "kids",
        label: "Kids",
        eyebrow: "01 / Ages 6–14",
        title: "Big feelings, small words. We help kids name them.",
        body: "A gentle, playful companion that teaches children to notice and name what they feel — through stories, breathing games, and characters they choose. Parent-controlled, screen-time aware, COPPA-aligned.",
        bullets: [
            "Story-based emotion learning",
            "Calming breath games & lullaby mode",
            "Parent dashboard · COPPA-aligned",
            "Zero ads, zero data sale, ever",
        ],
        accent: "blue",
    },
    {
        key: "individual",
        label: "Individual",
        eyebrow: "02 / For yourself",
        title: "Become the calmest person in the room.",
        body: "Let It Go learns your patterns — when you tighten, when you spiral, when you light up. It nudges you back to center, gently, without ever taking the wheel.",
        bullets: [
            "Daily 90-second check-ins",
            "Stress · anxiety · depression tracking",
            "12-month growth memory",
            "Private. Encrypted. Yours.",
        ],
        accent: "violet",
    },
    {
        key: "team",
        label: "Team",
        eyebrow: "03 / For groups",
        title: "Meetings that don't burn people out.",
        body: "Sits quietly in your calls — never recording, never reporting. Surfaces unspoken tension, suggests pauses, and helps facilitators see the room.",
        bullets: [
            "Real-time facilitator co-pilot",
            "Anonymous team affect telemetry",
            "Slack & Zoom integrations",
            "Built for psychological safety",
        ],
        accent: "pink",
    },
    {
        key: "professional",
        label: "Professional",
        eyebrow: "04 / For practitioners",
        title: "A clinical-grade companion for the people who hold others.",
        body: "Specialized modes for doctors, attorneys, teachers, and managers — tuned to the unique stressors and ethical demands of each profession.",
        bullets: [
            "Compliance: HIPAA · attorney-client · FERPA",
            "Burnout & vicarious-trauma early warning",
            "End-of-day decompression routines",
            "Audit trails (never content — only meta)",
        ],
        accent: "orange",
        professions: [
            { icon: Stethoscope, name: "Doctors", desc: "Compassion fatigue, on-call recovery, post-shift decompression." },
            { icon: Scale, name: "Attorneys", desc: "Adversarial stress, ethical bind detection, court-day calm." },
            { icon: GraduationCap, name: "Teachers", desc: "Classroom dysregulation mirror, parent-conf coaching." },
            { icon: Briefcase, name: "Managers", desc: "1:1 affect prep, conflict mediation, layoff conversation support." },
        ],
    },
];

const dotColor = { blue: "#5E8BFF", violet: "#8A4DFF", pink: "#FF6FD3", orange: "#FF8A5C" };

export default function UseCases() {
    const navigate = useNavigate();
    return (
        <section
            data-testid="usecases-section"
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40"
        >
            <div className="mb-12 md:mb-16">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                    Built for everyone who feels
                </p>
                <h2
                    data-testid="usecases-headline"
                    className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink max-w-4xl"
                >
                    From kids to clinicians.
                    <br />
                    One <em className="gradient-text">felt</em> sense of being heard.
                </h2>
            </div>

            <Tabs defaultValue="individual" className="w-full">
                <TabsList
                    data-testid="usecases-tabs"
                    className="bg-white/[0.04] border border-white/10 rounded-full p-1 h-auto inline-flex mb-12 backdrop-blur flex-wrap"
                >
                    {CASES.map((c) => (
                        <TabsTrigger
                            key={c.key}
                            value={c.key}
                            data-testid={`usecases-tab-${c.key}`}
                            className="rounded-full px-5 md:px-6 py-2.5 text-sm text-ink-soft data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue data-[state=active]:via-violet data-[state=active]:to-pink data-[state=active]:text-white data-[state=active]:shadow-none"
                        >
                            {c.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {CASES.map((c) => (
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
                                                        {c.label}
                                                    </p>
                                                    <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft mt-2">
                                                        {c.eyebrow}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
                                <h3 className="font-display text-3xl md:text-5xl tracking-tight text-ink leading-tight">
                                    {c.title}
                                </h3>
                                <p className="mt-6 text-base md:text-lg text-ink-soft leading-relaxed">
                                    {c.body}
                                </p>
                                <ul className="mt-8 space-y-3">
                                    {c.bullets.map((b) => (
                                        <li key={b} className="flex items-start gap-3 text-base text-ink">
                                            <span className="mt-2 inline-block h-px w-6 bg-gradient-to-r from-blue to-pink"></span>
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Professional sub-grid */}
                            {c.professions && (
                                <div className="col-span-12 mt-8">
                                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                                        Four specialist modes
                                    </p>
                                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                                        {c.professions.map((p, i) => {
                                            const Icon = p.icon;
                                            const slug = p.name.toLowerCase();
                                            const isDoctors = slug === "doctors";
                                            return (
                                                <button
                                                    type="button"
                                                    key={p.name}
                                                    onClick={() => {
                                                        if (isDoctors) {
                                                            navigate("/doctors");
                                                            return;
                                                        }
                                                        setAudience(slug);
                                                        const el = document.getElementById("cta");
                                                        if (el) el.scrollIntoView({ behavior: "smooth" });
                                                    }}
                                                    data-testid={`professional-${slug}`}
                                                    className="col-span-12 sm:col-span-6 lg:col-span-3 gradient-border p-6 transition-transform duration-500 hover:-translate-y-1 text-left"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.04] border border-white/10 mb-5">
                                                        <Icon size={20} strokeWidth={1.5} className="text-ink" />
                                                    </div>
                                                    <h4 className="font-display text-2xl text-ink mb-2">
                                                        {p.name}
                                                    </h4>
                                                    <p className="text-sm text-ink-soft leading-relaxed">
                                                        {p.desc}
                                                    </p>
                                                    <p className="mt-4 text-[10px] uppercase tracking-[0.25em] gradient-text">
                                                        {isDoctors ? "Open doctors page →" : `Join ${p.name.toLowerCase()} beta →`}
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
