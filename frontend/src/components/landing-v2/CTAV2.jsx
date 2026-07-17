import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";
import { useAudience, listAudiences, getAudienceMeta, setAudience } from "@/components/landing/audienceStore";
import { Section, GradientHeadline, StatusBadge, PrimaryButton, GlassCard } from "@/components/ds";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PRIMARY = ["kids", "individual", "team", "professional", "watch"];

export default function CTAV2() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [audience] = useAudience();
    const meta = audience ? getAudienceMeta(audience) : null;
    const all = listAudiences();
    const isSubAudience = audience && !PRIMARY.includes(audience);

    const submit = async (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Enter a valid email to join the waitlist.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API}/waitlist`, {
                email,
                audience: audience || null,
                source: "cta",
            });
            const audienceLabel = meta ? ` · ${meta.label.replace(" beta", "")}` : "";
            toast.success(`You're on the founding list${audienceLabel}.`, {
                description: data.email_sent
                    ? "Confirmation email is on its way."
                    : `Saved. We'll be in touch at ${email}.`,
            });
            setEmail("");
        } catch (err) {
            toast.error("Something went wrong.", {
                description:
                    err?.response?.data?.detail?.toString() ||
                    "Network or server error.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Section id="cta" size="lg" data-testid="cta-section">
            <GlassCard padding="none" radius="lg" className="overflow-hidden">
                <div className="relative p-8 md:p-16 lg:p-24">
                    <div aria-hidden="true" className="lg-ambient opacity-90" />

                    <div className="relative max-w-3xl">
                        <StatusBadge tone="cyan" className="mb-10">
                            Founding · Cohort Open
                        </StatusBadge>
                        <GradientHeadline
                            as="h2"
                            size="xl"
                            data-testid="cta-headline"
                        >
                            Let the noise settle.
                            <br />
                            <span className="lg-gradient-text italic">
                                Let it go.
                            </span>
                        </GradientHeadline>
                        <p className="mt-8 text-lg md:text-xl text-lg-ink-soft max-w-xl leading-relaxed">
                            Reserve your seat in the founding cohort. First access to
                            every horizon. Your price, locked for life.
                        </p>

                        {/* Audience picker */}
                        <div className="mt-10">
                            <p className="lg-eyebrow text-lg-ink-muted mb-4">
                                I&apos;m joining as
                            </p>
                            <div
                                className="flex flex-wrap gap-2"
                                data-testid="cta-audience-picker"
                            >
                                {all.map((a) => {
                                    const isPrimary = PRIMARY.includes(a.key);
                                    const isSelected = audience === a.key;
                                    if (!isPrimary && !isSelected) return null;
                                    return (
                                        <button
                                            type="button"
                                            key={a.key}
                                            onClick={() =>
                                                setAudience(isSelected ? null : a.key)
                                            }
                                            data-testid={`cta-audience-${a.key}`}
                                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-medium transition-all ${
                                                isSelected
                                                    ? "bg-white/10 text-lg-ink border border-white/25"
                                                    : "bg-white/[0.03] text-lg-ink-soft border border-white/10 hover:text-lg-ink hover:border-white/20"
                                            }`}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="inline-block w-1.5 h-1.5 rounded-full"
                                                style={{ background: a.color }}
                                            />
                                            {a.label.replace(" beta", "")}
                                        </button>
                                    );
                                })}
                            </div>
                            {isSubAudience && (
                                <p
                                    data-testid="cta-audience-detail"
                                    className="mt-3 text-xs text-lg-ink-soft"
                                >
                                    Specialist track:{" "}
                                    <span className="text-lg-ink">
                                        {meta.label.replace(" beta", "")}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Form */}
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
                                className="flex-1 rounded-full bg-white/[0.05] border border-white/12 text-lg-ink placeholder:text-lg-ink-muted px-6 py-4 outline-none focus:bg-white/[0.08] focus:border-lg-violet transition-colors text-[15px]"
                            />
                            <PrimaryButton
                                type="submit"
                                loading={loading}
                                loadingText="Reserving…"
                                data-testid="cta-submit-button"
                                size="lg"
                            >
                                Join waitlist
                            </PrimaryButton>
                        </form>

                        <p className="mt-6 text-xs text-lg-ink-muted max-w-md">
                            One email. No spam. No noise. Unsubscribe with a single
                            tap. Your data never leaves the ecosystem.
                        </p>
                    </div>
                </div>
            </GlassCard>
        </Section>
    );
}
