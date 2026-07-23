import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Check, Circle, CheckCircle2, AlertTriangle } from "lucide-react";
import {
    Section,
    GradientHeadline,
    GlassCard,
    StatusBadge,
    PrimaryButton,
    SecondaryButton,
} from "@/components/ds";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COLUMNS = [
    {
        eyebrow: "Today",
        tone: "cyan",
        live: true,
        items: [
            "Functional web MVP",
            "Brand and product foundation",
            "Initial commercialization strategy",
            "Founder-led mission",
        ],
    },
    {
        eyebrow: "Next Milestones",
        tone: "violet",
        items: [
            "Beta-user growth",
            "Product analytics",
            "Apple Watch prototype",
            "AI personalization",
            "Early enterprise conversations",
        ],
    },
    {
        eyebrow: "Capital Enables",
        tone: "magenta",
        items: [
            "Product engineering",
            "AI development",
            "Security and privacy",
            "Customer acquisition",
            "Technical and clinical advisors",
            "Pilot programs",
        ],
    },
];

const INVESTOR_TYPES = [
    { v: "vc", l: "Venture Capital" },
    { v: "angel", l: "Angel" },
    { v: "family_office", l: "Family Office" },
    { v: "strategic", l: "Strategic / Corp" },
    { v: "advisor", l: "Advisor" },
    { v: "other", l: "Other" },
];

const TONE_DOT = {
    cyan: { c: "#21D4FD", ring: "rgba(33,212,253,0.55)" },
    violet: { c: "#8B4DFF", ring: "rgba(139,77,255,0.55)" },
    magenta: { c: "#FF3CAC", ring: "rgba(255,60,172,0.55)" },
};

/**
 * InvestorSectionV2 — investor overview + inquiry form.
 *
 * Form posts to POST /api/investor-inquiries (secure, admin-only readback via
 * GET /api/admin/investor-inquiries). Anti-spam: hidden honeypot field
 * "website" + dwell-time check (rejects submissions < 2s after mount).
 */
export default function InvestorSectionV2() {
    const reduce = useReducedMotion();

    return (
        <Section
            id="investors"
            size="lg"
            data-testid="investor-section"
            className="overflow-hidden"
        >
            <div aria-hidden="true" className="lg-ambient opacity-60" />

            <div className="relative">
                {/* Header */}
                <div className="mb-14 md:mb-20 max-w-3xl">
                    <StatusBadge tone="magenta" className="mb-8">
                        Investors
                    </StatusBadge>
                    <GradientHeadline
                        as="h2"
                        size="lg"
                        data-testid="investor-headline"
                    >
                        From Functional MVP
                        <br />
                        to{" "}
                        <span className="lg-gradient-text italic">
                            Scalable Platform
                        </span>
                        .
                    </GradientHeadline>
                </div>

                {/* Three columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                    {COLUMNS.map((c, i) => (
                        <motion.div
                            key={c.eyebrow}
                            initial={reduce ? false : { opacity: 0, y: 24 }}
                            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.65, delay: i * 0.08 }}
                            data-testid={`investor-col-${i}`}
                        >
                            <GlassCard
                                padding="lg"
                                radius="lg"
                                accent={c.tone}
                                className="h-full flex flex-col"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <span
                                        aria-hidden="true"
                                        className="inline-block h-1.5 w-1.5 rounded-full"
                                        style={{
                                            background: TONE_DOT[c.tone].c,
                                            boxShadow: `0 0 10px ${TONE_DOT[c.tone].ring}`,
                                        }}
                                    />
                                    <span className="lg-eyebrow text-lg-ink-muted uppercase tracking-[0.28em]">
                                        {c.eyebrow}
                                    </span>
                                </div>
                                <ul className="space-y-3 flex-1">
                                    {c.items.map((item) => (
                                        <li
                                            key={item}
                                            className={`flex items-start gap-3 text-[15px] ${
                                                c.live
                                                    ? "text-lg-ink"
                                                    : "text-lg-ink-soft"
                                            }`}
                                        >
                                            {c.live ? (
                                                <span
                                                    className="mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg,#21D4FD,#8B4DFF)",
                                                    }}
                                                >
                                                    <Check
                                                        size={10}
                                                        strokeWidth={3}
                                                        className="text-white"
                                                    />
                                                </span>
                                            ) : (
                                                <span
                                                    className="mt-1 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                                                    style={{
                                                        background:
                                                            "rgba(255,255,255,0.04)",
                                                        border: `1px solid ${TONE_DOT[c.tone].c}`,
                                                    }}
                                                >
                                                    <Circle
                                                        size={4}
                                                        strokeWidth={0}
                                                        fill={TONE_DOT[c.tone].c}
                                                    />
                                                </span>
                                            )}
                                            <span className="leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Inquiry form */}
                <InvestorForm reduce={reduce} />

                {/* Confidentiality note */}
                <p
                    data-testid="investor-privacy"
                    className="mt-8 text-xs text-lg-ink-muted max-w-3xl leading-relaxed"
                >
                    Submissions are received privately by the founder and are never
                    published or shared externally. This is not an offer to sell
                    securities and does not constitute a solicitation.
                </p>
            </div>
        </Section>
    );
}

