import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, GradientHeadline, StatusBadge } from "@/components/ds";

const FAQS = [
    {
        q: "What actually is an \"Emotional Intelligence Ecosystem\"?",
        a: "It's a private operating layer that senses, releases, grows, and transforms with you across your day. Watch, phone, and (soon) room — one continuous thread. Not a journaling app. Not a chatbot. A quiet interior infrastructure.",
    },
    {
        q: "Is my emotional data private?",
        a: "Radically. Sensitive signals are on-device by default. Team and org views are aggregates that mathematically cannot re-identify an individual. Nothing is sold, nothing is shared, ever.",
    },
    {
        q: "How is this different from therapy?",
        a: "It isn't therapy. Think of it as the between-sessions layer — a companion for the 23 hours a day nobody else sees. Many therapists recommend it. Your therapist will love the growth data you can (optionally) share.",
    },
    {
        q: "What happens in the daily check-in?",
        a: "Six sliders, one honest sentence, thirty seconds. That's it. The AI responds with a co-regulation suggestion tuned to you. Over 30 days, a pattern becomes a story.",
    },
    {
        q: "What does \"Founding\" get me?",
        a: "50% off your tier — locked for life. A permanent Founding badge. Direct access to founders. And a real voice in what the ecosystem becomes over the next three horizons.",
    },
    {
        q: "When does the full ecosystem land?",
        a: "Horizon 01 is live. Horizon 02 (ambient sensing) is in private beta now. Horizon 03 (room-scale presence) ships in 2026. Founding members get every horizon at their locked rate.",
    },
];

export default function FAQV2() {
    return (
        <Section size="lg" className="bg-[rgba(255,255,255,0.012)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-32">
                        <StatusBadge tone="magenta" className="mb-8">
                            FAQ
                        </StatusBadge>
                        <GradientHeadline as="h2" size="lg">
                            Quiet answers.
                            <br />
                            <span className="lg-gradient-text italic">
                                Honest ones
                            </span>
                            .
                        </GradientHeadline>
                        <p className="mt-8 text-base text-lg-ink-soft max-w-md leading-relaxed">
                            Still curious? Reach founders directly at{" "}
                            <a
                                href="mailto:founders@letitgo.ai"
                                className="text-lg-ink underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
                            >
                                founders@letitgo.ai
                            </a>
                            .
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <Accordion
                        type="single"
                        collapsible
                        data-testid="faq-accordion"
                        className="w-full"
                    >
                        {FAQS.map((item, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i}`}
                                data-testid={`faq-item-${i}`}
                                className="border-b border-white/[0.08] last:border-b-0"
                            >
                                <AccordionTrigger className="text-[18px] md:text-[22px] font-semibold text-lg-ink hover:no-underline py-7 text-left tracking-[-0.015em]">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-[15.5px] md:text-base text-lg-ink-soft leading-relaxed pb-7 max-w-2xl">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </Section>
    );
}
