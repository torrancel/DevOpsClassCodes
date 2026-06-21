import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Check, ArrowRight, ChevronLeft } from "lucide-react";
import InfinityGlow from "@/components/landing/InfinityGlow";
import { useBeta } from "@/contexts/BetaContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * /pricing/success?session_id=cs_test_...
 * Polls /api/payments/checkout/status/{session_id} every 2s up to ~30s.
 * The backend is idempotent — duplicate polls don't re-grant entitlements.
 */
export default function PricingSuccess() {
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");
    const { refresh: refreshBeta } = useBeta();
    const [status, setStatus] = useState("polling"); // polling | paid | expired | error
    const [snapshot, setSnapshot] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const refreshed = useRef(false);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        let cancelled = false;
        let timeoutId;

        const poll = async (n) => {
            if (cancelled) return;
            try {
                const { data } = await axios.get(`${API}/payments/checkout/status/${sessionId}`);
                if (cancelled) return;
                setSnapshot(data);
                setAttempts(n);

                if (data.payment_status === "paid") {
                    setStatus("paid");
                    if (!refreshed.current) {
                        refreshed.current = true;
                        // Tell BetaContext the entitlement may have flipped.
                        try { refreshBeta(); } catch { /* ignore */ }
                    }
                    return;
                }
                if (data.status === "expired" || data.payment_status === "unpaid_expired") {
                    setStatus("expired");
                    return;
                }
                if (n >= 15) {
                    setStatus("timeout");
                    return;
                }
                timeoutId = setTimeout(() => poll(n + 1), 2000);
            } catch {
                if (cancelled) return;
                if (n >= 15) {
                    setStatus("error");
                    return;
                }
                timeoutId = setTimeout(() => poll(n + 1), 2500);
            }
        };

        poll(0);
        return () => {
            cancelled = true;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [sessionId, refreshBeta]);

    return (
        <main
            data-testid="pricing-success-page"
            className="min-h-screen bg-bg text-ink font-sans relative overflow-hidden aurora stars grain"
        >
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/60 border-b border-white/5">
                <nav className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <ChevronLeft size={18} className="text-ink-soft group-hover:text-ink transition-colors" />
                        <InfinityGlow size={32} />
                        <span className="font-display text-xl tracking-tight">
                            Let It Go <span className="gradient-text font-sans text-sm align-top">AI</span>
                        </span>
                    </Link>
                </nav>
            </header>

            <section className="pt-36 pb-24 px-6 md:px-12 lg:px-20 max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    {status === "polling" && (
                        <div data-testid="pricing-success-polling">
                            <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6">
                                Confirming…
                            </p>
                            <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tight">
                                A quiet moment&hellip;
                            </h1>
                            <p className="mt-6 text-base text-ink-soft">
                                Stripe is confirming your payment. This usually takes a few seconds. Attempt {attempts + 1} of 15.
                            </p>
                            <div className="mt-12 flex items-center gap-3 text-ink-soft">
                                <span className="w-2 h-2 rounded-full bg-pink animate-breath" />
                                <span className="text-sm uppercase tracking-[0.3em]">listening</span>
                            </div>
                        </div>
                    )}

                    {status === "paid" && (
                        <div data-testid="pricing-success-paid">
                            <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6 flex items-center gap-2">
                                <Check size={12} className="text-blue" /> Payment confirmed
                            </p>
                            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
                                You&rsquo;re <em className="gradient-text italic">in</em>.
                            </h1>
                            <p className="mt-8 text-lg text-ink-soft leading-relaxed">
                                Your founding pricing is locked. When public pricing rises, yours stays right here.
                            </p>
                            {snapshot && (
                                <div className="mt-10 gradient-border p-6 text-sm space-y-2">
                                    <div className="flex justify-between text-ink-soft">
                                        <span>Plan</span>
                                        <span className="text-ink">{snapshot.metadata?.tier} · {snapshot.metadata?.mode}</span>
                                    </div>
                                    <div className="flex justify-between text-ink-soft">
                                        <span>Amount</span>
                                        <span className="text-ink font-mono">${snapshot.amount?.toFixed?.(2)} {snapshot.currency?.toUpperCase()}</span>
                                    </div>
                                    {snapshot.metadata?.email && (
                                        <div className="flex justify-between text-ink-soft">
                                            <span>Receipt</span>
                                            <span className="text-ink">{snapshot.metadata.email}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="mt-12 flex flex-wrap gap-3">
                                <Link
                                    to="/app"
                                    data-testid="pricing-success-enter-app"
                                    className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3.5 text-sm font-medium"
                                >
                                    Enter Let It Go
                                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                                </Link>
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/15 text-ink px-6 py-3.5 text-sm font-medium hover:bg-white/5 transition-colors"
                                >
                                    Back to site
                                </Link>
                            </div>
                        </div>
                    )}

                    {(status === "expired" || status === "timeout" || status === "error") && (
                        <div data-testid="pricing-success-error">
                            <p className="text-[11px] uppercase tracking-[0.35em] text-pink mb-6">
                                {status === "expired" ? "Session expired" : status === "timeout" ? "Still confirming" : "Something hiccupped"}
                            </p>
                            <h1 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
                                {status === "timeout"
                                    ? "We&rsquo;ll let you know by email."
                                    : "Let&rsquo;s try again."}
                            </h1>
                            <p className="mt-6 text-base text-ink-soft leading-relaxed">
                                {status === "timeout"
                                    ? "Your payment is still processing. If you completed Stripe, you'll receive a receipt by email shortly — and you'll be unlocked automatically."
                                    : "If your card was charged, please email us and we'll sort it out within minutes."}
                            </p>
                            <div className="mt-10 flex flex-wrap gap-3">
                                <Link to="/#pricing" className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3.5 text-sm font-medium">
                                    Back to pricing
                                </Link>
                            </div>
                        </div>
                    )}
                </motion.div>
            </section>
        </main>
    );
}
