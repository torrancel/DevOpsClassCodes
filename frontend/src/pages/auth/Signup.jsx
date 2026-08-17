import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "@/pages/auth/AuthShell";
import { PrimaryButton, SecondaryButton } from "@/components/ds";
import { FieldEmail, FieldPassword, ErrorBanner, Divider } from "@/pages/auth/Login";
import { useAuth } from "@/contexts/AuthContext";

export default function Signup() {
    const { register, login: googleLogin } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setError("");
        if (!form.email.trim() || !form.password) {
            setError("Enter your email and choose a password.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setSubmitting(true);
        try {
            await register({
                email: form.email.trim().toLowerCase(),
                password: form.password,
                name: form.name.trim() || undefined,
            });
            toast.success("Welcome. Your seat is saved.");
            navigate("/app", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthShell
            eyebrow="Create account"
            title={<>Begin your <span className="lg-gradient-text italic">practice</span>.</>}
            subtitle="One quiet email. One password. Your ecosystem opens today."
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        data-testid="signup-goto-login"
                        className="text-lg-ink underline underline-offset-4 decoration-white/30 hover:decoration-white"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} noValidate data-testid="signup-form" className="space-y-5">
                <label className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-lg-ink-soft font-medium">
                        Name (optional)
                    </span>
                    <div className="relative">
                        <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-lg-violet" />
                        <input
                            type="text"
                            autoComplete="name"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            data-testid="signup-name"
                            placeholder="Your first name"
                            maxLength={120}
                            className="lg-input pl-11 w-full"
                        />
                    </div>
                </label>

                <FieldEmail
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    testid="signup-email"
                    autoFocus
                />

                <FieldPassword
                    value={form.password}
                    onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                    testid="signup-password"
                    autoComplete="new-password"
                    hint="At least 8 characters."
                />

                {error && <ErrorBanner message={error} testid="signup-error" />}

                <PrimaryButton
                    type="submit"
                    loading={submitting}
                    loadingText="Creating account…"
                    data-testid="signup-submit"
                    size="lg"
                    icon={null}
                    className="w-full"
                >
                    Create account
                </PrimaryButton>

                <p className="text-[11px] text-lg-ink-muted leading-relaxed">
                    By continuing you agree to our{" "}
                    <Link to="/terms" className="underline underline-offset-4 hover:text-lg-ink">Terms</Link>{" "}and{" "}
                    <Link to="/privacy" className="underline underline-offset-4 hover:text-lg-ink">Privacy Policy</Link>.
                </p>
            </form>

            <Divider />

            <SecondaryButton
                type="button"
                onClick={googleLogin}
                data-testid="signup-google"
                size="md"
                icon={null}
                className="w-full justify-center"
            >
                Continue with Google
            </SecondaryButton>
        </AuthShell>
    );
}
