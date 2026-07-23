/**
 * Thin analytics interface for the marketing landing.
 *
 * Forwards to `window.posthog` if the SDK is loaded (see public/index.html).
 * Silently no-ops otherwise so new providers can be wired without changing
 * call sites. Callers should always use the exported EVENTS constants — never
 * pass ad-hoc event strings — so we have a single source of truth.
 *
 * To add another provider later, extend `track()` — no call-site changes.
 */
export const EVENTS = {
    HERO_MVP_CLICK: "landing.hero_mvp.click",
    PRODUCT_DEMO_CLICK: "landing.product_demo.click",
    EARLY_ACCESS_SUBMIT: "landing.early_access.submitted",
    INVESTOR_INQUIRY: "landing.investor.inquiry",
    PARTNERSHIP_INQUIRY: "landing.partnership.inquiry",
};

export const track = (event, properties = {}) => {
    try {
        if (typeof window === "undefined") return;
        const ph = window.posthog;
        if (ph && typeof ph.capture === "function") {
            ph.capture(event, properties);
        }
        // Extension point: add other providers here (e.g., GA4, Segment, Mixpanel).
    } catch (err) {
        // Analytics failures must never break the app.
        console.warn("[analytics] track failed", event, err);
    }
};
