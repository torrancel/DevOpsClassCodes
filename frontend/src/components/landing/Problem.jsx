import { motion } from "framer-motion";

export default function Problem() {
    return (
        <section
            data-testid="problem-section"
            className="bg-bg-soft px-6 md:px-12 lg:px-24 py-24 md:py-40"
        >
            <div className="grid grid-cols-12 gap-6 md:gap-12 items-start">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="col-span-12 md:col-span-5"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-forest mb-6">
                        Why now
                    </p>
                    <h2
                        data-testid="problem-headline"
                        className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight text-ink"
                    >
                        We taught machines
                        <br />
                        to <em className="text-forest">think</em>.
                        <br />
                        We forgot
                        <br />
                        to teach them
                        <br />
                        to <em className="text-clay">feel</em>.
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="col-span-12 md:col-span-4 md:col-start-7 space-y-8 pt-8 md:pt-32"
                >
                    <p className="text-lg text-ink-soft leading-relaxed">
                        Cognitive intelligence raced ahead. Emotional intelligence
                        stayed analog — locked in books, therapy rooms, and a few
                        good managers.
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-line">
                        <div>
                            <p className="font-serif text-5xl text-forest">71%</p>
                            <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mt-2">
                                of conflicts at work are emotional, not factual.
                            </p>
                        </div>
                        <div>
                            <p className="font-serif text-5xl text-forest">0</p>
                            <p className="text-xs uppercase tracking-[0.15em] text-ink-soft mt-2">
                                Operating systems built for the inner life. Until now.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="col-span-12 md:col-span-3 md:col-start-10 mt-8 md:mt-0"
                >
                    <div className="relative h-[420px] md:h-[520px] rounded-3xl overflow-hidden border border-line">
                        <img
                            src="https://images.pexels.com/photos/8100072/pexels-photo-8100072.jpeg"
                            alt="Contemplative listener"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
