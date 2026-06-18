import { Music, Volume2, Volume1, VolumeX, Palette, X } from "lucide-react";
import { useAmbience, SOUND_PRESETS, COLOR_MOODS, resolveColors } from "@/contexts/AmbienceContext";

/** Floating panel — bottom-left on /app routes. */
export default function AmbiencePanel({ latestEq }) {
    const { sound, setSound, color, setColor, volume, setVolume, panelOpen, setPanelOpen } = useAmbience();
    const colors = resolveColors(color, latestEq);

    return (
        <>
            {/* Ambient color wash for the whole page */}
            <div
                aria-hidden="true"
                data-testid="ambience-wash"
                className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-1000"
                style={{
                    background: colors
                        ? `radial-gradient(ellipse 80% 60% at 15% 0%, ${colors.c1}, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 10%, ${colors.c2}, transparent 60%), radial-gradient(ellipse 70% 50% at 50% 100%, ${colors.c3}, transparent 60%)`
                        : "transparent",
                }}
            />

            {/* Floating toggle */}
            <button
                type="button"
                data-testid="ambience-toggle"
                onClick={() => setPanelOpen(!panelOpen)}
                className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full backdrop-blur-xl bg-bg/70 border border-white/15 px-4 py-2.5 text-xs text-ink hover:bg-white/[0.06] transition-all"
            >
                <Music size={13} className="text-pink" />
                <span className="font-medium">
                    {sound === "off" ? "Silence" : SOUND_PRESETS.find((p) => p.key === sound)?.label}
                </span>
                <span className="text-ink-soft">·</span>
                <Palette size={12} className="text-blue" />
                <span className="font-medium">
                    {COLOR_MOODS.find((m) => m.key === color)?.label}
                </span>
            </button>

            {/* Slide-up panel */}
            {panelOpen && (
                <div
                    data-testid="ambience-panel"
                    className="fixed bottom-20 left-5 z-40 w-[300px] rounded-3xl backdrop-blur-xl bg-bg/85 border border-white/15 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] gradient-text">Ambience</p>
                        <button
                            type="button"
                            onClick={() => setPanelOpen(false)}
                            data-testid="ambience-close"
                            className="text-ink-soft hover:text-ink"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Sound presets */}
                    <p className="text-[10px] uppercase tracking-[0.25em] text-ink-soft mb-2 flex items-center gap-1.5">
                        <Music size={11} /> Sound
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {SOUND_PRESETS.map((p) => (
                            <button
                                key={p.key}
                                onClick={() => setSound(p.key)}
                                data-testid={`ambience-sound-${p.key}`}
                                className={`text-xs rounded-full px-3 py-1.5 transition-all ${
                                    sound === p.key
                                        ? "bg-white/10 text-ink border border-white/30"
                                        : "bg-white/[0.03] text-ink-soft border border-white/10 hover:text-ink"
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-3 mb-4">
                        {volume === 0 ? <VolumeX size={13} className="text-ink-soft" /> : volume < 0.5 ? <Volume1 size={13} className="text-ink-soft" /> : <Volume2 size={13} className="text-ink-soft" />}
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            data-testid="ambience-volume"
                            className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #8A4DFF 0%, #FF6FD3 ${volume * 100}%, rgba(255,255,255,0.08) ${volume * 100}%, rgba(255,255,255,0.08) 100%)`,
                            }}
                        />
                    </div>

                    {/* Color moods */}
                    <p className="text-[10px] uppercase tracking-[0.25em] text-ink-soft mb-2 flex items-center gap-1.5">
                        <Palette size={11} /> Color
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {COLOR_MOODS.map((m) => (
                            <button
                                key={m.key}
                                onClick={() => setColor(m.key)}
                                data-testid={`ambience-color-${m.key}`}
                                className={`text-xs rounded-full px-3 py-1.5 transition-all ${
                                    color === m.key
                                        ? "bg-white/10 text-ink border border-white/30"
                                        : "bg-white/[0.03] text-ink-soft border border-white/10 hover:text-ink"
                                }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
