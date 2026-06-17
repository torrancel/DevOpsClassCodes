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
        text: "Plugged Let It Go into our support agent. Escalation rate down 41%. People felt heard.",
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
            className="px-6 md:px-12 lg:px-20 py-24 md:py-40 bg-bg-soft"
        >
            <div className="mb-12 md:mb-20 max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                    From the field
                </p>
                <h2 className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink">
                    Quiet praise from
                    <br />
                    <em className="gradient-text">noisy</em> people.
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
                        className={`col-span-12 md:col-span-6 gradient-border p-8 md:p-10 ${
                            i % 2 === 1 ? "md:translate-y-8" : ""
                        }`}
                    >
                        <span className="font-display text-7xl gradient-text leading-none italic">"</span>
                        <blockquote className="font-display text-2xl md:text-3xl leading-snug text-ink -mt-4">
                            {q.text}
                        </blockquote>
                        <figcaption className="mt-8 flex items-center gap-3 pt-6 border-t border-white/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue via-violet to-pink flex items-center justify-center font-display text-white text-lg">
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
