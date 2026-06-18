import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Plus, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import InfinityGlow from "@/components/landing/InfinityGlow";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SIGNALS = ["calm", "focus", "stress", "anxiety", "depression", "warmth"];
const COLORS = { calm: "#5E8BFF", focus: "#8A4DFF", stress: "#FF8A5C", anxiety: "#FF6FD3", depression: "#6B5BFF", warmth: "#FFB36F" };

export default function AppDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [checkins, setCheckins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`${API}/checkins?days=30`, { withCredentials: true });
                setCheckins(data);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const latest = checkins[0];
    const timeline = [...checkins].reverse().map((c) => ({
        day: new Date(c.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        eq: c.eq,
    }));

    return (
        <main data-testid="app-dashboard" className="min-h-screen bg-bg text-ink font-sans">
            {/* Top bar */}
            <header className="border-b border-white/10 backdrop-blur-xl bg-bg/70 sticky top-0 z-40">
                <div className="px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
                    <Link to="/app" className="flex items-center gap-3">
                        <InfinityGlow size={28} />
                        <span className="font-display text-lg tracking-tight">
                            Let It Go <span className="gradient-text font-sans text-xs align-top">AI</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        {user?.picture && (
                            <img src={user.picture} alt="" className="w-7 h-7 rounded-full border border-white/15" />
                        )}
                        <span className="hidden sm:inline text-sm text-ink-soft">{user?.name}</span>
                        <button
                            onClick={logout}
                            data-testid="app-logout"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 hover:bg-white/5 px-3 py-1.5 text-xs text-ink-soft hover:text-ink transition-all"
                        >
                            <LogOut size={12} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <section className="px-6 md:px-12 lg:px-20 pt-14 pb-10">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-4">Your inner life</p>
                <h1 className="font-display text-4xl md:text-6xl tracking-tight">
                    Good to see you, <em className="gradient-text">{user?.name?.split(" ")[0] || "friend"}</em>.
                </h1>

                <div className="mt-10 grid grid-cols-12 gap-4 md:gap-6">
                    {/* Today's EQ */}
                    <div data-testid="dashboard-eq" className="col-span-12 md:col-span-5 gradient-border p-8">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-2">
                            {latest ? "Latest reading" : "No check-ins yet"}
                        </p>
                        <div className="relative h-44 flex items-center justify-center my-4">
                            <div className="absolute w-44 h-44 rounded-full bg-violet/10 animate-breath-slow"></div>
                            <div className="absolute w-32 h-32 rounded-full bg-pink/15 animate-breath"></div>
                            <div
                                className="relative w-24 h-24 rounded-full flex items-center justify-center text-white"
                                style={{
                                    background: "linear-gradient(135deg,#5E8BFF,#8A4DFF,#FF6FD3)",
                                    boxShadow: "0 0 60px rgba(138,77,255,0.6)",
                                }}
                            >
                                <div className="text-center">
                                    <p className="font-display text-4xl leading-none">{latest?.eq ?? "—"}</p>
                                    <p className="text-[10px] uppercase tracking-[0.2em] mt-1 opacity-80">EQ</p>
                                </div>
                            </div>
                        </div>
                        {latest?.suggestion && (
                            <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                                <p className="text-[10px] uppercase tracking-[0.25em] gradient-text mb-2 flex items-center gap-1.5">
                                    <Sparkles size={11} /> Suggestion
                                </p>
                                <p className="font-display italic text-lg text-ink leading-snug">{latest.suggestion}</p>
                            </div>
                        )}
                        <button
                            onClick={() => navigate("/app/check-in")}
                            data-testid="new-checkin-cta"
                            className="btn-glow mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3 text-sm font-medium transition-all active:scale-[0.98]"
                        >
                            <Plus size={14} /> New check-in
                        </button>
                    </div>

                    {/* 30-day trend */}
                    <div data-testid="dashboard-trend" className="col-span-12 md:col-span-7 gradient-border p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">Growth memory</p>
                                <h2 className="font-display text-2xl mt-1">Last 30 days</h2>
                            </div>
                            <span className="text-xs text-ink-soft">{checkins.length} check-ins</span>
                        </div>
                        {loading ? (
                            <p className="text-sm text-ink-soft py-12 text-center">Listening…</p>
                        ) : timeline.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-sm text-ink-soft">Your trend will appear here after your first check-in.</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={timeline}>
                                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fill: "#B5A8CC", fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fill: "#B5A8CC", fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ background: "#110820", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#F4EEFF" }}
                                    />
                                    <defs>
                                        <linearGradient id="eqGrad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#5E8BFF" />
                                            <stop offset="50%" stopColor="#8A4DFF" />
                                            <stop offset="100%" stopColor="#FF6FD3" />
                                        </linearGradient>
                                    </defs>
                                    <Line type="monotone" dataKey="eq" stroke="url(#eqGrad)" strokeWidth={3} dot={{ r: 3, fill: "#8A4DFF", strokeWidth: 0 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Recent check-ins */}
                <div data-testid="dashboard-recent" className="mt-8 gradient-border overflow-hidden">
                    <div className="px-6 md:px-8 pt-6 pb-4 flex items-center justify-between">
                        <h2 className="font-display text-2xl">Recent check-ins</h2>
                        <span className="text-xs text-ink-soft">Last 30 days</span>
                    </div>
                    {checkins.length === 0 && !loading ? (
                        <p className="px-6 md:px-8 py-10 text-center text-sm text-ink-soft">
                            Nothing here yet — your first check-in unlocks your growth memory.
                        </p>
                    ) : (
                        <ul>
                            {checkins.slice(0, 8).map((c) => (
                                <li
                                    key={c.id}
                                    data-testid={`checkin-row-${c.id}`}
                                    className="border-t border-white/5 px-6 md:px-8 py-4 flex items-center gap-4"
                                >
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center font-display text-lg text-white shrink-0"
                                        style={{ background: "linear-gradient(135deg,#5E8BFF,#8A4DFF,#FF6FD3)" }}
                                    >
                                        {c.eq}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-ink-soft mb-1">
                                            {new Date(c.created_at).toLocaleString(undefined, {
                                                month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                                            })}
                                        </p>
                                        {c.suggestion && (
                                            <p className="font-display italic text-sm md:text-base text-ink leading-snug line-clamp-2">
                                                {c.suggestion}
                                            </p>
                                        )}
                                    </div>
                                    <div className="hidden md:flex items-center gap-1.5 shrink-0">
                                        {SIGNALS.map((s) => (
                                            <span
                                                key={s}
                                                title={`${s}: ${c[s]}`}
                                                className="w-1.5 rounded-full"
                                                style={{ background: COLORS[s], height: `${4 + Math.round(c[s] / 5)}px` }}
                                            />
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </main>
    );
}
