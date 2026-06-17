import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const CASES = [
    {
        key: "personal",
        label: "Personal",
        eyebrow: "01 / For yourself",
        title: "Become the calmest person in the room.",
        body: "Aura learns your patterns — when you tighten, when you spiral, when you light up. It nudges you back to center, gently, without ever taking the wheel.",
        bullets: [
            "Daily check-ins under 90 seconds",
            "Pattern memory across months",
            "Private. Encrypted. Yours.",
        ],
        image: "https://images.pexels.com/photos/31776177/pexels-photo-31776177.jpeg",
    },
    {
        key: "teams",
        label: "Teams",
        eyebrow: "02 / For groups",
        title: "Meetings that don't burn people out.",
        body: "Aura sits quietly in your calls — never recording, never reporting. It surfaces unspoken tension, suggests pauses, and helps facilitators see the room.",
        bullets: [
            "Real-time facilitator co-pilot",
            "Anonymous team affect telemetry",
            "Built for psychological safety",
        ],
        image: "https://images.pexels.com/photos/8100072/pexels-photo-8100072.jpeg",
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
        image: "https://images.pexels.com/photos/29390707/pexels-photo-29390707.jpeg",
    },
];

export default function UseCases() {
    return (
        <section
            id="use-cases"
            data-testid="usecases-section"
            className="px-6 md:px-12 lg:px-24 py-24 md:py-40"
        >
            <div className="mb-12 md:mb-16">
                <p className="text-xs uppercase tracking-[0.3em] text-forest mb-6">Use cases</p>
                <h2
                    data-testid="usecases-headline"
                    className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink max-w-4xl"
                >
                    Three audiences.
                    <br />
                    One <em className="text-forest">felt</em> sense of being heard.
                </h2>
            </div>

            <Tabs defaultValue="personal" className="w-full">
                <TabsList
                    data-testid="usecases-tabs"
                    className="bg-bg-soft border border-line rounded-full p-1 h-auto inline-flex mb-12"
                >
                    {CASES.map((c) => (
                        <TabsTrigger
                            key={c.key}
                            value={c.key}
                            data-testid={`usecases-tab-${c.key}`}
                            className="rounded-full px-6 py-2.5 text-sm data-[state=active]:bg-forest data-[state=active]:text-bg data-[state=active]:shadow-none text-ink-soft"
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
                                <div className="relative h-[360px] md:h-[520px] rounded-3xl overflow-hidden border border-line">
                                    <img
                                        src={c.image}
                                        alt={c.label}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent"></div>
                                    <p className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.3em] text-bg/90">
                                        {c.eyebrow}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
                                <h3 className="font-serif text-3xl md:text-5xl tracking-tight text-ink leading-tight">
                                    {c.title}
                                </h3>
                                <p className="mt-6 text-base md:text-lg text-ink-soft leading-relaxed">
                                    {c.body}
                                </p>
                                <ul className="mt-8 space-y-3">
                                    {c.bullets.map((b) => (
                                        <li key={b} className="flex items-start gap-3 text-base text-ink">
                                            <span className="mt-2 inline-block h-px w-6 bg-forest/60"></span>
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
