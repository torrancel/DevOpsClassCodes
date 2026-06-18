import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import InfinityGlow from "@/components/landing/InfinityGlow";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-bg text-ink">
                <div className="flex flex-col items-center gap-4">
                    <InfinityGlow size={40} className="animate-breath" />
                    <p className="text-xs text-ink-soft uppercase tracking-[0.3em]">Listening…</p>
                </div>
            </main>
        );
    }
    if (!user) return <Navigate to="/" state={{ from: location }} replace />;
    return children;
}
