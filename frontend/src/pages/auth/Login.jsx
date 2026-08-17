import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "@/pages/auth/AuthShell";
import { PrimaryButton, SecondaryButton } from "@/components/ds";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
    const { loginWithPassword, login: googleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname || "/app";

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setError("");
        if (!form.email.trim() || !form.password) {
            setError("Enter your email and password.");
            return;
        }
        setSubmitting(true);
        try {
            await loginWithPassword(form.email.trim().toLowerCase(), form.password);
            toast.success("Welcome back.");
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthShell
            eyebrow="Sign in"
            title={<>Welcome <span className="lg-gradient-text italic">back</span>.</>}
            subtitle="Continue your practice. Your ecosystem is waiting."
            footer={
                <>
                    New here?{" "}
                    <Link
                        to="/signup"
                        data-testid="login-goto-signup"
                        className="text-lg-ink underline underline-offset-4 decoration-white/30 hover:decoration-white"
                    >
                        Create an account
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} noValidate data-testid="login-form" className="space-y-5">
                <FieldEmail
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    testid="login-email"
                    autoFocus
                />
                <FieldPassword
                    value={form.password}
                    onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                    testid="login-password"
                />

                <div className="flex justify-end -mt-1">
                    <Link
                        to="/forgot-password"
                        data-testid="login-forgot"
                        className="text-xs text-lg-ink-soft hover:text-lg-ink underline underline-offset-4 decoration-white/20 hover:decoration-white"
                    >
                        Forgot password?
                    </Link>
                </div>

                {error && <ErrorBanner message={error} testid="login-error" />}

                <PrimaryButton
                    type="submit"
                    loading={submitting}
                    loadingText="Signing in…"
                    data-testid="login-submit"
                    size="lg"
                    icon={null}
                    className="w-full"
                >
                    Sign in
                </PrimaryButton>
            </form>

            <Divider />

            <SecondaryButton
                type="button"
                onClick={googleLogin}
                data-testid="login-google"
                size="md"
                icon={null}
                className="w-full justify-center"
            >
                Continue with Google
            </SecondaryButton>
        </AuthShell>
    );
}

/* ────────────────────────────────────────────────────────────── */

export function FieldEmail({ value, onChange, testid, autoFocus, label = "Email" }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.28em] text-lg-ink-soft font-medium">
                {label}
            </span>
            <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-lg-violet" />
                <input
                    type="email"
                    autoComplete="email"
                    required
                    autoFocus={autoFocus}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    data-testid={testid}
                    placeholder="you@quietmail.com"
                    className="lg-input pl-11 w-full"
                />
            </div>
        </label>
    );
}

export function FieldPassword({ value, onChange, testid, autoComplete = "current-password", label = "Password", hint }) {
    return (
        <label className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.28em] text-lg-ink-soft font-medium">
                {label}
            </span>
            <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-lg-violet" />
                <input
                    type="password"
                    autoComplete={autoComplete}
                    required
                    minLength={autoComplete === "new-password" ? 8 : 1}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    data-testid={testid}
                    placeholder={autoComplete === "new-password" ? "at least 8 characters" : "••••••••"}
                    className="lg-input pl-11 w-full"
                />
            </div>
            {hint && <span className="text-[11px] text-lg-ink-muted">{hint}</span>}
        </label>
    );
}

export function ErrorBanner({ message, testid }) {
    return (
        <div
            data-testid={testid}
            role="alert"
            className="flex items-start gap-3 rounded-2xl px-4 py-3 border"
            style={{
                background: "rgba(255,60,60,0.08)",
                borderColor: "rgba(255,60,60,0.35)",
            }}
        >
            <AlertTriangle size={16} className="text-[#FF6B6B] shrink-0 mt-0.5" />
            <p className="text-sm text-lg-ink">{message}</p>
        </div>
    );
}

export function Divider() {
    return (
        <div className="my-8 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-lg-ink-muted">or</span>
            <span className="h-px flex-1 bg-white/[0.08]" />
        </div>
    );
}
