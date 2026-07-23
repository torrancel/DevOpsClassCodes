import { createContext, useContext, useState, useCallback } from "react";
import LandingModal from "@/components/landing-v2/LandingModal";

/**
 * LandingModalContext — global-per-landing state for the shared LandingModal.
 * Any child can `useLandingModal().open("early-access")` or "partnership".
 * Provider renders one LandingModal instance so it's always available.
 */
const Ctx = createContext({ open: () => {}, close: () => {} });

export const useLandingModal = () => useContext(Ctx);

export function LandingModalProvider({ children }) {
    const [state, setState] = useState({ open: false, mode: "early-access" });
    const open = useCallback(
        (mode = "early-access") => setState({ open: true, mode }),
        [],
    );
    const close = useCallback(
        () => setState((s) => ({ ...s, open: false })),
        [],
    );
    return (
        <Ctx.Provider value={{ open, close }}>
            {children}
            <LandingModal open={state.open} mode={state.mode} onClose={close} />
        </Ctx.Provider>
    );
}
