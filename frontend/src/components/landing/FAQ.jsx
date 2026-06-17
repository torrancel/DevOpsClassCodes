import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
    {
        q: "Is Let It Go listening to me all the time?",
        a: "No. It only senses when you explicitly start a session, join a meeting where it's invited, or open the daily check-in. Nothing is recorded by default. Everything is on-device unless you choose otherwise.",
    },
    {
        q: "How is this different from a mood tracker or meditation app?",
        a: "Mood trackers ask you. Meditation apps prescribe you. Let It Go senses, contextualizes, and adapts — across personal life, teamwork, and the agents you talk to. It's infrastructure for the inner life, not another single-purpose app.",
    },
    {
        q: "What about privacy?",
        a: "Affective data is the most intimate data there is. We treat it that way: end-to-end encryption, on-device inference for sensing, zero third-party data sale, full export and delete on demand, SOC 2 Type II in progress.",
    },
    {
        q: "Will it work with my AI agents?",
        a: "Yes. The Let It Go Agent SDK exposes affect signals and regulation suggestions via REST and WebSocket. Works with OpenAI, Anthropic, open-source LLMs, or your own stack.",
    },
    {
        q: "Is this clinical?",
        a: "Let It Go is not a medical device and does not diagnose. It is a co-regulation instrument — designed alongside clinicians, but never replacing them.",
    },
    {
        q: "When can I actually try it?",
        a: "Closed beta is running now. Join the waitlist and we'll send you a quiet, no-marketing invitation the moment your cohort opens.",
    },
];

export default function FAQ() {
    return (
        <section
            data-testid="faq-section"
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-bg-soft"
        >
            <div className="grid grid-cols-12 gap-6 md:gap-10">
                <div className="col-span-12 md:col-span-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">FAQ</p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-ink sticky top-32">
                        Honest answers.
                        <br />
                        <em className="gradient-text">No</em> tap-dancing.
                    </h2>
                </div>
                <div className="col-span-12 md:col-span-8">
                    <Accordion
                        type="single"
                        collapsible
                        data-testid="faq-accordion"
                        className="w-full"
                    >
                        {FAQ_ITEMS.map((item, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i}`}
                                data-testid={`faq-item-${i}`}
                                className="border-b border-white/10"
                            >
                                <AccordionTrigger className="font-display text-xl md:text-2xl text-ink hover:no-underline py-6 text-left">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-base md:text-lg text-ink-soft leading-relaxed pb-6 max-w-2xl">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
