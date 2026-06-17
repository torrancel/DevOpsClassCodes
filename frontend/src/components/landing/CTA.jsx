import { useState, useEffect } from "react";
import { ArrowUpRight, X, Apple, Smartphone } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAudience, listAudiences, getAudienceMeta, setAudience, setPlatform } from "./audienceStore";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PRIMARY = ["kids", "individual", "team", "professional", "watch"];

export default function CTA() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [audience, , platform] = useAudience();
    const meta = audience ? getAudienceMeta(audience) : null;
    const all = listAudiences();
    const isSubAudience = audience && !PRIMARY.includes(audience);

    // When a sub-audience (doctors/attorneys/teachers/managers) is selected via
    // a card click, smooth-scroll into the form for feedback.
    useEffect(() => {
        if (audience) {
            const el = document.getElementById("cta");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [audience]);

    const submit = async (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API}/waitlist`, {
                email,
                audience: audience || null,
                platform: audience === "watch" ? platform || null : null,
                source: "cta",
            });
            const platformLabel =
                audience === "watch" && platform === "apple" ? " (Apple Watch)" :
                audience === "watch" && platform === "android" ? " (Wear OS)" : "";
            toast.success(
                meta ? `You're on the ${meta.label}${platformLabel} list.` : "You're on the list. We'll write quietly.",
                {
                    description: data.email_sent
                        ? "A quiet confirmation just landed in your inbox."
                        : `Saved ${email}. We'll be in touch.`,
                }
            );
            setEmail("");
        } catch (err) {
            toast.error("Something went wrong. Try again in a moment.", {
                description: err?.response?.data?.detail?.toString() || "Network or server error.",
            });
        } finally {
            setLoading(false);
        }
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

                    {/* Audience picker */}
                    <div className="mt-10">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-3">
                            Joining as
                        </p>
                        <div className="flex flex-wrap gap-2" data-testid="cta-audience-picker">
                            {all.map((a) => {
                                const isPrimary = PRIMARY.includes(a.key);
                                const isSelected = audience === a.key;
                                // Hide sub-audiences unless selected, to keep the picker clean
                                if (!isPrimary && !isSelected) return null;
                                return (
                                    <button
                                        type="button"
                                        key={a.key}
                                        onClick={() => setAudience(isSelected ? null : a.key)}
                                        data-testid={`cta-audience-${a.key}`}
                                        className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all ${
                                            isSelected
                                                ? "bg-white/10 text-ink border border-white/30"
                                                : "bg-white/[0.03] text-ink-soft border border-white/10 hover:text-ink hover:border-white/20"
                                        }`}
                                    >
                                        <span
                                            className="inline-block w-1.5 h-1.5 rounded-full"
                                            style={{ background: a.color }}
                                        />
                                        {a.label.replace(" beta", "")}
                                        {isSelected && <X size={12} className="opacity-70" />}
                                    </button>
                                );
                            })}
                        </div>
                        {isSubAudience && (
                            <p
                                data-testid="cta-audience-detail"
                                className="mt-3 text-xs text-ink-soft"
                            >
                                Specialist mode selected — your confirmation will be tailored to{" "}
                                <span className="text-ink">{meta.label.replace(" beta", "")}</span>.
                            </p>
                        )}

                        {/* Watch platform sub-picker */}
                        {audience === "watch" && (
                            <div className="mt-4" data-testid="cta-platform-picker">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-2">
                                    Your watch
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: "apple", label: "Apple Watch", Icon: Apple },
                                        { key: "android", label: "Wear OS", Icon: Smartphone },
                                    ].map(({ key, label, Icon }) => {
                                        const sel = platform === key;
                                        return (
                                            <button
                                                type="button"
                                                key={key}
                                                onClick={() => setPlatform(sel ? null : key)}
                                                data-testid={`cta-platform-${key}`}
                                                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-all ${
                                                    sel
                                                        ? "bg-white/10 text-ink border border-white/30"
                                                        : "bg-white/[0.03] text-ink-soft border border-white/10 hover:text-ink hover:border-white/20"
                                                }`}
                                            >
                                                <Icon size={12} />
                                                {label}
                                                {sel && <X size={11} className="opacity-70" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                {platform && (
                                    <p
                                        data-testid="cta-platform-detail"
                                        className="mt-2 text-xs text-ink-soft"
                                    >
                                        Tailored for{" "}
                                        <span className="text-ink">
                                            {platform === "apple" ? "Apple Watch · watchOS" : "Wear OS · Galaxy / Pixel"}
                                        </span>
                                        .
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={submit}
                        noValidate
                        data-testid="cta-form"
                        className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl"
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
                        No marketing. No drip campaigns. Just one quiet email when your cohort opens.
                    </p>
                </div>
            </div>
        </section>
    );
}
