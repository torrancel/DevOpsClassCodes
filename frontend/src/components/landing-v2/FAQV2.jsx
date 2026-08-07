import { useTranslation } from "react-i18next";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, GradientHeadline, StatusBadge } from "@/components/ds";

export default function FAQV2() {
    const { t } = useTranslation();
    const FAQS = t("v2Landing.faq.items", { returnObjects: true });
    return (
        <Section size="lg" className="bg-[rgba(255,255,255,0.012)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-32">
                        <StatusBadge tone="magenta" className="mb-8">
                            {t("v2Landing.faq.eyebrow")}
                        </StatusBadge>
                        <GradientHeadline as="h2" size="lg">
                            {t("v2Landing.faq.headlinePre")}
                            <br />
                            <span className="lg-gradient-text italic">
                                {t("v2Landing.faq.headlineGradient")}
                            </span>
                            {t("v2Landing.faq.headlinePost")}
                        </GradientHeadline>
                        <p className="mt-8 text-base text-lg-ink-soft max-w-md leading-relaxed">
                            {t("v2Landing.faq.sub")}{" "}
                            <a
                                href="mailto:founders@letitgoai.com"
                                className="text-lg-ink underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
                            >
                                founders@letitgoai.com
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
