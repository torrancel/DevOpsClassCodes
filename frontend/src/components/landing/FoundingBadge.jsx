import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Capacity per audience for the founding cohort.
export const FOUNDING_CAPS = {
    kids: 500,
    individual: 1000,
    team: 300,
    professional: 250,
    watch: 1000,
    doctors: 200,
    attorneys: 150,
    teachers: 500,
    managers: 250,
};

let _cache = { data: null, ts: 0 };
const TTL_MS = 60 * 1000;

async function fetchCount() {
    const now = Date.now();
    if (_cache.data && now - _cache.ts < TTL_MS) return _cache.data;
    try {
        const { data } = await axios.get(`${API}/waitlist/count`);
        _cache = { data, ts: now };
        return data;
    } catch (e) {
        return null;
    }
}

/**
 * Shows "X of Y founding seats claimed" with a thin progress bar.
 * Reuses /api/waitlist/count which already aggregates by audience.
 */
export default function FoundingBadge({
    audience,
    label = "Founding seats",
    accent = false,
    "data-testid": testid,
}) {
    const cap = FOUNDING_CAPS[audience] ?? 500;
    const [claimed, setClaimed] = useState(0);

    useEffect(() => {
        let alive = true;
        fetchCount().then((d) => {
            if (!alive || !d) return;
            const n = (d.by_audience && d.by_audience[audience]) || 0;
            setClaimed(n);
        });
        return () => {
            alive = false;
        };
    }, [audience]);

    const pct = Math.min(100, Math.round((claimed / cap) * 100));
    const remaining = Math.max(0, cap - claimed);

    return (
        <div
            data-testid={testid || `founding-badge-${audience}`}
            className="rounded-2xl px-4 py-3 mt-4 border"
            style={{
                background: accent
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.10)",
            }}
        >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                <span className="flex items-center gap-1.5">
                    <Sparkles size={11} className="text-pink" />
                    {label}
                </span>
                <span className="font-mono text-ink">
                    {claimed} / {cap}
                </span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                    className="h-full rounded-full transition-[width] duration-700"
                    style={{
                        width: `${pct || 2}%`,
                        background:
                            "linear-gradient(90deg, #5E8BFF, #8A4DFF, #FF6FD3)",
                    }}
                />
            </div>
            <p className="mt-1.5 text-[10px] text-ink-soft">
                {remaining > 0
                    ? `${remaining} founding seats left · 50% off forever`
                    : "Founding cohort full — regular waitlist open"}
            </p>
        </div>
    );
}

// Helper to compute strikethrough price + founding price (50% off, no decimals)
export function foundingPrice(originalDisplay) {
    if (!originalDisplay || !originalDisplay.startsWith("$")) return null;
    const numeric = parseFloat(originalDisplay.slice(1));
    if (Number.isNaN(numeric)) return null;
    return `$${Math.round(numeric * 0.5)}`;
}
