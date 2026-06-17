import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, Cell, PieChart, Pie,
} from "recharts";
import { LockKeyhole, LogOut, RefreshCw, TrendingUp, Mail, Users, Target } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import InfinityGlow from "@/components/landing/InfinityGlow";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "letitgo_admin_token";

const PALETTE = {
    doctors: "#5E8BFF",
    attorneys: "#8A4DFF",
    teachers: "#FF6FD3",
    managers: "#FF8A5C",
    kids: "#6BD0FF",
    individual: "#B19BFF",
    team: "#FF93C9",
    professional: "#FFB36F",
    watch: "#5E8BFF",
    unspecified: "#544966",
};

function colorFor(key) {
    return PALETTE[key] || "#8A4DFF";
}

function StatTile({ icon: Icon, label, value, sub, testid }) {
    return (
        <div data-testid={testid} className="gradient-border p-6 md:p-7">
            <div className="flex items-center gap-2 text-ink-soft text-[10px] uppercase tracking-[0.25em] mb-4">
                <Icon size={14} className="text-violet" />
                {label}
            </div>
            <p className="font-display text-5xl gradient-text">{value}</p>
            {sub && <p className="text-xs text-ink-soft mt-2">{sub}</p>}
        </div>
    );
}

function TokenGate({ onSubmit }) {
    const [token, setToken] = useState("");
    return (
        <main className="min-h-screen flex items-center justify-center px-6 bg-bg text-ink">
            <form
                onSubmit={(e) => { e.preventDefault(); if (token) onSubmit(token); }}
                data-testid="admin-token-gate"
                className="relative w-full max-w-md gradient-border p-10"
            >
                <div className="absolute inset-0 aurora opacity-50 pointer-events-none rounded-3xl"></div>
                <div className="relative">
                    <InfinityGlow size={40} className="mb-6" />
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-3">
                        Admin · quiet attention
                    </p>
                    <h1 className="font-display text-4xl text-ink mb-6">
                        Enter <em className="gradient-text">your key</em>.
                    </h1>
                    <input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="ADMIN_TOKEN"
                        data-testid="admin-token-input"
                        autoFocus
                        className="w-full rounded-full bg-white/[0.06] border border-white/15 text-ink placeholder:text-ink-soft/60 px-5 py-3 outline-none focus:bg-white/[0.1] focus:border-violet/60 transition-colors font-mono text-sm"
                    />
                    <button
                        type="submit"
                        data-testid="admin-token-submit"
                        className="btn-glow mt-4 w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-3 text-sm font-medium"
                    >
                        Unlock dashboard
                    </button>
                    <p className="mt-4 text-xs text-ink-soft">
                        Set in <span className="font-mono text-ink">backend/.env</span> as{" "}
                        <span className="font-mono text-ink">ADMIN_TOKEN</span>.
                    </p>
                    <Link to="/" className="link-underline text-xs text-ink-soft mt-6 inline-block">
                        ← Back to main site
                    </Link>
                </div>
            </form>
        </main>
    );
}

