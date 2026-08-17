import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

/**
 * Convert FastAPI error `detail` (which may be a string, array of {msg}, or object)
 * into a single string safe to render.
 */
function formatApiErrorDetail(detail) {
    if (detail == null) return "Something went wrong. Please try again.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail))
        return detail
            .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
            .filter(Boolean)
            .join(" ");
    if (detail && typeof detail.msg === "string") return detail.msg;
    return String(detail);
}

export { formatApiErrorDetail };

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API}/auth/me`);
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // CRITICAL: If returning from OAuth callback, skip the /me check.
        // AuthCallback will exchange the session_id and establish the session first.
        if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
            setLoading(false);
            return;
        }
        checkAuth();
    }, [checkAuth]);

    // Google OAuth entrypoint (existing).
    const login = () => {
        // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
        const redirectUrl = window.location.origin + "/app";
        window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    };

    // Email/password login. Throws with a string message on failure.
    const loginWithPassword = async (email, password) => {
        try {
            const { data } = await axios.post(`${API}/auth/login`, { email, password });
            setUser(data);
            return data;
        } catch (e) {
            throw new Error(formatApiErrorDetail(e?.response?.data?.detail) || e.message);
        }
    };

    const register = async ({ email, password, name }) => {
        try {
            const { data } = await axios.post(`${API}/auth/register`, { email, password, name });
            setUser(data);
            return data;
        } catch (e) {
            throw new Error(formatApiErrorDetail(e?.response?.data?.detail) || e.message);
        }
    };

    const forgotPassword = async (email) => {
        try {
            await axios.post(`${API}/auth/forgot-password`, { email });
        } catch (e) {
            throw new Error(formatApiErrorDetail(e?.response?.data?.detail) || e.message);
        }
    };

    const resetPassword = async (token, newPassword) => {
        try {
            const { data } = await axios.post(`${API}/auth/reset-password`, {
                token,
                new_password: newPassword,
            });
            setUser(data);
            return data;
        } catch (e) {
            throw new Error(formatApiErrorDetail(e?.response?.data?.detail) || e.message);
        }
    };

    const setPassword = async (password) => {
        try {
            await axios.post(`${API}/auth/set-password`, { password });
        } catch (e) {
            throw new Error(formatApiErrorDetail(e?.response?.data?.detail) || e.message);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API}/auth/logout`);
        } catch {}
        setUser(null);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                loginWithPassword,
                register,
                forgotPassword,
                resetPassword,
                setPassword,
                logout,
                refresh: checkAuth,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
