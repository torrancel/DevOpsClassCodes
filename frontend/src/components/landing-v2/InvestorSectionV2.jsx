import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
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
import { track, EVENTS } from "@/lib/analytics";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COLUMN_META = [
    { tone: "cyan", live: true, i18nEyebrow: "col1Eyebrow", i18nItems: "col1Items" },
    { tone: "violet", i18nEyebrow: "col2Eyebrow", i18nItems: "col2Items" },
    { tone: "magenta", i18nEyebrow: "col3Eyebrow", i18nItems: "col3Items" },
];

const INVESTOR_TYPE_KEYS = ["vc", "angel", "family_office", "strategic", "advisor", "other"];

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
    const { t } = useTranslation();
    const COLUMNS = COLUMN_META.map((m) => ({
        eyebrow: t(`v2Landing.investor.${m.i18nEyebrow}`),
        tone: m.tone,
        live: m.live,
        items: t(`v2Landing.investor.${m.i18nItems}`, { returnObjects: true }),
    }));

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
                        {t("v2Landing.investor.eyebrow")}
                    </StatusBadge>
                    <GradientHeadline
                        as="h2"
                        size="lg"
                        data-testid="investor-headline"
                    >
                        {t("v2Landing.investor.headlinePre")}
                        <br />
                        {t("v2Landing.investor.headlineTo")}{" "}
                        <span className="lg-gradient-text italic">
                            {t("v2Landing.investor.headlineGradient")}
                        </span>
                        {t("v2Landing.investor.headlinePost")}
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
                    {t("v2Landing.investor.privacy")}
                </p>
            </div>
        </Section>
    );
}

/* ────────────────────────────────────────────────────────────── */

function InvestorForm({ reduce }) {
    const { t } = useTranslation();
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
        if (!form.name.trim()) e.name = t("v2Landing.investor.errorName");
        else if (form.name.length > 200) e.name = t("v2Landing.investor.errorNameLong");
        if (!form.email.trim()) e.email = t("v2Landing.investor.errorEmailReq");
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t("v2Landing.investor.errorEmailInvalid");
        if (form.organization.length > 200) e.organization = t("v2Landing.investor.errorOrgLong");
        if (!form.message.trim()) e.message = t("v2Landing.investor.errorMessageReq");
        else if (form.message.trim().length < 10) e.message = t("v2Landing.investor.errorMessageShort");
        else if (form.message.length > 5000) e.message = t("v2Landing.investor.errorMessageLong");
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
                track(EVENTS.INVESTOR_INQUIRY, {
                    investor_type: form.investor_type,
                    has_org: Boolean(form.organization.trim()),
                });
                setState("success");
                setForm({
                    name: "",
                    email: "",
                    organization: "",
                    investor_type: "vc",
                    message: "",
                    website: "",
                });
                toast.success(t("v2Landing.investor.toastSuccessTitle"), {
                    description: t("v2Landing.investor.toastSuccessBody"),
                });
            } else {
                throw new Error("Unexpected response");
            }
        } catch (err) {
            const detail = err?.response?.data?.detail;
            const msg =
                typeof detail === "string"
                    ? detail
                    : t("v2Landing.investor.genericError");
            setErrorMsg(msg);
            setState("error");
            toast.error(t("v2Landing.investor.toastErrorTitle"), { description: msg });
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
                        {t("v2Landing.investor.formEyebrow")}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-lg-ink">
                        {t("v2Landing.investor.formTitle")}
                    </h3>
                    <p className="mt-3 text-lg-ink-soft max-w-xl">
                        {t("v2Landing.investor.formSub")}
                    </p>
                </div>
                <SecondaryButton
                    as="a"
                    href="mailto:founders@letitgoai.com?subject=Investor%20Follow-up"
                    data-testid="investor-secondary-cta"
                    size="md"
                >
                    {t("v2Landing.investor.contactFounder")}
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
                            {t("v2Landing.investor.successTitle")}
                        </h4>
                        <p className="mt-3 text-lg-ink-soft max-w-lg leading-relaxed">
                            {t("v2Landing.investor.successBody")}
                        </p>
                        <button
                            type="button"
                            onClick={() => setState("idle")}
                            data-testid="investor-form-reset"
                            className="mt-8 text-sm text-lg-ink-soft hover:text-lg-ink underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
                        >
                            {t("v2Landing.investor.sendAnother")}
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={submit}
                        noValidate
                        data-testid="investor-form"
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                        <FieldWrap label={t("v2Landing.investor.labelName")} required error={errors.name}>
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

                        <FieldWrap label={t("v2Landing.investor.labelEmail")} required error={errors.email}>
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

                        <FieldWrap label={t("v2Landing.investor.labelOrganization")} error={errors.organization}>
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

                        <FieldWrap label={t("v2Landing.investor.labelInvestorType")} required>
                            <div className="relative">
                                <select
                                    value={form.investor_type}
                                    onChange={set("investor_type")}
                                    data-testid="investor-type"
                                    className="lg-input appearance-none pr-10 cursor-pointer"
                                >
                                    {INVESTOR_TYPE_KEYS.map((k) => (
                                        <option key={k} value={k}>
                                            {t(`v2Landing.investor.types.${k}`)}
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
                            label={t("v2Landing.investor.labelMessage")}
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
                                placeholder={t("v2Landing.investor.messagePlaceholder")}
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
                                {t("v2Landing.investor.consent")}
                            </p>
                            <PrimaryButton
                                type="submit"
                                loading={submitting}
                                loadingText={t("v2Landing.investor.sending")}
                                data-testid="investor-submit"
                                size="lg"
                                icon={null}
                            >
                                {t("v2Landing.investor.submitCta")}
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
