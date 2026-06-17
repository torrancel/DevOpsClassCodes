import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import Problem from "@/components/landing/Problem";
import Modules from "@/components/landing/Modules";
import Demo from "@/components/landing/Demo";
import UseCases from "@/components/landing/UseCases";
import Testimonials from "@/components/landing/Testimonials";
import Manifesto from "@/components/landing/Manifesto";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Landing() {
    return (
        <main data-testid="landing-page" className="font-sans bg-bg text-ink">
            <Navigation />
            <Hero />
            <Marquee />
            <Problem />
            <Modules />
            <Demo />
            <UseCases />
            <Testimonials />
            <Manifesto />
            <Pricing />
            <FAQ />
            <CTA />
            <Footer />
        </main>
    );
}
