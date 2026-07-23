/**
 * Landing — premium marketing page for Let It Go AI.
 *
 * Design system: /app/frontend/src/components/ds
 * Sections:      /app/frontend/src/components/landing-v2
 *
 * The previous landing composition is preserved verbatim in
 *   /app/frontend/src/pages/LandingLegacy.jsx
 * for reference / rollback (no public route wired to it).
 *
 * All MVP routes, backend contracts, waitlist / Stripe /
 * auth flows remain untouched — this file only composes the
 * public marketing surface.
 */
import NavigationV2 from "@/components/landing-v2/NavigationV2";
import HeroV2 from "@/components/landing-v2/HeroV2";
import TimelineV2 from "@/components/landing-v2/TimelineV2";
import WorkingProductV2 from "@/components/landing-v2/WorkingProductV2";
import SignalToSupportV2 from "@/components/landing-v2/SignalToSupportV2";
import FeaturesV2 from "@/components/landing-v2/FeaturesV2";
import DeviceShowcase from "@/components/landing-v2/DeviceShowcase";
import AudiencesV2 from "@/components/landing-v2/AudiencesV2";
import EcosystemRoadmapV2 from "@/components/landing-v2/EcosystemRoadmapV2";
import FounderSectionV2 from "@/components/landing-v2/FounderSectionV2";
import PricingV2 from "@/components/landing-v2/PricingV2";
import FAQV2 from "@/components/landing-v2/FAQV2";
import CTAV2 from "@/components/landing-v2/CTAV2";
import FooterV2 from "@/components/landing-v2/FooterV2";

export default function Landing() {
    return (
        <main
            data-testid="landing-page"
            className="lg-root min-h-screen overflow-x-hidden"
        >
            <NavigationV2 />
            <HeroV2 />
            <TimelineV2 />
            <WorkingProductV2 />
            <SignalToSupportV2 />
            <FeaturesV2 />
            <DeviceShowcase />
            <AudiencesV2 />
            <EcosystemRoadmapV2 />
            <FounderSectionV2 />
            <PricingV2 />
            <FAQV2 />
            <CTAV2 />
            <FooterV2 />
        </main>
    );
}
