import { motion } from "framer-motion";

export default function Manifesto() {
    return (
        <section
            id="manifesto"
            data-testid="manifesto-section"
            className="px-6 md:px-12 lg:px-24 py-24 md:py-48 relative grain"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-3xl mx-auto"
            >
                <p className="text-xs uppercase tracking-[0.3em] text-forest mb-10 text-center">
                    Manifesto
                </p>

                <h2 className="font-serif text-3xl md:text-5xl leading-[1.15] tracking-tight text-ink text-center">
                    The next decade will be defined not by how smart our machines become,
                    but by how <em className="text-forest">emotionally literate</em> our lives can stay
                    while living with them.
                </h2>

                <div className="mt-16 space-y-6 text-lg md:text-xl text-ink-soft leading-relaxed">
                    <p>
                        For seventy years, we built operating systems for tasks. For files.
                        For windows and pixels and packets. We never built one for the part of us
                        that <em>actually decides</em> — the part that feels.
                    </p>
                    <p>
                        Aura is that operating system. Not an app you open. A layer you live in.
                        Quiet, consent-first, and built to make you more human, not less.
                    </p>
                    <p className="font-serif italic text-ink text-2xl md:text-3xl pt-4">
                        We are not building artificial emotional intelligence.
                        <br />
                        We are building an instrument for the real thing.
                    </p>
                </div>

                <div className="mt-16 flex items-center justify-center gap-4">
                    <div className="w-10 h-px bg-forest/40"></div>
                    <p className="text-sm uppercase tracking-[0.25em] text-ink-soft">
                        The Aura Team
                    </p>
                    <div className="w-10 h-px bg-forest/40"></div>
                </div>
            </motion.div>
        </section>
    );
}
