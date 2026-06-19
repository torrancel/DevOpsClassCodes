import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, ChevronLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBeta } from "@/contexts/BetaContext";
import InfinityGlow from "@/components/landing/InfinityGlow";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * `/beta/redeem` — authenticated. User pastes their beta code and unlocks /app.
 * If not logged in, prompts Google sign-in first.
 */
export default function BetaRedeem() {
    const { user, login, loading: authLoading } = useAuth();
    const { betaStatus, refresh } = useBeta();
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const redeem = async (e) => {
        e.preventDefault();
        const c = code.trim().toUpperCase();
        if (c.length < 4) {
            toast.error("Please enter your full beta code.");
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(`${API}/beta/redeem`, { code: c }, { withCredentials: true });
            toast.success("Welcome to the beta. You're in.", {
                description: "Taking you to your dashboard…",
            });
            await refresh();
            setTimeout(() => navigate("/app"), 600);
        } catch (err) {
            const msg = err?.response?.data?.detail || "Could not redeem this code.";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main
            data-testid="beta-redeem-page"
            className="min-h-screen bg-bg text-ink font-sans relative overflow-hidden aurora stars grain"
        >
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg/60 border-b border-white/5">
                <nav className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
                    <Link to="/" data-testid="beta-redeem-home" className="flex items-center gap-3 group">
                        <ChevronLeft size={18} className="text-ink-soft group-hover:text-ink transition-colors" />
                        <InfinityGlow size={32} />
                        <span className="font-display text-xl tracking-tight">
                            Let It Go <span className="gradient-text font-sans text-sm align-top">AI</span>
                        </span>
                    </Link>
                    <Link
                        to="/beta"
                        data-testid="beta-redeem-apply-link"
                        className="text-xs text-ink-soft hover:text-ink uppercase tracking-[0.2em]"
                    >
                        No code? Apply →
                    </Link>
                </nav>
            </header>

            <section className="relative pt-32 pb-24 px-6 md:px-12 lg:px-20 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-6 flex items-center gap-2">
                        <Sparkles size={12} className="text-pink" /> Private beta · invite only
                    </p>
                    <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
                        Welcome{user ? <>, <em className="gradient-text">{user.name?.split(" ")[0]}</em></> : null}.
                    </h1>
                    <p className="mt-6 text-lg text-ink-soft max-w-md leading-relaxed">
                        Paste the six-character code you received by email to unlock your seat.
                    </p>

                    {authLoading ? (
                        <p className="mt-12 text-sm text-ink-soft">…</p>
                    ) : !user ? (
                        <div className="mt-12 gradient-border p-6 max-w-md">
                            <p className="text-sm text-ink-soft mb-4">
                                Sign in with Google first so we can attach the seat to your account.
                            </p>
                            <button
                                type="button"
                                data-testid="beta-redeem-login"
                                onClick={login}
                                className="btn-glow w-full rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white py-3 text-sm font-medium"
                            >
                                Continue with Google
                            </button>
                        </div>
                    ) : betaStatus?.is_beta_tester ? (
                        <div className="mt-12 gradient-border p-6 max-w-md">
                            <p className="font-display text-2xl mb-3">
                                You&rsquo;re already in.
                            </p>
                            <Link
                                to="/app"
                                data-testid="beta-redeem-goto-app"
                                className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-5 py-3 text-sm font-medium"
                            >
                                Go to your dashboard
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    ) : (
                        <form
                            onSubmit={redeem}
                            data-testid="beta-redeem-form"
                            className="mt-12 flex flex-col gap-4 max-w-md"
                        >
                            <div className="relative">
                                <KeyRound size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-violet" />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="ABCDEF"
                                    maxLength={12}
                                    autoFocus
                                    data-testid="beta-redeem-code-input"
                                    className="w-full rounded-full bg-white/[0.06] border border-white/15 text-ink placeholder:text-ink-soft/50 pl-12 pr-6 py-4 outline-none focus:bg-white/[0.1] focus:border-violet/60 transition-colors font-mono tracking-[0.3em] text-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                data-testid="beta-redeem-submit"
                                className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-4 text-sm font-medium transition-all disabled:opacity-60"
                            >
                                {submitting ? "Listening…" : "Redeem & enter"}
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                            </button>
                            {betaStatus?.application?.status === "pending" && (
                                <p className="text-xs text-ink-soft mt-2">
                                    Your application is pending review. We&rsquo;ll email a code soon.
                                </p>
                            )}
                            {betaStatus?.application?.status === "denied" && (
                                <p className="text-xs text-pink mt-2">
                                    Your application was not approved at this time.
                                </p>
                            )}
                        </form>
                    )}
                </motion.div>
            </section>
        </main>
    );
}
