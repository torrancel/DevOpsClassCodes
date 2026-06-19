import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ChevronLeft, KeyRound, Mail, Check, X, Copy, Sparkles } from "lucide-react";
import InfinityGlow from "@/components/landing/InfinityGlow";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "letitgo_admin_token";

export default function AdminBeta() {
    const [token, setToken] = useState(() => (typeof window !== "undefined" ? sessionStorage.getItem(TOKEN_KEY) || "" : ""));
    const [draftToken, setDraftToken] = useState("");
    const [stats, setStats] = useState(null);
    const [apps, setApps] = useState([]);
    const [codes, setCodes] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mintCount, setMintCount] = useState(5);
    const [mintLabel, setMintLabel] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteName, setInviteName] = useState("");

    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [s, a, c, f] = await Promise.all([
                axios.get(`${API}/admin/beta/stats`, { headers }),
                axios.get(`${API}/admin/beta/applications`, { headers }),
                axios.get(`${API}/admin/beta/codes`, { headers }),
                axios.get(`${API}/admin/beta/feedback`, { headers }),
            ]);
            setStats(s.data);
            setApps(a.data.applications || []);
            setCodes(c.data.codes || []);
            setFeedback(f.data.feedback || []);
        } catch (e) {
            if (e?.response?.status === 401 || e?.response?.status === 403) {
                sessionStorage.removeItem(TOKEN_KEY);
                setToken("");
                toast.error("Invalid admin token.");
            } else {
                toast.error("Could not load data.");
            }
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const saveToken = (e) => {
        e.preventDefault();
        if (!draftToken.trim()) return;
        sessionStorage.setItem(TOKEN_KEY, draftToken.trim());
        setToken(draftToken.trim());
    };

    const mintCodes = async () => {
        try {
            const { data } = await axios.post(
                `${API}/admin/beta/codes`,
                { count: Number(mintCount), max_uses: 1, label: mintLabel || null },
                { headers }
            );
            toast.success(`${data.codes.length} code(s) minted.`);
            setMintLabel("");
            fetchAll();
        } catch {
            toast.error("Mint failed.");
        }
    };

    const approve = async (id) => {
        try {
            const { data } = await axios.post(`${API}/admin/beta/applications/${id}/approve`, {}, { headers });
            toast.success(`Approved · code ${data.code}${data.email_sent ? " · emailed" : ""}`);
            fetchAll();
        } catch {
            toast.error("Approve failed.");
        }
    };

    const deny = async (id) => {
        if (!window.confirm("Deny this application?")) return;
        try {
            await axios.post(`${API}/admin/beta/applications/${id}/deny`, {}, { headers });
            toast.success("Denied.");
            fetchAll();
        } catch {
            toast.error("Deny failed.");
        }
    };

    const invite = async () => {
        if (!inviteEmail) {
            toast.error("Email required.");
            return;
        }
        try {
            const { data } = await axios.post(
                `${API}/admin/beta/invite`,
                { email: inviteEmail, name: inviteName || "friend" },
                { headers }
            );
            toast.success(`Code ${data.code} ${data.email_sent ? "emailed" : "minted (email failed)"}.`);
            setInviteEmail("");
            setInviteName("");
            fetchAll();
        } catch {
            toast.error("Invite failed.");
        }
    };

    const copy = (text) => {
        try {
            navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard.");
        } catch {
            // ignore
        }
    };

    if (!token) {
        return (
            <main className="min-h-screen bg-bg text-ink font-sans flex items-center justify-center px-6">
                <form onSubmit={saveToken} className="w-full max-w-md gradient-border p-8 space-y-4" data-testid="admin-beta-token-form">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text">Admin · beta</p>
                    <h1 className="font-display text-3xl">Enter admin token</h1>
                    <input
                        type="password"
                        value={draftToken}
                        onChange={(e) => setDraftToken(e.target.value)}
                        placeholder="ADMIN_TOKEN"
                        data-testid="admin-beta-token-input"
                        className="w-full rounded-2xl bg-white/[0.04] border border-white/15 text-ink px-5 py-3.5 outline-none focus:bg-white/[0.08] focus:border-violet/60"
                    />
                    <button
                        type="submit"
                        data-testid="admin-beta-token-submit"
                        className="btn-glow w-full rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white py-3 text-sm font-medium"
                    >
                        Unlock
                    </button>
                    <Link to="/admin/analytics" className="block text-center text-xs text-ink-soft hover:text-ink">
                        Go to /admin/analytics →
                    </Link>
                </form>
            </main>
        );
    }

    return (
        <main data-testid="admin-beta-page" className="min-h-screen bg-bg text-ink font-sans">
            <header className="border-b border-white/10 backdrop-blur-xl bg-bg/70 sticky top-0 z-40">
                <div className="px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <ChevronLeft size={16} className="text-ink-soft group-hover:text-ink" />
                        <InfinityGlow size={26} />
                        <span className="font-display text-lg tracking-tight">
                            Let It Go <span className="gradient-text font-sans text-xs align-top">AI</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/admin/analytics" className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink">
                            Analytics →
                        </Link>
                        <button
                            onClick={() => {
                                sessionStorage.removeItem(TOKEN_KEY);
                                setToken("");
                            }}
                            data-testid="admin-beta-logout"
                            className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
                        >
                            Lock
                        </button>
                    </div>
                </div>
            </header>

            <section className="px-6 md:px-12 lg:px-20 py-10 max-w-7xl mx-auto space-y-10">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-3 flex items-center gap-2">
                        <Sparkles size={12} className="text-pink" /> Beta program
                    </p>
                    <h1 className="font-display text-4xl md:text-5xl tracking-tight">
                        Cohort control room.
                    </h1>
                </div>

                {/* Stats */}
                <div data-testid="admin-beta-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Active testers", value: stats?.total_testers ?? "—" },
                        { label: "Codes / redeemed", value: `${stats?.redeemed_codes ?? 0}/${stats?.total_codes ?? 0}` },
                        { label: "Pending apps", value: stats?.applications_pending ?? "—" },
                        { label: "Feedback total", value: stats?.feedback_total ?? "—" },
                    ].map((s, i) => (
                        <div key={i} className="gradient-border p-5">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-2">{s.label}</p>
                            <p className="font-display text-4xl">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Mint codes + Invite by email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="gradient-border p-6" data-testid="admin-beta-mint">
                        <div className="flex items-center gap-2 mb-4">
                            <KeyRound size={14} className="text-violet" />
                            <h2 className="font-display text-xl">Mint codes</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <input
                                type="number"
                                min={1}
                                max={200}
                                value={mintCount}
                                onChange={(e) => setMintCount(e.target.value)}
                                data-testid="admin-beta-mint-count"
                                className="w-24 rounded-2xl bg-white/[0.04] border border-white/15 text-ink px-4 py-2.5 outline-none focus:border-violet/60"
                            />
                            <input
                                type="text"
                                placeholder="Label (optional)"
                                value={mintLabel}
                                onChange={(e) => setMintLabel(e.target.value)}
                                data-testid="admin-beta-mint-label"
                                className="flex-1 min-w-[180px] rounded-2xl bg-white/[0.04] border border-white/15 text-ink px-4 py-2.5 outline-none focus:border-violet/60"
                            />
                            <button
                                onClick={mintCodes}
                                data-testid="admin-beta-mint-submit"
                                className="btn-glow rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-5 py-2.5 text-sm font-medium"
                            >
                                Mint
                            </button>
                        </div>
                    </div>

                    <div className="gradient-border p-6" data-testid="admin-beta-invite">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail size={14} className="text-pink" />
                            <h2 className="font-display text-xl">Invite by email</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <input
                                type="email"
                                placeholder="email@domain.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                data-testid="admin-beta-invite-email"
                                className="flex-1 min-w-[200px] rounded-2xl bg-white/[0.04] border border-white/15 text-ink px-4 py-2.5 outline-none focus:border-violet/60"
                            />
                            <input
                                type="text"
                                placeholder="Name (optional)"
                                value={inviteName}
                                onChange={(e) => setInviteName(e.target.value)}
                                data-testid="admin-beta-invite-name"
                                className="w-40 rounded-2xl bg-white/[0.04] border border-white/15 text-ink px-4 py-2.5 outline-none focus:border-violet/60"
                            />
                            <button
                                onClick={invite}
                                data-testid="admin-beta-invite-submit"
                                className="btn-glow rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-5 py-2.5 text-sm font-medium"
                            >
                                Send invite
                            </button>
                        </div>
                    </div>
                </div>

                {/* Applications */}
                <div data-testid="admin-beta-applications">
                    <h2 className="font-display text-2xl mb-4">
                        Applications <span className="text-ink-soft text-sm">({apps.length})</span>
                    </h2>
                    {apps.length === 0 ? (
                        <p className="text-sm text-ink-soft">No applications yet.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-white/10">
                            <table className="w-full text-sm">
                                <thead className="bg-white/[0.03] text-ink-soft text-xs uppercase tracking-[0.18em]">
                                    <tr>
                                        <th className="px-4 py-3 text-left">When</th>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Role</th>
                                        <th className="px-4 py-3 text-left">Why</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apps.map((a) => (
                                        <tr key={a.id} className="border-t border-white/5" data-testid={`admin-beta-app-${a.id}`}>
                                            <td className="px-4 py-3 text-ink-soft whitespace-nowrap">{a.created_at?.slice(0, 10)}</td>
                                            <td className="px-4 py-3">{a.name}</td>
                                            <td className="px-4 py-3 text-ink-soft">{a.email}</td>
                                            <td className="px-4 py-3 text-ink-soft">{a.role || "—"}</td>
                                            <td className="px-4 py-3 max-w-xs truncate" title={a.why}>{a.why || "—"}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs uppercase tracking-[0.18em] ${
                                                    a.status === "approved" ? "text-blue" :
                                                    a.status === "denied" ? "text-pink" :
                                                    "text-ink-soft"
                                                }`}>
                                                    {a.status}
                                                    {a.code && ` · ${a.code}`}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {a.status === "pending" ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => approve(a.id)}
                                                            data-testid={`admin-beta-approve-${a.id}`}
                                                            className="rounded-full bg-blue/20 hover:bg-blue/30 text-blue px-3 py-1.5 text-xs inline-flex items-center gap-1"
                                                        >
                                                            <Check size={12} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => deny(a.id)}
                                                            data-testid={`admin-beta-deny-${a.id}`}
                                                            className="rounded-full bg-pink/20 hover:bg-pink/30 text-pink px-3 py-1.5 text-xs inline-flex items-center gap-1"
                                                        >
                                                            <X size={12} /> Deny
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-ink-soft">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Codes */}
                <div data-testid="admin-beta-codes">
                    <h2 className="font-display text-2xl mb-4">
                        Codes <span className="text-ink-soft text-sm">({codes.length})</span>
                    </h2>
                    {codes.length === 0 ? (
                        <p className="text-sm text-ink-soft">No codes yet.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-white/10">
                            <table className="w-full text-sm">
                                <thead className="bg-white/[0.03] text-ink-soft text-xs uppercase tracking-[0.18em]">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Code</th>
                                        <th className="px-4 py-3 text-left">Label</th>
                                        <th className="px-4 py-3 text-left">Uses</th>
                                        <th className="px-4 py-3 text-left">Created</th>
                                        <th className="px-4 py-3 text-left">Copy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {codes.map((c) => (
                                        <tr key={c.code} className="border-t border-white/5">
                                            <td className="px-4 py-3 font-mono tracking-wider">{c.code}</td>
                                            <td className="px-4 py-3 text-ink-soft">{c.label || "—"}</td>
                                            <td className="px-4 py-3 text-ink-soft">{c.uses}/{c.max_uses}</td>
                                            <td className="px-4 py-3 text-ink-soft">{c.created_at?.slice(0, 10)}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => copy(c.code)}
                                                    aria-label="Copy"
                                                    className="rounded-full bg-white/5 hover:bg-white/10 p-1.5"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Feedback */}
                <div data-testid="admin-beta-feedback">
                    <h2 className="font-display text-2xl mb-4">
                        Feedback <span className="text-ink-soft text-sm">({feedback.length})</span>
                    </h2>
                    {feedback.length === 0 ? (
                        <p className="text-sm text-ink-soft">No feedback yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {feedback.map((f) => (
                                <div key={f.id} className="gradient-border p-5" data-testid={`admin-beta-feedback-${f.id}`}>
                                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] uppercase tracking-[0.25em] ${
                                                f.category === "bug" ? "text-orange" :
                                                f.category === "idea" ? "text-blue" :
                                                f.category === "praise" ? "text-pink" :
                                                "text-violet"
                                            }`}>
                                                {f.category || "other"}
                                            </span>
                                            {f.rating ? (
                                                <span className="text-xs text-ink-soft">{f.rating}/5</span>
                                            ) : null}
                                            <span className="text-xs text-ink-soft">· {f.email}</span>
                                        </div>
                                        <span className="text-xs text-ink-soft">{f.created_at?.slice(0, 16).replace("T", " ")}</span>
                                    </div>
                                    <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{f.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {loading && <p className="text-center text-xs text-ink-soft">Loading…</p>}
            </section>
        </main>
    );
}
