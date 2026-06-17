import { motion } from "framer-motion";

const QUOTES = [
    {
        text: "It's the first software that ever felt like it understood me without flattening me.",
        name: "Dr. Sana Mira",
        role: "Psychiatrist · Closed beta",
    },
    {
        text: "We replaced two coaches and three Slack channels of venting with one quiet little app.",
        name: "Liam Roque",
        role: "Head of People · Series B startup",
    },
    {
        text: "Plugged Aura into our support agent. Escalation rate down 41%. People felt heard.",
        name: "Iyana Park",
        role: "Engineering lead · Fintech",
    },
    {
        text: "I expected a wellness toy. I got an operating system for being a person.",
        name: "Maxim Aldana",
        role: "Founder · early adopter",
    },
];

export default function Testimonials() {
    return (
        <section
            data-testid="testimonials-section"
            className="px-6 md:px-12 lg:px-24 py-24 md:py-40 bg-bg-soft"
        >
            <div className="mb-12 md:mb-20 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.3em] text-forest mb-6">
                    From the field
                </p>
                <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink">
                    Quiet praise from
                    <br />
                    <em className="text-forest">noisy</em> people.
                </h2>
            </div>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {QUOTES.map((q, i) => (
                    <motion.figure
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        data-testid={`testimonial-${i}`}
                        className={`col-span-12 md:col-span-6 rounded-3xl border border-line bg-surface p-8 md:p-10 ${
                            i % 2 === 1 ? "md:translate-y-8" : ""
                        }`}
                    >
                        <span className="font-serif text-6xl text-clay leading-none">"</span>
                        <blockquote className="font-serif text-2xl md:text-3xl leading-snug text-ink -mt-2">
                            {q.text}
                        </blockquote>
                        <figcaption className="mt-8 flex items-center gap-3 pt-6 border-t border-line">
                            <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center font-serif text-forest text-lg">
                                {q.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-ink">{q.name}</p>
                                <p className="text-xs text-ink-soft mt-0.5">{q.role}</p>
                            </div>
                        </figcaption>
                    </motion.figure>
                ))}
            </div>
        </section>
    );
}
