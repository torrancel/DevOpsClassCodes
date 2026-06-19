import { Sparkles } from "lucide-react";

export default function BetaBadge({ joinedAt }) {
    const joined = joinedAt ? new Date(joinedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : null;
    return (
        <span
            data-testid="beta-badge"
            title={joined ? `Beta tester since ${joined}` : "Beta tester"}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue/20 via-violet/20 to-pink/20 border border-violet/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] font-medium"
        >
            <Sparkles size={10} className="text-pink" />
            <span className="gradient-text">Beta</span>
        </span>
    );
}
