import { useSyncExternalStore } from "react";

const AUDIENCES = {
    kids:         { label: "Kids beta",            color: "#5E8BFF" },
    individual:   { label: "Individual beta",      color: "#8A4DFF" },
    team:         { label: "Team beta",            color: "#FF6FD3" },
    professional: { label: "Professional beta",    color: "#FF8A5C" },
    watch:        { label: "Wrist beta",           color: "#5E8BFF" },
    doctors:      { label: "Doctors mode beta",    color: "#5E8BFF" },
    attorneys:    { label: "Attorneys mode beta",  color: "#8A4DFF" },
    teachers:     { label: "Teachers mode beta",   color: "#FF6FD3" },
    managers:     { label: "Managers mode beta",   color: "#FF8A5C" },
};

let _audience = null;
let _platform = null;
const _listeners = new Set();

function _emit() {
    _listeners.forEach((cb) => cb());
}

export function setAudience(value) {
    _audience = value && AUDIENCES[value] ? value : null;
    if (_audience !== "watch") _platform = null;
    _emit();
}

export function setPlatform(value) {
    _platform = value === "apple" || value === "android" ? value : null;
    _emit();
}

export function getAudienceMeta(key) {
    return AUDIENCES[key] || null;
}

export function listAudiences() {
    return Object.entries(AUDIENCES).map(([key, v]) => ({ key, ...v }));
}

function subscribe(cb) {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
}

function getSnapshot() {
    // Encode both pieces in a single stable string so React detects changes.
    return `${_audience || ""}|${_platform || ""}`;
}

export function useAudience() {
    useSyncExternalStore(subscribe, getSnapshot, () => "");
    return [_audience, setAudience, _platform, setPlatform];
}
