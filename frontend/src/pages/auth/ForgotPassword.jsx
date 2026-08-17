import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import AuthShell from "@/pages/auth/AuthShell";
import { PrimaryButton } from "@/components/ds";
import { FieldEmail, ErrorBanner } from "@/pages/auth/Login";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [state, setState] = useState("idle"); // idle | sent
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setError("");
        if (!email.trim()) {
            setError("Enter your email so we can send the link.");
            return;
        }
        setSubmitting(true);
        try {
            await forgotPassword(email.trim().toLowerCase());
            setState("sent");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (state === "sent") {
        return (
            <AuthShell
                eyebrow="Check your inbox"
                title={<>Sent, if that account <span className="lg-gradient-text italic">exists</span>.</>}
                subtitle="If we found a matching account, a reset link is on its way. It expires in one hour."
                footer={
                    <Link
                        to="/login"
                        data-testid="forgot-back-to-login"
                        className="text-lg-ink underline underline-offset-4 decoration-white/30 hover:decoration-white"
                    >
                        Back to sign in
                    </Link>
                }
            >
                <div className="flex flex-col items-center text-center py-4">
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                        style={{
                            background: "linear-gradient(135deg,#21D4FD,#8B4DFF,#FF3CAC)",
                            boxShadow: "0 0 50px rgba(139,77,255,0.5)",
                        }}
                    >
                        <CheckCircle2 size={26} className="text-white" strokeWidth={2} />
                    </div>
                    <p className="text-sm text-lg-ink-soft leading-relaxed">
                        Didn't get anything? Give it a minute, then check spam. If you signed up with Google, use the "Continue with Google" button on{" "}
                        <Link to="/login" className="text-lg-ink underline underline-offset-4">sign in</Link>.
                    </p>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell
            eyebrow="Forgot password"
            title={<>Reset your <span className="lg-gradient-text italic">password</span>.</>}
            subtitle="Enter the email you signed up with. We'll send you a one-hour reset link."
            footer={
                <>
                    Remembered it?{" "}
                    <Link
                        to="/login"
                        data-testid="forgot-goto-login"
                        className="text-lg-ink underline underline-offset-4 decoration-white/30 hover:decoration-white"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} noValidate data-testid="forgot-form" className="space-y-5">
                <FieldEmail value={email} onChange={setEmail} testid="forgot-email" autoFocus />
                {error && <ErrorBanner message={error} testid="forgot-error" />}
                <PrimaryButton
                    type="submit"
                    loading={submitting}
                    loadingText="Sending link…"
                    data-testid="forgot-submit"
                    size="lg"
                    icon={null}
                    className="w-full"
                >
                    Send reset link
                </PrimaryButton>
            </form>
        </AuthShell>
    );
}
