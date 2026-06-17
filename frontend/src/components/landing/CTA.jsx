import { useState, useEffect } from "react";
import { ArrowUpRight, X, Apple, Smartphone } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useAudience, listAudiences, getAudienceMeta, setAudience, setPlatform } from "./audienceStore";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PRIMARY = ["kids", "individual", "team", "professional", "watch"];

export default function CTA() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [audience, , platform] = useAudience();
    const meta = audience ? getAudienceMeta(audience) : null;
    const all = listAudiences();
    const isSubAudience = audience && !PRIMARY.includes(audience);

    useEffect(() => {
        if (audience) {
            const el = document.getElementById("cta");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [audience]);

    const submit = async (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error(t("common.validEmailError"));
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(`${API}/waitlist`, {
                email,
                audience: audience || null,
                platform: audience === "watch" ? platform || null : null,
                source: "cta",
            });
            const platformLabel =
                audience === "watch" && platform === "apple" ? " (Apple Watch)" :
                audience === "watch" && platform === "android" ? " (Wear OS)" : "";
            const successMsg = meta
                ? t("cta.successWithAudience", { label: meta.label + platformLabel })
                : t("cta.successGeneric");
            toast.success(successMsg, {
                description: data.email_sent
                    ? t("cta.descriptionDelivered")
                    : t("cta.descriptionSaved", { email }),
            });
            setEmail("");
        } catch (err) {
            toast.error(t("common.genericError"), {
                description: err?.response?.data?.detail?.toString() || "Network or server error.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            id="cta"
            data-testid="cta-section"
            className="px-6 md:px-12 lg:px-20 py-20 md:py-32"
        >
            <div
                className="relative rounded-[2rem] px-6 md:px-16 py-20 md:py-32 overflow-hidden"
                style={{
                    background:
                        "linear-gradient(135deg, #0B0613 0%, #1A0930 45%, #2A1140 100%)",
                    border: "1px solid rgba(255,255,255,0.12)",
                }}
            >
                <div className="absolute -right-32 -top-32 w-[28rem] h-[28rem] rounded-full bg-pink/30 blur-3xl"></div>
                <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-blue/30 blur-3xl"></div>
                <div className="absolute inset-0 stars opacity-70 pointer-events-none"></div>

                <div className="relative max-w-3xl">
                    <p className="text-[11px] uppercase tracking-[0.35em] gradient-text mb-8">
                        {t("cta.eyebrow")}
                    </p>
                    <h2
                        data-testid="cta-headline"
                        className="font-display text-4xl md:text-7xl leading-[0.95] tracking-tight text-ink"
                    >
                        {t("cta.headlinePre")}
                        <br />
                        {t("cta.headlinePost")} <em className="gradient-text">{t("cta.headlineGradient")}</em>.
                    </h2>
                    <p className="mt-8 text-lg md:text-xl text-ink-soft max-w-xl">
                        {t("cta.sub")}
                    </p>

                    {/* Audience picker */}
                    <div className="mt-10">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-3">
                            {t("cta.joiningAs")}
                        </p>
                        <div className="flex flex-wrap gap-2" data-testid="cta-audience-picker">
                            {all.map((a) => {
                                const isPrimary = PRIMARY.includes(a.key);
                                const isSelected = audience === a.key;
                                // Hide sub-audiences unless selected, to keep the picker clean
                                if (!isPrimary && !isSelected) return null;
                                return (
                                    <button
                                        type="button"
                                        key={a.key}
                                        onClick={() => setAudience(isSelected ? null : a.key)}
                                        data-testid={`cta-audience-${a.key}`}
                                        className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all ${
                                            isSelected
                                                ? "bg-white/10 text-ink border border-white/30"
                                                : "bg-white/[0.03] text-ink-soft border border-white/10 hover:text-ink hover:border-white/20"
                                        }`}
                                    >
                                        <span
                                            className="inline-block w-1.5 h-1.5 rounded-full"
                                            style={{ background: a.color }}
                                        />
                                        {a.label.replace(" beta", "")}
                                        {isSelected && <X size={12} className="opacity-70" />}
                                    </button>
                                );
                            })}
                        </div>
                        {isSubAudience && (
                            <p
                                data-testid="cta-audience-detail"
                                className="mt-3 text-xs text-ink-soft"
                            >
                                {t("cta.specialistDetailPre")}{" "}
                                <span className="text-ink">{meta.label.replace(" beta", "")}</span>.
                            </p>
                        )}

                        {/* Watch platform sub-picker */}
                        {audience === "watch" && (
                            <div className="mt-4" data-testid="cta-platform-picker">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-2">
                                    {t("cta.yourWatch")}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: "apple", label: "Apple Watch", Icon: Apple },
                                        { key: "android", label: "Wear OS", Icon: Smartphone },
                                    ].map(({ key, label, Icon }) => {
                                        const sel = platform === key;
                                        return (
                                            <button
                                                type="button"
                                                key={key}
                                                onClick={() => setPlatform(sel ? null : key)}
                                                data-testid={`cta-platform-${key}`}
                                                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-all ${
                                                    sel
                                                        ? "bg-white/10 text-ink border border-white/30"
                                                        : "bg-white/[0.03] text-ink-soft border border-white/10 hover:text-ink hover:border-white/20"
                                                }`}
                                            >
                                                <Icon size={12} />
                                                {label}
                                                {sel && <X size={11} className="opacity-70" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                {platform && (
                                    <p
                                        data-testid="cta-platform-detail"
                                        className="mt-2 text-xs text-ink-soft"
                                    >
                                        {t("cta.tailoredFor")}{" "}
                                        <span className="text-ink">
                                            {platform === "apple" ? "Apple Watch · watchOS" : "Wear OS · Galaxy / Pixel"}
                                        </span>
                                        .
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={submit}
                        noValidate
                        data-testid="cta-form"
                        className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-xl"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("common.emailPlaceholder")}
                            data-testid="cta-email-input"
                            className="flex-1 rounded-full bg-white/[0.06] border border-white/15 text-ink placeholder:text-ink-soft/60 px-6 py-4 outline-none focus:bg-white/[0.1] focus:border-violet/60 transition-colors font-sans"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            data-testid="cta-submit-button"
                            className="btn-glow group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue via-violet to-pink text-white px-6 py-4 text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-60"
                        >
                            {loading ? t("common.listening") : t("common.joinWaitlist")}
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </button>
                    </form>

                    <p className="mt-6 text-xs text-ink-soft">
                        {t("cta.footnote")}
                    </p>
                </div>
            </div>
        </section>
    );
}
