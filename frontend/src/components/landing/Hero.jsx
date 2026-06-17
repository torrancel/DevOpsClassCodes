import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section
            id="top"
            data-testid="hero-section"
            className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden grain"
        >
            {/* Floating eyebrow */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-3 mb-10"
            >
                <span className="h-px w-12 bg-forest/40"></span>
                <span
                    data-testid="hero-eyebrow"
                    className="text-xs uppercase tracking-[0.3em] text-forest font-medium"
                >
                    The first of its kind · Est. 2026
                </span>
            </motion.div>

            <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
                {/* Left: Headline */}
                <div className="col-span-12 lg:col-span-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1 }}
                        data-testid="hero-headline"
                        className="font-serif text-[clamp(2.75rem,7vw,7rem)] leading-[0.95] tracking-tight text-ink"
                    >
                        The operating
                        <br />
                        system for
                        <br />
                        <span className="italic text-forest">human emotion</span>
                        <span className="text-clay">.</span>
                    </motion.h1>
                </div>

                {/* Right: subline + CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="col-span-12 lg:col-span-4 lg:pl-8 lg:border-l lg:border-line"
                >
                    <p
                        data-testid="hero-subline"
                        className="text-base md:text-lg text-ink-soft leading-relaxed max-w-md"
                    >
                        Aura OS senses affect, coaches regulation, and mediates communication —
                        so humans and AI can finally meet in the middle.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <a
                            href="#cta"
                            data-testid="hero-primary-cta"
                            className="group inline-flex items-center gap-2 rounded-full bg-forest text-bg px-6 py-3 text-sm font-medium hover:bg-forest-deep transition-all active:scale-[0.98]"
                        >
                            Request Access
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                        <a
                            href="#demo"
                            data-testid="hero-secondary-cta"
                            className="inline-flex items-center gap-2 rounded-full border border-forest/30 text-forest px-6 py-3 text-sm font-medium hover:bg-bg-soft transition-all"
                        >
                            Watch the demo
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Visual band */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="mt-20 md:mt-28 grid grid-cols-12 gap-4 md:gap-6"
            >
                <div className="col-span-12 md:col-span-7 relative h-[360px] md:h-[480px] rounded-3xl overflow-hidden border border-line">
                    <img
                        src="https://images.pexels.com/photos/29390707/pexels-photo-29390707.jpeg"
                        alt="Soft organic forms"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-forest/30 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-bg/80">Sensing</p>
                            <p className="font-serif text-bg text-2xl md:text-3xl mt-1">
                                A new affective layer
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3 rounded-full bg-bg/90 px-4 py-2">
                            <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-clay animate-breath"></span>
                            <span className="text-xs text-ink-soft">Live · 12 signals</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-4 md:gap-6">
                    <div className="relative rounded-3xl bg-forest text-bg p-8 overflow-hidden">
                        <p className="text-xs uppercase tracking-[0.3em] text-bg/60">01 — Modulation</p>
                        <p className="font-serif text-3xl md:text-4xl mt-4 leading-tight">
                            From reactivity
                            <br />
                            to <em className="text-clay not-italic">response</em>.
                        </p>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-clay/20 blur-2xl"></div>
                    </div>
                    <div className="relative rounded-3xl bg-bg-soft p-8 border border-line overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-2 w-2 rounded-full bg-forest"></span>
                            <span className="h-2 w-2 rounded-full bg-clay"></span>
                            <span className="h-2 w-2 rounded-full bg-ink/30"></span>
                        </div>
                        <p className="font-serif text-2xl text-ink leading-snug">
                            "Aura noticed I was tense before I did. It paused the meeting."
                        </p>
                        <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mt-6">
                            — Beta user, Day 9
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
