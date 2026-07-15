import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ArrowUpRight, Heart } from "lucide-react";
import InfinityGlow from "@/components/landing/InfinityGlow";
import ShareButtons from "@/components/share/ShareButtons";

/**
 * /founder — long-form founder letter from Torrance Lillie.
 * Single-column reading layout, serif body, generous whitespace.
 */
export default function FounderStory() {
    return (
        <main
            data-testid="founder-story-page"
            className="min-h-screen bg-bg text-ink font-sans"
        >
            {/* Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/60 border-b border-white/5">
                <nav className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
                    <Link
                        to="/"
                        data-testid="founder-back-link"
                        className="flex items-center gap-3 group"
                    >
                        <ChevronLeft size={18} className="text-ink-soft group-hover:text-ink transition-colors" />
                        <InfinityGlow size={32} />
                        <span className="flex flex-col leading-none"><span className="font-display text-xl tracking-tight">Let It Go <span className="gradient-text font-sans text-sm align-top">AI</span></span><span className="text-[8px] md:text-[9px] tracking-[0.35em] gradient-text uppercase mt-1">Emotional Intelligence Ecosystem</span></span>
                    </Link>
                    <Link
                        to="/beta"
                        data-testid="founder-nav-cta"
                        className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink transition-colors"
                    >
                        Apply for the beta →
                    </Link>
                </nav>
            </header>

            {/* Hero */}
            <section
                data-testid="founder-hero"
                className="relative pt-36 pb-16 md:pt-48 md:pb-24 px-6 overflow-hidden stars grain"
            >
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-8">
                            Founder&rsquo;s letter
                        </p>
                        <h1
                            data-testid="founder-headline"
                            className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.98] tracking-tight text-ink"
                        >
                            Why I Built
                            <br />
                            <em className="gradient-text italic">Let It Go AI</em>.
                        </h1>
                        <div className="mt-12 flex items-center gap-4 text-sm text-ink-soft">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue/30 via-violet/30 to-pink/30 border border-white/15 flex items-center justify-center font-display text-lg text-ink">
                                TL
                            </div>
                            <div>
                                <p className="text-ink">Torrance Lillie</p>
                                <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Founder · Let It Go AI</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Body */}
            <article
                data-testid="founder-body"
                className="px-6 pb-24 md:pb-32 font-display"
            >
                <div className="max-w-2xl mx-auto space-y-7 text-lg md:text-xl text-ink/90 leading-[1.75]">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        My name is <span className="text-ink">Torrance Lillie</span>, founder of Let It Go AI.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="font-display italic text-2xl md:text-3xl text-ink leading-[1.4] py-2"
                    >
                        In 2022, my life fell apart.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-7"
                    >
                        <p>
                            I went through a divorce. I lost my trucking business. At the same time,
                            I was diagnosed with Type 2 diabetes and faced serious health challenges.
                            The stress became overwhelming. What started as pressure turned into anxiety,
                            and eventually depression.
                        </p>
                        <p>
                            For the first time in my life, I found myself at my lowest point.
                        </p>
                        <p>
                            I had always been the person others came to for advice. I considered myself
                            strong, resilient, and capable of handling anything life threw at me.
                            But I learned something important: mental and emotional struggles do not discriminate.
                        </p>
                    </motion.div>

                    {/* Pull quote 1 */}
                    <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        data-testid="founder-pullquote-1"
                        className="my-10 md:my-14 px-2 md:px-0"
                    >
                        <div className="border-l-2 border-violet/60 pl-6 md:pl-8">
                            <p className="font-display italic text-2xl md:text-4xl leading-[1.25] gradient-text">
                                If it could happen to me, it could happen to anyone.
                            </p>
                        </div>
                    </motion.blockquote>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-7"
                    >
                        <p>
                            There were moments when I questioned whether life was worth continuing.
                            I felt alone. I felt like I had nowhere to turn. Looking back, maybe it
                            was pride. Maybe it was fear. Maybe I simply didn&rsquo;t know how to ask for help.
                        </p>
                        <p>But I made a decision.</p>
                    </motion.div>

                    {/* Pull quote 2 */}
                    <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        data-testid="founder-pullquote-2"
                        className="my-10 md:my-14"
                    >
                        <p className="font-display italic text-3xl md:text-5xl leading-[1.15] text-ink">
                            I decided to <em className="gradient-text">keep going</em>.
                        </p>
                    </motion.blockquote>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-7"
                    >
                        <p>
                            That decision became the foundation of Let It Go AI.
                        </p>
                        <p>
                            I began asking myself a simple question:
                        </p>
                        <p className="font-display italic text-2xl md:text-3xl text-ink leading-[1.4] pl-6 border-l-2 border-pink/40">
                            &ldquo;What if there was always someone there to help you pause, breathe,
                            reflect, and regain perspective before reaching a breaking point?&rdquo;
                        </p>
                        <p>Let It Go AI was born from that question.</p>
                        <p>
                            We are building the world&rsquo;s first <span className="text-ink">Emotional
                            Intelligence Ecosystem</span> — an intelligent companion designed to help
                            people recognize stress, anxiety, emotional overload, and negative thought
                            patterns before they take control.
                        </p>
                        <p>This isn&rsquo;t about replacing human connection.</p>
                    </motion.div>

                    {/* Pull quote 3 */}
                    <motion.blockquote
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        data-testid="founder-pullquote-3"
                        className="my-10 md:my-14"
                    >
                        <div className="border-l-2 border-blue/60 pl-6 md:pl-8">
                            <p className="font-display italic text-2xl md:text-4xl leading-[1.25] text-ink">
                                It&rsquo;s about making sure no one feels{" "}
                                <em className="gradient-text">completely alone</em>{" "}
                                in their hardest moments.
                            </p>
                        </div>
                    </motion.blockquote>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-7"
                    >
                        <p>
                            Sometimes all a person needs is a reminder to slow down, take a breath,
                            and remember that today&rsquo;s pain does not have to become tomorrow&rsquo;s tragedy.
                        </p>
                    </motion.div>

                    {/* Mission list */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        data-testid="founder-mission"
                        className="my-12 md:my-16"
                    >
                        <p className="text-base text-ink-soft mb-6">My mission is simple:</p>
                        <ul className="space-y-3 font-display text-2xl md:text-3xl text-ink leading-[1.2]">
                            <li className="flex items-start gap-4">
                                <span className="mt-3 inline-block h-px w-8 bg-gradient-to-r from-blue to-violet shrink-0"></span>
                                <span>To help <em className="gradient-text italic">save lives</em>.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-3 inline-block h-px w-8 bg-gradient-to-r from-violet to-pink shrink-0"></span>
                                <span>To help people find <em className="gradient-text italic">hope</em>.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-3 inline-block h-px w-8 bg-gradient-to-r from-pink to-orange shrink-0"></span>
                                <span>To help people build <em className="gradient-text italic">emotional resilience</em>.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="mt-3 inline-block h-px w-8 bg-gradient-to-r from-blue via-violet to-pink shrink-0"></span>
                                <span>
                                    And to remind people that no matter how difficult life becomes,
                                    they can <em className="gradient-text italic">let go</em> of what is
                                    weighing them down and move forward.
                                </span>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="space-y-7"
                    >
                        <p>Because I&rsquo;ve been there.</p>
                        <p>
                            And I don&rsquo;t want anyone else to feel like they have nowhere to turn.
                        </p>
                    </motion.div>

                    {/* Signature */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        data-testid="founder-signature"
                        className="pt-10 md:pt-14 mt-10 border-t border-white/10 flex items-center gap-4"
                    >
                        <Heart size={14} className="text-pink" />
                        <p className="font-display italic text-xl md:text-2xl text-ink">
                            Torrance Lillie
                        </p>
                        <span className="text-xs uppercase tracking-[0.25em] text-ink-soft">Founder</span>
                    </motion.div>

                    {/* Share buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <ShareButtons
                            title="Why I Built Let It Go AI"
                            summary="Torrance Lillie's founder letter behind Let It Go AI — the world's first Emotional Intelligence Ecosystem."
                            quote="In 2022, my life fell apart. I built the thing I wish I'd had."
                        />
                    </motion.div>
                </div>
            </article>

            {/* CTA band */}
            <section
                data-testid="founder-cta"
                className="px-6 md:px-12 lg:px-20 pb-24 md:pb-32"
            >
                <div
                    className="max-w-4xl mx-auto rounded-[2rem] px-6 md:px-14 py-16 md:py-20 relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #0B0613 0%, #1A0930 45%, #2A1140 100%)",
                        border: "1px solid rgba(255,255,255,0.12)",
                    }}
                >
                    <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-pink/30 blur-3xl"></div>
                    <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-blue/30 blur-3xl"></div>

                    <div className="relative">
                        <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                            If this resonated
                        </p>
                        <h2 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-2xl text-ink">
                            You don&rsquo;t have to carry it alone.{" "}
                            <em className="gradient-text">Join the beta.</em>
                        </h2>
                        <p className="mt-6 text-base md:text-lg text-ink-soft max-w-xl leading-relaxed">
                            Cohort 01 is small, intentional, and personally read by Torrance. Apply below — or, if
                            you already have a code, redeem it now.
                        </p>
                        <div className="mt-10 flex flex-wrap gap-3">
                            <Link
                                to="/beta"
                                data-testid="founder-cta-apply"
                                className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3.5 text-sm font-medium transition-all"
                            >
                                Apply for the beta
                                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                            <Link
                                to="/beta/redeem"
                                data-testid="founder-cta-redeem"
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 text-ink px-6 py-3.5 text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                Have a code? Redeem
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 md:px-12 lg:px-20 py-10 border-t border-white/10">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-ink-soft">
                    <div className="flex items-center gap-3">
                        <InfinityGlow size={24} />
                        <span className="font-display text-base text-ink">Let It Go AI</span>
                    </div>
                    <p>
                        © {new Date().getFullYear()} Let It Go AI ·{" "}
                        <Link to="/" className="link-underline">Back to site</Link>
                    </p>
                </div>
            </footer>
        </main>
    );
}
