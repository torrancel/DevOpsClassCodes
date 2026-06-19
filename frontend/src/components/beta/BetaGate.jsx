import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Sparkles, ArrowRight } from "lucide-react";
import { useBeta } from "@/contexts/BetaContext";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Wraps protected app content. If the logged-in user has not redeemed a beta code,
 * shows a quiet gate inviting them to redeem or apply. Otherwise renders children.
 */
export default function BetaGate({ children }) {
    const { user } = useAuth();
    const { betaStatus, loading } = useBeta();

    if (loading || betaStatus === null) {
        return (
            <div
                data-testid="beta-gate-loading"
                className="min-h-screen flex items-center justify-center bg-bg text-ink-soft"
            >
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-pink animate-breath" />
                    <span className="text-sm uppercase tracking-[0.3em]">listening…</span>
                </div>
            </div>
        );
    }

    if (betaStatus.is_beta_tester) {
        return children;
    }

    const pending = betaStatus.application?.status === "pending";
    const denied = betaStatus.application?.status === "denied";

    return (
        <main
            data-testid="beta-gate"
            className="min-h-screen bg-bg text-ink font-sans relative overflow-hidden aurora stars grain flex items-center justify-center px-6 py-24"
        >
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative max-w-xl w-full text-center"
            >
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6 flex items-center justify-center gap-2">
                    <Sparkles size={12} className="text-pink" /> Private beta · invite only
                </p>
                <h1 className="font-display text-4xl md:text-6xl leading-[1] tracking-tight">
                    Hi {user?.name?.split(" ")[0] || "friend"}.
                    <br />
                    <em className="gradient-text">One last step.</em>
                </h1>
                <p className="mt-6 text-base md:text-lg text-ink-soft leading-relaxed">
                    Let It Go is currently in a small invite-only beta. If you have a six-character code,
                    redeem it below to unlock your dashboard.
                </p>

                {pending && (
                    <p data-testid="beta-gate-pending" className="mt-6 text-sm text-blue">
                        Your application is pending review. We&rsquo;ll email you when a seat opens.
                    </p>
                )}
                {denied && (
                    <p data-testid="beta-gate-denied" className="mt-6 text-sm text-pink">
                        Your application wasn&rsquo;t approved this cohort. Reapply for the next one.
                    </p>
                )}

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/beta/redeem"
                        data-testid="beta-gate-redeem"
                        className="btn-glow group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3 text-sm font-medium transition-all"
                    >
                        <KeyRound size={14} />
                        Redeem a code
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                        to="/beta"
                        data-testid="beta-gate-apply"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 text-ink px-6 py-3 text-sm font-medium hover:bg-white/5 transition-colors"
                    >
                        Apply for a seat
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
