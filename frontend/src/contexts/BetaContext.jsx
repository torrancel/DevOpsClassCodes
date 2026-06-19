import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BetaContext = createContext(null);

/**
 * Tracks whether the logged-in user has redeemed a beta code.
 * Mounted inside AuthProvider so it can react to login/logout.
 */
export function BetaProvider({ children }) {
    const { user } = useAuth();
    const [betaStatus, setBetaStatus] = useState(null); // null = unknown, {is_beta_tester, joined_at, application}
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!user) {
            setBetaStatus(null);
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.get(`${API}/beta/status`, { withCredentials: true });
            setBetaStatus(data);
        } catch {
            setBetaStatus({ is_beta_tester: false, joined_at: null, application: null });
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <BetaContext.Provider value={{ betaStatus, loading, refresh }}>
            {children}
        </BetaContext.Provider>
    );
}

export function useBeta() {
    return useContext(BetaContext) || { betaStatus: null, loading: false, refresh: () => {} };
}
