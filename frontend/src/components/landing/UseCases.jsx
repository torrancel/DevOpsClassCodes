import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const CASES = [
    {
        key: "personal",
        label: "Personal",
        eyebrow: "01 / For yourself",
        title: "Become the calmest person in the room.",
        body: "Let It Go learns your patterns — when you tighten, when you spiral, when you light up. It nudges you back to center, gently, without ever taking the wheel.",
        bullets: [
            "Daily check-ins under 90 seconds",
            "Pattern memory across months",
            "Private. Encrypted. Yours.",
        ],
    },
    {
        key: "teams",
        label: "Teams",
        eyebrow: "02 / For groups",
        title: "Meetings that don't burn people out.",
        body: "Sits quietly in your calls — never recording, never reporting. Surfaces unspoken tension, suggests pauses, and helps facilitators see the room.",
        bullets: [
            "Real-time facilitator co-pilot",
            "Anonymous team affect telemetry",
            "Built for psychological safety",
        ],
    },
    {
        key: "agents",
        label: "AI Agents",
        eyebrow: "03 / For machines",
        title: "Give your agents an inner sense of the human.",
        body: "An SDK so your LLM agents can read affect, adapt tone, and refuse to push when a user is dysregulated. The missing layer in every chatbot ever shipped.",
        bullets: [
            "Drop-in REST & WebSocket APIs",
            "Open evals & safety harness",
            "Works with any model",
        ],
    },
];

const PILLAR_VIZ = [
    { label: "AWARE", color: "#5E8BFF" },
    { label: "RELEASE", color: "#FF6FD3" },
    { label: "GROW", color: "#8A4DFF" },
    { label: "TRANSFORM", color: "#FF8A5C" },
];

export default function UseCases() {
    return (
        <section
            data-testid="usecases-section"
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40"
        >
            <div className="mb-12 md:mb-16">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                    Use cases
                </p>
                <h2
                    data-testid="usecases-headline"
                    className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink max-w-4xl"
                >
                    Three audiences.
                    <br />
                    One <em className="gradient-text">felt</em> sense of being heard.
                </h2>
            </div>

            <Tabs defaultValue="personal" className="w-full">
                <TabsList
                    data-testid="usecases-tabs"
                    className="bg-white/[0.04] border border-white/10 rounded-full p-1 h-auto inline-flex mb-12 backdrop-blur"
                >
                    {CASES.map((c) => (
                        <TabsTrigger
                            key={c.key}
                            value={c.key}
                            data-testid={`usecases-tab-${c.key}`}
                            className="rounded-full px-6 py-2.5 text-sm text-ink-soft data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue data-[state=active]:via-violet data-[state=active]:to-pink data-[state=active]:text-white data-[state=active]:shadow-none"
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
                                    {/* Aurora viz with pillars */}
                                    <div className="absolute inset-0 aurora"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-72 h-72 md:w-96 md:h-96">
                                            {PILLAR_VIZ.map((p, idx) => (
                                                <div
                                                    key={p.label}
                                                    className="absolute inset-0 rounded-full border"
                                                    style={{
                                                        borderColor: p.color,
                                                        opacity: 0.4,
                                                        transform: `scale(${1 - idx * 0.18})`,
                                                        animation: `breath ${4 + idx}s ease-in-out infinite`,
                                                        boxShadow: `0 0 60px ${p.color}33`,
                                                    }}
                                                />
                                            ))}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="font-display italic text-3xl md:text-4xl gradient-text">
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
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    );
}
