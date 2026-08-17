import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/pages/auth/AuthShell";
import { PrimaryButton } from "@/components/ds";
import { FieldPassword, ErrorBanner } from "@/pages/auth/Login";
import { useAuth } from "@/contexts/AuthContext";

export default function ResetPassword() {
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = useMemo(() => params.get("token") || "", [params]);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setError("");
        if (!token) {
            setError("This reset link is missing its token. Request a new one.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        setSubmitting(true);
        try {
            await resetPassword(token, password);
            toast.success("Password updated. Welcome back.");
            navigate("/app", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthShell
            eyebrow="Reset password"
            title={<>Choose a new <span className="lg-gradient-text italic">password</span>.</>}
            subtitle="Once you save, you'll be signed in automatically."
            footer={
                <Link
                    to="/login"
                    data-testid="reset-back-to-login"
                    className="text-lg-ink underline underline-offset-4 decoration-white/30 hover:decoration-white"
                >
                    Back to sign in
                </Link>
            }
        >
            {!token ? (
                <ErrorBanner
                    testid="reset-missing-token"
                    message={<>Reset link is missing. Request a new one on the <Link to="/forgot-password" className="underline">forgot password</Link> page.</>}
                />
            ) : (
                <form onSubmit={submit} noValidate data-testid="reset-form" className="space-y-5">
                    <FieldPassword
                        value={password}
                        onChange={setPassword}
                        testid="reset-password"
                        autoComplete="new-password"
                        label="New password"
                        hint="At least 8 characters."
                    />
                    <FieldPassword
                        value={confirm}
                        onChange={setConfirm}
                        testid="reset-confirm"
                        autoComplete="new-password"
                        label="Confirm password"
                    />
                    {error && <ErrorBanner message={error} testid="reset-error" />}
                    <PrimaryButton
                        type="submit"
                        loading={submitting}
                        loadingText="Updating…"
                        data-testid="reset-submit"
                        size="lg"
                        icon={null}
                        className="w-full"
                    >
                        Update password
                    </PrimaryButton>
                </form>
            )}
        </AuthShell>
    );
}