/* ────────────────────────────────────────────────────────────── */

function InvestorForm({ reduce }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        organization: "",
        investor_type: "vc",
        message: "",
        website: "", // honeypot — must remain empty
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [state, setState] = useState("idle"); // idle | success | error
    const [errorMsg, setErrorMsg] = useState("");
    const mountedAtRef = useRef(Date.now());

    useEffect(() => {
        mountedAtRef.current = Date.now();
    }, []);

    const set = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((prev) => ({ ...prev, [k]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Please share your name.";
        else if (form.name.length > 200) e.name = "Name is too long.";
        if (!form.email.trim()) e.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "That doesn't look like a valid email.";
        if (form.organization.length > 200) e.organization = "Organization name is too long.";
        if (!form.message.trim()) e.message = "Please share a short message.";
        else if (form.message.trim().length < 10) e.message = "A little more context, please (10+ characters).";
        else if (form.message.length > 5000) e.message = "Message is too long (max 5,000 characters).";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async (ev) => {
        ev.preventDefault();
        if (submitting) return;
        setErrorMsg("");
        if (!validate()) return;
        setSubmitting(true);
        try {
            const submitted_after_ms = Date.now() - mountedAtRef.current;
            const { data } = await axios.post(`${API}/investor-inquiries`, {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                organization: form.organization.trim() || null,
                investor_type: form.investor_type,
                message: form.message.trim(),
                website: form.website, // honeypot — will be empty for humans
                submitted_after_ms,
            });
            if (data?.success) {
                setState("success");
                setForm({
                    name: "",
                    email: "",
                    organization: "",
                    investor_type: "vc",
                    message: "",
                    website: "",
                });
                toast.success("Inquiry received.", {
                    description: "The founder will be in touch soon.",
                });
            } else {
                throw new Error("Unexpected response");
            }
        } catch (err) {
            const detail = err?.response?.data?.detail;
            const msg =
                typeof detail === "string"
                    ? detail
                    : "Something went wrong. Please try again in a moment.";
            setErrorMsg(msg);
            setState("error");
            toast.error("Couldn't send inquiry.", { description: msg });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            id="investor-form"
            className="mt-16 md:mt-24"
            data-testid="investor-form-block"
        >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                <div>
                    <p className="lg-eyebrow lg-gradient-text mb-3">
                        Get in touch
                    </p>
                    <h3 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-lg-ink">
                        Investor inquiry
                    </h3>
                    <p className="mt-3 text-lg-ink-soft max-w-xl">
                        Share a short note and the founder will respond directly with
                        the deck.
                    </p>
                </div>
                <SecondaryButton
                    as="a"
                    href="mailto:founders@letitgo.ai?subject=Investor%20Follow-up"
                    data-testid="investor-secondary-cta"
                    size="md"
                >
                    Contact the Founder
                </SecondaryButton>
            </div>

            <GlassCard padding="lg" radius="lg">
                {state === "success" ? (
                    <div
                        data-testid="investor-form-success"
                        className="py-6 md:py-10 flex flex-col items-center text-center"
                    >
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                            style={{
                                background:
                                    "linear-gradient(135deg,#21D4FD,#8B4DFF,#FF3CAC)",
                                boxShadow: "0 0 50px rgba(139,77,255,0.5)",
                            }}
                        >
                            <CheckCircle2 size={26} className="text-white" strokeWidth={2} />
                        </div>
                        <h4 className="text-2xl font-semibold text-lg-ink tracking-[-0.02em]">
                            Inquiry received.
                        </h4>
                        <p className="mt-3 text-lg-ink-soft max-w-lg leading-relaxed">
                            Thank you for reaching out. The founder will respond directly
                            with the deck and next steps. Your submission is stored
                            privately and never shared publicly.
                        </p>
                        <button
                            type="button"
                            onClick={() => setState("idle")}
                            data-testid="investor-form-reset"
                            className="mt-8 text-sm text-lg-ink-soft hover:text-lg-ink underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
                        >
                            Send another
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={submit}
                        noValidate
                        data-testid="investor-form"
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                        <FieldWrap label="Name" required error={errors.name}>
                            <input
                                type="text"
                                value={form.name}
                                onChange={set("name")}
                                data-testid="investor-name"
                                required
                                autoComplete="name"
                                maxLength={200}
                                aria-invalid={Boolean(errors.name)}
                                className="lg-input"
                            />
                        </FieldWrap>

                        <FieldWrap label="Email" required error={errors.email}>
                            <input
                                type="email"
                                value={form.email}
                                onChange={set("email")}
                                data-testid="investor-email"
                                required
                                autoComplete="email"
                                aria-invalid={Boolean(errors.email)}
                                className="lg-input"
                            />
                        </FieldWrap>

                        <FieldWrap label="Organization" error={errors.organization}>
                            <input
                                type="text"
                                value={form.organization}
                                onChange={set("organization")}
                                data-testid="investor-organization"
                                autoComplete="organization"
                                maxLength={200}
                                className="lg-input"
                            />
                        </FieldWrap>

                        <FieldWrap label="Investor type" required>
                            <div className="relative">
                                <select
                                    value={form.investor_type}
                                    onChange={set("investor_type")}
                                    data-testid="investor-type"
                                    className="lg-input appearance-none pr-10 cursor-pointer"
                                >
                                    {INVESTOR_TYPES.map((t) => (
                                        <option key={t.v} value={t.v}>
                                            {t.l}
                                        </option>
                                    ))}
                                </select>
                                <span
                                    aria-hidden="true"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-lg-ink-muted text-xs pointer-events-none"
                                >
                                    ▾
                                </span>
                            </div>
                        </FieldWrap>

                        <FieldWrap
                            label="Message"
                            required
                            error={errors.message}
                            className="md:col-span-2"
                        >
                            <textarea
                                value={form.message}
                                onChange={set("message")}
                                data-testid="investor-message"
                                rows={5}
                                required
                                maxLength={5000}
                                aria-invalid={Boolean(errors.message)}
                                className="lg-input resize-none"
                                placeholder="A short note about your interest, thesis, or timing…"
                            />
                            <p className="mt-1.5 text-[11px] text-lg-ink-muted text-right">
                                {form.message.length} / 5000
                            </p>
                        </FieldWrap>

                        {/* Honeypot — visually hidden, screen-reader-hidden, unreachable via tab */}
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                left: "-10000px",
                                top: "auto",
                                width: 1,
                                height: 1,
                                overflow: "hidden",
                            }}
                        >
                            <label>
                                Website (leave blank)
                                <input
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={form.website}
                                    onChange={set("website")}
                                    data-testid="investor-honeypot"
                                />
                            </label>
                        </div>

                        {/* Error banner */}
                        {state === "error" && errorMsg && (
                            <div
                                data-testid="investor-form-error"
                                className="md:col-span-2 flex items-start gap-3 rounded-2xl px-4 py-3 border"
                                style={{
                                    background: "rgba(255,60,60,0.08)",
                                    borderColor: "rgba(255,60,60,0.35)",
                                }}
                            >
                                <AlertTriangle size={16} className="text-[#FF6B6B] shrink-0 mt-0.5" />
                                <p className="text-sm text-lg-ink">{errorMsg}</p>
                            </div>
                        )}

                        <div className="md:col-span-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                            <p className="text-[11px] text-lg-ink-muted max-w-md">
                                By submitting, you agree that the founder may contact
                                you at the email provided. Submissions are stored
                                privately and never shared publicly.
                            </p>
                            <PrimaryButton
                                type="submit"
                                loading={submitting}
                                loadingText="Sending…"
                                data-testid="investor-submit"
                                size="lg"
                                icon={null}
                            >
                                Request Investor Deck
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </GlassCard>
        </div>
    );
}

function FieldWrap({ label, required, error, className = "", children }) {
    return (
        <label className={`flex flex-col gap-2 ${className}`}>
            <span className="text-[11px] uppercase tracking-[0.28em] text-lg-ink-soft font-medium">
                {label}
                {required && <span className="text-lg-magenta ml-1">*</span>}
            </span>
            {children}
            {error && (
                <span className="text-[12px] text-[#FF6B6B]" role="alert">
                    {error}
                </span>
            )}
        </label>
    );
}
