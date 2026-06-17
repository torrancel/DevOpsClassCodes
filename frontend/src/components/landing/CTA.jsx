import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export default function CTA() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email.");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        toast.success("You're on the list. We'll write quietly.", {
            description: `Saved ${email} to the Let It Go waitlist.`,
        });
        setEmail("");
        setLoading(false);
    };

    return (
        <section
            id="cta"
            data-testid="cta-section"
            className="px-6 md:px-12 lg:px-20 py-20 md:py-32"
        >
            <div
                className="relative rounded-[2rem] px-6 md:px-16 py-20 md:py-32 overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, #0B0613 0%, #1A0930 45%, #2A1140 100%)",
                    border: "1px solid rgba(255,255,255,0.12)",
                }}
            >
                <div className="absolute -right-32 -top-32 w-[28rem] h-[28rem] rounded-full bg-pink/30 blur-3xl"></div>
                <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-blue/30 blur-3xl"></div>
                <div className="absolute inset-0 stars opacity-70 pointer-events-none"></div>

                <div className="relative max-w-3xl">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-8">
                        Join the evolution
                    </p>
                    <h2
                        data-testid="cta-headline"
                        className="font-display text-4xl md:text-7xl leading-[0.95] tracking-tight text-ink"
                    >
                        Be among the
                        <br />
                        first to <em className="gradient-text">let it go</em>.
                    </h2>
                    <p className="mt-8 text-lg md:text-xl text-ink-soft max-w-xl">
                        Closed beta opens in small, quiet cohorts. Drop your email and
                        we'll write — once, and only when there's something real.
                    </p>

                    <form
                        onSubmit={submit}
                        noValidate
                        data-testid="cta-form"
                        className="mt-12 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@quietmail.com"
                            data-testid="cta-email-input"
                            className="flex-1 rounded-full bg-white/[0.06] border border-white/15 text-ink placeholder:text-ink-soft/60 px-6 py-4 outline-none focus:bg-white/[0.1] focus:border-violet/60 transition-colors font-sans"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="cta-submit-button"
                            className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-4 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60"
                        >
                            {loading ? "Listening..." : "Join the waitlist"}
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </button>
                    </form>

                    <p className="mt-6 text-xs text-ink-soft">
                        No marketing. No drip campaigns. Just one email when your cohort opens.
                    </p>
                </div>
            </div>
        </section>
    );
}
