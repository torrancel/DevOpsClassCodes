import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import InfinityGlow from "@/components/landing/InfinityGlow";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AuthCallback() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const hash = window.location.hash || "";
        const m = hash.match(/session_id=([^&]+)/);
        if (!m) {
            navigate("/", { replace: true });
            return;
        }
        const session_id = m[1];

        (async () => {
            try {
                const { data } = await axios.post(
                    `${API}/auth/session`,
                    { session_id },
                    { withCredentials: true }
                );
                setUser(data);
                // Strip the fragment and go to the app
                window.history.replaceState(null, "", "/app");
                navigate("/app", { replace: true, state: { user: data } });
            } catch (e) {
                navigate("/", { replace: true });
            }
        })();
    }, [navigate, setUser]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-bg text-ink">
            <div className="flex flex-col items-center gap-4">
                <InfinityGlow size={48} className="animate-breath" />
                <p className="text-sm text-ink-soft">Letting you in quietly…</p>
            </div>
        </main>
    );
}
