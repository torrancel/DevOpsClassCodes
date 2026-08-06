import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { X, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/ds";
import { track, EVENTS } from "@/lib/analytics";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MODE_META = {
    "early-access": {
        source: "early_access",
        analyticsEvent: EVENTS.EARLY_ACCESS_SUBMIT,
        showOrg: false,
        showMessage: false,
        defaultAudience: "individual",
        i18nKey: "earlyAccess",
    },
    partnership: {
        source: "partnership",
        analyticsEvent: EVENTS.PARTNERSHIP_INQUIRY,
        showOrg: true,
        showMessage: true,
        defaultAudience: null,
        i18nKey: "partnership",
    },
};

const AUDIENCE_KEYS = ["individual", "kids", "team", "professional", "watch"];

/**
 * LandingModal — dual-mode modal for landing CTAs.
 * Mode 'early-access' → POST /api/waitlist { email, audience, source }
 * Mode 'partnership' → POST /api/waitlist  { email, audience: null,
 *                                            source: "partnership",
 *                                            application_data: { name, org, message } }
 *
 * Reuses the existing waitlist endpoint — no backend changes needed.
 * Fires analytics on successful submission via lib/analytics.
 */
export default function LandingModal({ open, mode = "early-access", onClose }) {
    const { t } = useTranslation();
    const cfg = MODE_META[mode] || MODE_META["early-access"];
    const modeKey = cfg.i18nKey;
    const mountedAtRef = useRef(Date.now());
    const [form, setForm] = useState({
        name: "",
        email: "",
        organization: "",
        message: "",
        audience: cfg.defaultAudience || "individual",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [state, setState] = useState("idle"); // idle | success

    // Reset when opened or mode changes
    useEffect(() => {
        if (open) {
            mountedAtRef.current = Date.now();
            setState("idle");
            setErrors({});
            setForm((f) => ({
                ...f,
                audience: cfg.defaultAudience || f.audience,
            }));
        }
    }, [open, mode]);

    // Escape to close, lock body scroll
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    const set = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((prev) => ({ ...prev, [k]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = t("v2Landing.modal.errorEmailReq");
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t("v2Landing.modal.errorEmailInvalid");
        if (cfg.showMessage && !form.message.trim())
            e.message = t("v2Landing.modal.errorMessageReq");
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async (ev) => {
        ev.preventDefault();
        if (submitting) return;
        if (!validate()) return;
        setSubmitting(true);
        try {
            const payload = {
                email: form.email.trim().toLowerCase(),
                audience: mode === "early-access" ? form.audience : null,
                source: cfg.source,
            };
            // Partnership mode captures additional structured fields so the
            // founder actually sees the user's name/org/message in the admin view.
            if (mode === "partnership") {
                payload.application_data = {
                    name: form.name.trim(),
                    organization: form.organization.trim(),
                    message: form.message.trim(),
                };
            }
            await axios.post(`${API}/waitlist`, payload);

            // Fire analytics — includes contextual metadata for segmentation.
            track(cfg.analyticsEvent, {
                mode,
                source: cfg.source,
                audience: payload.audience,
                has_org: Boolean(form.organization.trim()),
            });

            setState("success");
            toast.success(t(`v2Landing.modal.${modeKey}.successTitle`));
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                t("v2Landing.modal.genericError");
            toast.error(t("v2Landing.modal.errorTitle"), { description: msg });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            data-testid={`landing-modal-${mode}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="landing-modal-title"
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-[rgba(5,5,7,0.78)] backdrop-blur-md px-3 sm:px-4"
            onClick={(e) => e.target === e.currentTarget && onClose?.()}
        >
            <div className="relative w-full sm:max-w-md lg-panel lg-panel-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    data-testid="landing-modal-close"
                    className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-lg-ink-soft hover:text-lg-ink hover:bg-white/5 transition-colors"
                >
                    <X size={16} />
                </button>

                {state === "success" ? (
                    <div data-testid="landing-modal-success" className="py-4 flex flex-col items-center text-center">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                            style={{
                                background: "linear-gradient(135deg,#21D4FD,#8B4DFF,#FF3CAC)",
                                boxShadow: "0 0 50px rgba(139,77,255,0.5)",
                            }}
                        >
                            <CheckCircle2 size={26} className="text-white" strokeWidth={2} />
                        </div>
                        <h3 className="text-2xl font-semibold text-lg-ink tracking-[-0.02em]">
                            {t(`v2Landing.modal.${modeKey}.successTitle`)}
                        </h3>
                        <p className="mt-3 text-lg-ink-soft max-w-sm leading-relaxed">
                            {t(`v2Landing.modal.${modeKey}.successBody`)}
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-8 text-sm text-lg-ink-soft hover:text-lg-ink underline underline-offset-4"
                        >
                            {t("v2Landing.modal.close")}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={submit} noValidate className="space-y-4">
                        <div>
                            <p className="lg-eyebrow lg-gradient-text mb-2">
                                {t(`v2Landing.modal.${modeKey}.kicker`)}
                            </p>
                            <h3
                                id="landing-modal-title"
                                className="text-2xl sm:text-[26px] font-semibold text-lg-ink tracking-[-0.02em]"
                            >
                                {t(`v2Landing.modal.${modeKey}.title`)}
                            </h3>
                            <p className="mt-2 text-sm text-lg-ink-soft">
                                {t(`v2Landing.modal.${modeKey}.subtitle`)}
                            </p>
                        </div>

                        {cfg.showMessage && (
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] uppercase tracking-[0.28em] text-lg-ink-soft font-medium">
                                    {t("v2Landing.modal.labelName")}
                                </span>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={set("name")}
                                    autoComplete="name"
                                    maxLength={200}
                                    className="lg-input"
                                    data-testid="landing-modal-name"
                                />
                            </label>
                        )}

                        <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase tracking-[0.28em] text-lg-ink-soft font-medium">
                                {t("v2Landing.modal.labelEmail")} <span className="text-lg-magenta">*</span>
                            </span>
                            <div className="relative">
                                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-lg-violet" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={set("email")}
                                    autoFocus
                                    required
                                    autoComplete="email"
                                    aria-invalid={Boolean(errors.email)}
                                    className="lg-input pl-11"
                                    data-testid="landing-modal-email"
                                    placeholder="you@quietmail.com"
                                />
                            </div>
                            {errors.email && (
                                <span className="text-[12px] text-[#FF6B6B]">{errors.email}</span>
                            )}
                        </label>

                        {mode === "early-access" && (
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] uppercase tracking-[0.28em] text-lg-ink-soft font-medium">
                                    {t("v2Landing.modal.labelJoiningAs")}
                                </span>
                                <select
                                    value={form.audience}
                                    onChange={set("audience")}
                                    className="lg-input appearance-none cursor-pointer"
                                    data-testid="landing-modal-audience"
                                >
                                    {AUDIENCE_KEYS.map((k) => (
                                        <option key={k} value={k}>
                                            {t(`v2Landing.modal.audiences.${k}`)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}

                        {cfg.showOrg && (
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] uppercase tracking-[0.28em] text-lg-ink-soft font-medium">
                                    {t("v2Landing.modal.labelOrganization")}
                                </span>
                                <input
                                    type="text"
                                    value={form.organization}
                                    onChange={set("organization")}
                                    autoComplete="organization"
                                    maxLength={200}
                                    className="lg-input"
                                    data-testid="landing-modal-organization"
                                />
                            </label>
                        )}

                        {cfg.showMessage && (
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[10px] uppercase tracking-[0.28em] text-lg-ink-soft font-medium">
                                    {t("v2Landing.modal.labelMessage")} <span className="text-lg-magenta">*</span>
                                </span>
                                <textarea
                                    value={form.message}
                                    onChange={set("message")}
                                    rows={3}
                                    maxLength={2000}
                                    aria-invalid={Boolean(errors.message)}
                                    className="lg-input resize-none"
                                    data-testid="landing-modal-message"
                                    placeholder={t("v2Landing.modal.messagePlaceholder")}
                                />
                                {errors.message && (
                                    <span className="text-[12px] text-[#FF6B6B]">{errors.message}</span>
                                )}
                            </label>
                        )}

                        <PrimaryButton
                            type="submit"
                            loading={submitting}
                            loadingText={t("v2Landing.modal.sending")}
                            data-testid="landing-modal-submit"
                            size="md"
                            icon={null}
                            className="w-full mt-2"
                        >
                            {t(`v2Landing.modal.${modeKey}.submit`)}
                        </PrimaryButton>
                        <p className="text-[11px] text-lg-ink-muted">
                            {t("v2Landing.modal.privacyNote")}
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
