import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { MessageSquarePlus, X, Send } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CATEGORIES = [
    { value: "bug", label: "Bug", color: "text-orange" },
    { value: "idea", label: "Idea", color: "text-blue" },
    { value: "praise", label: "Praise", color: "text-pink" },
    { value: "other", label: "Other", color: "text-violet" },
];

/**
 * Floating feedback widget for beta testers.
 * Visible only when wrapped after a beta-tester check by the parent.
 */
export default function BetaFeedbackWidget() {
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState("idea");
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            toast.error("Add a few words first.");
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(
                `${API}/beta/feedback`,
                { category, rating: rating || null, message: message.trim() },
                { withCredentials: true }
            );
            toast.success("Thank you — we read every one.");
            setMessage("");
            setRating(0);
            setCategory("idea");
            setOpen(false);
        } catch {
            toast.error("Couldn't send. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                data-testid="beta-feedback-trigger"
                aria-label="Send beta feedback"
                className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-4 py-3 text-xs font-medium shadow-[0_20px_60px_-15px_rgba(138,77,255,0.5)] hover:scale-[1.03] transition-transform"
            >
                <MessageSquarePlus size={14} />
                Feedback
            </button>

            {open && (
                <div
                    data-testid="beta-feedback-modal"
                    className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-bg/70 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setOpen(false)}
                >
                    <form
                        onSubmit={submit}
                        className="relative w-full md:max-w-lg bg-bg-soft border border-white/15 rounded-t-3xl md:rounded-3xl p-7 md:p-8 space-y-5 max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            data-testid="beta-feedback-close"
                            aria-label="Close"
                            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-white/5 transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] gradient-text mb-2">Beta feedback</p>
                            <h3 className="font-display text-2xl md:text-3xl tracking-tight">
                                What did you find?
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-2" data-testid="beta-feedback-categories">
                            {CATEGORIES.map((c) => (
                                <button
                                    type="button"
                                    key={c.value}
                                    onClick={() => setCategory(c.value)}
                                    data-testid={`beta-feedback-cat-${c.value}`}
                                    className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.18em] border transition-colors ${
                                        category === c.value
                                            ? "bg-white/10 border-violet/60 text-ink"
                                            : "bg-transparent border-white/10 text-ink-soft hover:text-ink"
                                    }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft mb-2">How does it feel?</p>
                            <div className="flex gap-2" data-testid="beta-feedback-rating">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        type="button"
                                        key={n}
                                        onClick={() => setRating(n === rating ? 0 : n)}
                                        data-testid={`beta-feedback-rating-${n}`}
                                        className={`w-10 h-10 rounded-full border text-sm font-medium transition-colors ${
                                            rating >= n
                                                ? "bg-gradient-to-br from-blue/40 to-pink/40 border-violet/60 text-ink"
                                                : "bg-transparent border-white/10 text-ink-soft hover:text-ink"
                                        }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <textarea
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="The thing that surprised you, broke, delighted, or confused you…"
                                data-testid="beta-feedback-message"
                                autoFocus
                                className="w-full rounded-2xl bg-white/[0.04] border border-white/15 text-ink placeholder:text-ink-soft/60 px-5 py-3.5 outline-none focus:bg-white/[0.08] focus:border-violet/60 transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            data-testid="beta-feedback-submit"
                            className="btn-glow inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-5 py-3 text-sm font-medium transition-all disabled:opacity-60"
                        >
                            <Send size={13} />
                            {submitting ? "Sending…" : "Send to the team"}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
