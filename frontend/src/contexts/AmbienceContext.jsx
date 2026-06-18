import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const AmbienceContext = createContext(null);

const STORAGE_KEY = "letitgo_ambience";

export const SOUND_PRESETS = [
    { key: "off",     label: "Silence" },
    { key: "rain",    label: "Rain" },
    { key: "forest",  label: "Forest" },
    { key: "ocean",   label: "Ocean" },
    { key: "breath",  label: "Breath" },
];

export const COLOR_MOODS = [
    { key: "violet", label: "Twilight", c1: "rgba(94,139,255,0.18)",  c2: "rgba(138,77,255,0.22)", c3: "rgba(255,111,211,0.18)" },
    { key: "cool",   label: "Cool",      c1: "rgba(94,139,255,0.30)",  c2: "rgba(110,200,255,0.20)", c3: "rgba(160,180,255,0.18)" },
    { key: "warm",   label: "Warm",      c1: "rgba(255,138,92,0.20)",  c2: "rgba(255,179,111,0.20)", c3: "rgba(255,111,140,0.18)" },
    { key: "dawn",   label: "Dawn",      c1: "rgba(255,179,200,0.22)", c2: "rgba(255,210,160,0.20)", c3: "rgba(180,160,255,0.18)" },
    { key: "forest", label: "Forest",    c1: "rgba(80,150,120,0.22)",  c2: "rgba(110,180,140,0.18)", c3: "rgba(180,200,140,0.16)" },
    { key: "auto",   label: "Match my EQ"},
];

function loadPrefs() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}

function savePrefs(p) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch {}
}

// Build a small procedural ambient soundscape per preset using Web Audio.
function buildAudioGraph(ctx, preset, masterGain) {
    if (preset === "off") return null;

    const stop = [];

    // Noise buffer: 2 seconds of stereo random samples that we loop.
    const bufLen = ctx.sampleRate * 2;
    const noiseBuf = ctx.createBuffer(2, bufLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
        const data = noiseBuf.getChannelData(ch);
        // Pink-ish noise (Paul Kellet's simple algorithm)
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufLen; i++) {
            const w = Math.random() * 2 - 1;
            b0 = 0.99765 * b0 + w * 0.099046;
            b1 = 0.96300 * b1 + w * 0.299300;
            b2 = 0.57000 * b2 + w * 1.180700;
            data[i] = (b0 + b1 + b2 + w * 0.1848) * 0.15;
        }
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;

    // Filter per preset
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    if (preset === "rain") {
        filter.type = "highpass";
        filter.frequency.value = 800;
        gain.gain.value = 0.6;
    } else if (preset === "forest") {
        filter.type = "lowpass";
        filter.frequency.value = 1500;
        gain.gain.value = 0.5;
    } else if (preset === "ocean") {
        filter.type = "lowpass";
        filter.frequency.value = 500;
        gain.gain.value = 0.7;
        // Slow LFO on gain for wave swell
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.12;
        lfoGain.gain.value = 0.45;
        lfo.connect(lfoGain).connect(gain.gain);
        lfo.start();
        stop.push(() => { try { lfo.stop(); } catch {} });
    } else if (preset === "breath") {
        filter.type = "bandpass";
        filter.frequency.value = 500;
        filter.Q.value = 0.7;
        gain.gain.value = 0.0;
        // Breath cadence: 4s inhale, 6s exhale via gain ramp
        const now = ctx.currentTime;
        const cycle = 10;
        for (let i = 0; i < 360; i++) {
            const t = now + i * cycle;
            gain.gain.setValueAtTime(0.0, t);
            gain.gain.linearRampToValueAtTime(0.55, t + 4);
            gain.gain.linearRampToValueAtTime(0.0, t + 10);
        }
    }

    noise.connect(filter).connect(gain).connect(masterGain);
    noise.start();
    stop.push(() => { try { noise.stop(); } catch {} });

    // Forest: add gentle sine "bird" pings every 8-15s
    if (preset === "forest") {
        const tick = () => {
            try {
                const osc = ctx.createOscillator();
                const og = ctx.createGain();
                osc.frequency.value = 1400 + Math.random() * 1200;
                og.gain.setValueAtTime(0, ctx.currentTime);
                og.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05);
                og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
                osc.connect(og).connect(masterGain);
                osc.start();
                osc.stop(ctx.currentTime + 0.5);
            } catch {}
        };
        const handle = setInterval(tick, 9000 + Math.random() * 6000);
        stop.push(() => clearInterval(handle));
    }

    return () => stop.forEach((fn) => fn());
}

export function AmbienceProvider({ children }) {
    const init = loadPrefs();
    const [sound, setSound] = useState(init.sound || "off");
    const [color, setColor] = useState(init.color || "violet");
    const [volume, setVolume] = useState(typeof init.volume === "number" ? init.volume : 0.5);
    const [panelOpen, setPanelOpen] = useState(false);

    const ctxRef = useRef(null);
    const masterRef = useRef(null);
    const stopRef = useRef(null);

    const ensureContext = useCallback(() => {
        if (!ctxRef.current) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctxRef.current = new AC();
            masterRef.current = ctxRef.current.createGain();
            masterRef.current.gain.value = volume;
            masterRef.current.connect(ctxRef.current.destination);
        }
        if (ctxRef.current.state === "suspended") {
            ctxRef.current.resume();
        }
        return ctxRef.current;
    }, [volume]);

    // Re-build graph when sound changes
    useEffect(() => {
        savePrefs({ sound, color, volume });
        if (stopRef.current) { stopRef.current(); stopRef.current = null; }
        if (sound === "off") return;
        const ctx = ensureContext();
        if (!ctx) return;
        stopRef.current = buildAudioGraph(ctx, sound, masterRef.current);
        return () => { if (stopRef.current) stopRef.current(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sound]);

    useEffect(() => {
        if (masterRef.current) masterRef.current.gain.value = volume;
        savePrefs({ sound, color, volume });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [volume]);

    useEffect(() => {
        savePrefs({ sound, color, volume });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color]);

    const value = {
        sound, setSound,
        color, setColor,
        volume, setVolume,
        panelOpen, setPanelOpen,
    };
    return <AmbienceContext.Provider value={value}>{children}</AmbienceContext.Provider>;
}

export function useAmbience() {
    return useContext(AmbienceContext);
}

export function resolveColors(colorKey, eq) {
    if (colorKey !== "auto") return COLOR_MOODS.find((m) => m.key === colorKey) || COLOR_MOODS[0];
    if (eq == null) return COLOR_MOODS[0];
    if (eq >= 70) return COLOR_MOODS.find((m) => m.key === "cool");
    if (eq >= 50) return COLOR_MOODS.find((m) => m.key === "violet");
    if (eq >= 30) return COLOR_MOODS.find((m) => m.key === "dawn");
    return COLOR_MOODS.find((m) => m.key === "warm");
}
