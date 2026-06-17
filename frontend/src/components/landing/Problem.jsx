import { motion } from "framer-motion";

export default function Problem() {
    return (
        <section
            data-testid="problem-section"
            className="relative px-6 md:px-12 lg:px-20 py-24 md:py-40 overflow-hidden"
        >
            {/* Aurora wash */}
            <div className="absolute inset-0 aurora opacity-60 pointer-events-none"></div>

            <div className="relative grid grid-cols-12 gap-6 md:gap-12 items-start">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-7"
                >
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                        Why now
                    </p>
                    <h2
                        data-testid="problem-headline"
                        className="font-display text-4xl md:text-7xl leading-[1.02] tracking-tight text-ink"
                    >
                        We taught machines to <em className="gradient-text">think</em>.
                        <br />
                        We forgot to teach <span className="text-pink">ourselves</span>
                        <br />
                        to <em className="gradient-text">feel</em> our way through them.
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="col-span-12 md:col-span-5 space-y-8 pt-2 md:pt-24"
                >
                    <p className="text-lg text-ink-soft leading-relaxed">
                        Cognitive intelligence raced ahead. Emotional intelligence
                        stayed analog — locked in books, therapy rooms, and a few good
                        managers. Let It Go closes that gap.
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                        <div>
                            <p className="font-display text-5xl gradient-text">71%</p>
                            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft mt-2">
                                of conflicts are emotional, not factual.
                            </p>
                        </div>
                        <div>
                            <p className="font-display text-5xl gradient-text">0</p>
                            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft mt-2">
                                Operating systems built for the inner life. Until now.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
