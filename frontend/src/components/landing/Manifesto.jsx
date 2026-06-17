import { motion } from "framer-motion";

export default function Manifesto() {
    return (
        <section
            id="manifesto"
            data-testid="manifesto-section"
            className="relative px-6 md:px-12 lg:px-20 py-24 md:py-48 overflow-hidden"
        >
            <div className="absolute inset-0 aurora opacity-60 pointer-events-none"></div>
            <div className="absolute inset-0 stars pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative max-w-3xl mx-auto"
            >
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-10 text-center">
                    Manifesto
                </p>

                <h2 className="font-display text-3xl md:text-5xl leading-[1.15] tracking-tight text-ink text-center">
                    The next decade won't be defined by how smart machines become,
                    but by how <em className="gradient-text">emotionally literate</em> our lives can stay
                    while living with them.
                </h2>

                <div className="mt-16 space-y-6 text-lg md:text-xl text-ink-soft leading-relaxed">
                    <p>
                        For seventy years, we built operating systems for tasks. For files.
                        For windows and pixels and packets. We never built one for the part of us
                        that <em>actually decides</em> — the part that feels.
                    </p>
                    <p>
                        Let It Go is that operating system. Not an app you open. A layer you live in.
                        Quiet, consent-first, and built to make you more human, not less.
                    </p>
                    <p className="font-display italic text-ink text-2xl md:text-3xl pt-4">
                        We are not building artificial emotional intelligence.
                        <br />
                        We are building an <span className="gradient-text">instrument</span> for the real thing.
                    </p>
                </div>

                <div className="mt-16 flex items-center justify-center gap-4">
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-violet to-transparent"></div>
                    <p className="text-sm uppercase tracking-[0.3em] text-ink-soft">
                        The Let It Go Team
                    </p>
                    <div className="w-10 h-px bg-gradient-to-r from-transparent via-pink to-transparent"></div>
                </div>
            </motion.div>
        </section>
    );
}