export default function AdminAnalytics() {
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (t = token) => {
        if (!t) return;
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${API}/admin/analytics`, {
                headers: { Authorization: `Bearer ${t}` },
            });
            setData(data);
            localStorage.setItem(TOKEN_KEY, t);
            setToken(t);
        } catch (err) {
            const code = err?.response?.status;
            if (code === 401 || code === 403) {
                localStorage.removeItem(TOKEN_KEY);
                setToken("");
                setData(null);
                setError("Invalid or missing admin token.");
            } else {
                setError(err?.message || "Failed to load analytics.");
                toast.error("Couldn't fetch analytics.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchData(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setData(null);
    };

    if (!token || !data) {
        return (
            <>
                <TokenGate onSubmit={fetchData} />
                {error && (
                    <p className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-pink font-mono">
                        {error}
                    </p>
                )}
            </>
        );
    }

    // Derived: top audience by count
    const topAud = (data.by_audience || []).filter((a) => a.audience !== "unspecified")[0];
    // Conversion rate per audience (email_sent / total) — practical "delivered" rate
    const audienceRows = (data.by_audience || []).map((a) => ({
        ...a,
        rate: a.count > 0 ? a.emailed / a.count : 0,
    }));

    return (
        <main
            data-testid="admin-analytics"
            className="min-h-screen bg-bg text-ink font-sans"
        >
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-xl bg-bg/70">
                <div className="px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <InfinityGlow size={28} />
                        <span className="font-display text-lg tracking-tight text-ink">
                            Let It Go · <span className="gradient-text">admin</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            data-testid="admin-refresh"
                            onClick={() => fetchData()}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 text-ink px-4 py-2 text-xs hover:bg-white/5 transition-all disabled:opacity-50"
                        >
                            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                        <button
                            data-testid="admin-logout"
                            onClick={logout}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 text-ink-soft hover:text-ink px-4 py-2 text-xs hover:bg-white/5 transition-all"
                        >
                            <LogOut size={13} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero / KPIs */}
            <section className="px-6 md:px-12 lg:px-20 pt-16 pb-10">
                <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-4">
                    Waitlist analytics
                </p>
                <h1 className="font-display text-4xl md:text-6xl tracking-tight text-ink mb-10">
                    Which audience is <em className="gradient-text">converting best</em>?
                </h1>

                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <StatTile
                            testid="kpi-total"
                            icon={Users}
                            label="Total signups"
                            value={data.total}
                            sub="across all audiences"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <StatTile
                            testid="kpi-emailed"
                            icon={Mail}
                            label="Confirmation sent"
                            value={data.emailed}
                            sub={`${(data.send_rate * 100).toFixed(0)}% delivery rate`}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <StatTile
                            testid="kpi-top"
                            icon={TrendingUp}
                            label="Top audience"
                            value={topAud ? topAud.audience : "—"}
                            sub={topAud ? `${topAud.count} signups` : "no data yet"}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <StatTile
                            testid="kpi-watch"
                            icon={Target}
                            label="Wrist beta split"
                            value={(() => {
                                const a = (data.by_platform || []).find((p) => p.platform === "apple")?.count || 0;
                                const n = (data.by_platform || []).find((p) => p.platform === "android")?.count || 0;
                                return `${a} / ${n}`;
                            })()}
                            sub="Apple Watch / Wear OS"
                        />
                    </div>
                </div>
            </section>

            {/* Charts row 1: audience bar + source pie */}
            <section className="px-6 md:px-12 lg:px-20 pb-10 grid grid-cols-12 gap-4 md:gap-6">
                <div data-testid="chart-by-audience" className="col-span-12 lg:col-span-8 gradient-border p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-2xl text-ink">By audience</h2>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                            Signups · delivered
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={data.by_audience}>
                            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis dataKey="audience" tick={{ fill: "#B5A8CC", fontSize: 11 }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fill: "#B5A8CC", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: "rgba(138,77,255,0.08)" }}
                                contentStyle={{
                                    background: "#110820",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderRadius: 12,
                                    color: "#F4EEFF",
                                    fontFamily: "Space Grotesk",
                                }}
                                labelStyle={{ color: "#B5A8CC" }}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {data.by_audience.map((r, i) => (
                                    <Cell key={i} fill={colorFor(r.audience)} />
                                ))}
                            </Bar>
                            <Bar dataKey="emailed" radius={[8, 8, 0, 0]} fill="#F4EEFF" fillOpacity={0.25} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div data-testid="chart-by-source" className="col-span-12 lg:col-span-4 gradient-border p-6 md:p-8">
                    <h2 className="font-display text-2xl text-ink mb-6">By source</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={data.by_source}
                                dataKey="count"
                                nameKey="source"
                                innerRadius={50}
                                outerRadius={90}
                                paddingAngle={3}
                                stroke="#050208"
                                strokeWidth={2}
                            >
                                {data.by_source.map((r, i) => (
                                    <Cell key={i} fill={["#5E8BFF", "#8A4DFF", "#FF6FD3", "#FF8A5C", "#6BD0FF", "#544966"][i % 6]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: "#110820",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderRadius: 12,
                                    color: "#F4EEFF",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <ul className="mt-4 space-y-2 text-sm">
                        {data.by_source.map((r, i) => (
                            <li key={r.source} className="flex items-center justify-between text-ink-soft">
                                <span className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            background: ["#5E8BFF", "#8A4DFF", "#FF6FD3", "#FF8A5C", "#6BD0FF", "#544966"][i % 6],
                                        }}
                                    />
                                    <span className="text-ink">{r.source}</span>
                                </span>
                                <span className="font-mono text-xs">{r.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Timeline */}
            <section className="px-6 md:px-12 lg:px-20 pb-10">
                <div data-testid="chart-timeline" className="gradient-border p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-2xl text-ink">Last 30 days</h2>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                            Daily signups
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={data.timeline}>
                            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis dataKey="day" tick={{ fill: "#B5A8CC", fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                            <YAxis tick={{ fill: "#B5A8CC", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    background: "#110820",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderRadius: 12,
                                    color: "#F4EEFF",
                                }}
                            />
                            <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#5E8BFF" />
                                    <stop offset="50%" stopColor="#8A4DFF" />
                                    <stop offset="100%" stopColor="#FF6FD3" />
                                </linearGradient>
                            </defs>
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="url(#lineGrad)"
                                strokeWidth={3}
                                dot={{ r: 3, fill: "#8A4DFF", strokeWidth: 0 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Conversion ranking table */}
            <section className="px-6 md:px-12 lg:px-20 pb-10">
                <div data-testid="audience-ranking" className="gradient-border overflow-hidden">
                    <div className="px-6 md:px-8 pt-6 md:pt-8 pb-2 flex items-center justify-between">
                        <h2 className="font-display text-2xl text-ink">Audience ranking</h2>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                            Signups · delivered · share
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-ink-soft text-[10px] uppercase tracking-[0.2em]">
                                    <th className="px-6 md:px-8 py-3">Audience</th>
                                    <th className="px-4 py-3 text-right">Signups</th>
                                    <th className="px-4 py-3 text-right">Delivered</th>
                                    <th className="px-4 py-3 text-right">Share</th>
                                    <th className="px-6 md:px-8 py-3">Conversion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audienceRows.map((a, i) => {
                                    const share = data.total > 0 ? a.count / data.total : 0;
                                    const widthPct = Math.round(share * 100);
                                    return (
                                        <tr
                                            key={a.audience}
                                            data-testid={`row-audience-${a.audience}`}
                                            className="border-t border-white/5 hover:bg-white/[0.02]"
                                        >
                                            <td className="px-6 md:px-8 py-4 text-ink flex items-center gap-3">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{ background: colorFor(a.audience) }}
                                                />
                                                <span className="capitalize">{a.audience}</span>
                                            </td>
                                            <td className="px-4 py-4 font-mono text-ink text-right">{a.count}</td>
                                            <td className="px-4 py-4 font-mono text-ink text-right">{a.emailed}</td>
                                            <td className="px-4 py-4 font-mono text-ink text-right">{widthPct}%</td>
                                            <td className="px-6 md:px-8 py-4 w-[40%]">
                                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${widthPct}%` }}
                                                        transition={{ duration: 0.8, delay: i * 0.04 }}
                                                        className="h-full"
                                                        style={{ background: colorFor(a.audience) }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Recent signups */}
            <section className="px-6 md:px-12 lg:px-20 pb-20">
                <div data-testid="recent-signups" className="gradient-border overflow-hidden">
                    <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
                        <h2 className="font-display text-2xl text-ink">Recent signups</h2>
                        <p className="text-xs text-ink-soft mt-1">
                            Emails partially redacted for privacy · last 25
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-ink-soft text-[10px] uppercase tracking-[0.2em]">
                                    <th className="px-6 md:px-8 py-3">Email</th>
                                    <th className="px-4 py-3">Audience</th>
                                    <th className="px-4 py-3">Source</th>
                                    <th className="px-4 py-3">Sent?</th>
                                    <th className="px-6 md:px-8 py-3">When</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recent.map((r, i) => (
                                    <tr
                                        key={i}
                                        className="border-t border-white/5 hover:bg-white/[0.02]"
                                    >
                                        <td className="px-6 md:px-8 py-3 font-mono text-ink text-xs">{r.email}</td>
                                        <td className="px-4 py-3">
                                            {r.audience ? (
                                                <span
                                                    className="inline-flex items-center gap-2 text-xs rounded-full px-2.5 py-1 border"
                                                    style={{
                                                        color: colorFor(r.audience),
                                                        borderColor: `${colorFor(r.audience)}40`,
                                                        background: `${colorFor(r.audience)}15`,
                                                    }}
                                                >
                                                    {r.audience}{r.platform ? ` · ${r.platform}` : ""}
                                                </span>
                                            ) : (
                                                <span className="text-ink-soft text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-ink-soft text-xs">{r.source || "—"}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`text-[10px] uppercase tracking-[0.2em] ${r.email_sent ? "text-blue" : "text-ink-soft"}`}
                                            >
                                                {r.email_sent ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td className="px-6 md:px-8 py-3 text-ink-soft text-xs font-mono">
                                            {(r.created_at || "").slice(0, 16).replace("T", " ")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
