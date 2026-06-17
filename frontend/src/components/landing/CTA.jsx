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
        // Local-only — store in memory; no backend integration requested.
        await new Promise((r) => setTimeout(r, 600));
        toast.success("You're on the list. We'll write quietly.", {
            description: `Saved ${email} to the Aura waitlist.`,
        });
        setEmail("");
        setLoading(false);
    };

    return (
        <section
            id="cta"
            data-testid="cta-section"
            className="px-6 md:px-12 lg:px-24 py-20 md:py-32"
        >
            <div className="relative rounded-3xl bg-forest text-bg px-6 md:px-16 py-20 md:py-32 overflow-hidden">
                <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-clay/20 blur-3xl"></div>
                <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-bg/10 blur-3xl"></div>

                <div className="relative max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.3em] text-clay mb-8">
                        Join the evolution
                    </p>
                    <h2
                        data-testid="cta-headline"
                        className="font-serif text-4xl md:text-7xl leading-[0.95] tracking-tight"
                    >
                        Be among the
                        <br />
                        first <em className="text-clay">feelers</em>.
                    </h2>
                    <p className="mt-8 text-lg md:text-xl text-bg/80 max-w-xl">
                        Closed beta opens in small, quiet cohorts. Drop your email and
                        we'll write — once, and only when there's something real.
                    </p>

                    <form
                        onSubmit={submit}
                        data-testid="cta-form"
                        className="mt-12 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@quietmail.com"
                            data-testid="cta-email-input"
                            className="flex-1 rounded-full bg-bg/10 border border-bg/20 text-bg placeholder:text-bg/50 px-6 py-4 outline-none focus:bg-bg/15 focus:border-clay transition-colors font-sans"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="cta-submit-button"
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-bg text-forest hover:bg-clay hover:text-ink px-6 py-4 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60"
                        >
                            {loading ? "Listening..." : "Join the waitlist"}
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </button>
                    </form>

                    <p className="mt-6 text-xs text-bg/50">
                        No marketing. No drip campaigns. Just one email when your cohort opens.
                    </p>
                </div>
            </div>
        </section>
    );
}
