import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

export default function FAQ() {
    const { t } = useTranslation();
    const items = [1, 2, 3, 4, 5, 6].map((n) => ({
        q: t(`faq.q${n}`),
        a: t(`faq.a${n}`),
    }));
    return (
        <section
            data-testid="faq-section"
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-bg-soft"
        >
            <div className="grid grid-cols-12 gap-6 md:gap-10">
                <div className="col-span-12 md:col-span-4">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                        {t("faq.eyebrow")}
                    </p>
                    <h2 className="font-display text-4xl md:text-6xl leading-[1.02] tracking-tight text-ink sticky top-32">
                        {t("faq.titlePre")}
                        <br />
                        <em className="gradient-text">{t("faq.titleGradient")}</em> {t("faq.titlePost")}
                    </h2>
                </div>
                <div className="col-span-12 md:col-span-8">
                    <Accordion
                        type="single"
                        collapsible
                        data-testid="faq-accordion"
                        className="w-full"
                    >
                        {items.map((item, i) => (
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
