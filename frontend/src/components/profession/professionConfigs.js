import {
    Stethoscope, Clock, HeartPulse, Brain, Moon, Activity,
    Scale, Gavel, FileSearch, Eye, ShieldAlert,
    GraduationCap, Users, BookOpen, Bell, MessageCircle, Volume2,
    Briefcase, ClipboardList, TrendingUp, MessageSquare, UserMinus,
} from "lucide-react";

// Icon-only configuration per profession. All text is read via i18n: `profession.<slug>.<key>`
// and shared chrome strings via `profession.<key>`. Pricing values are translatable too
// (tNP / tNP / tNF1…) since localized currency/wording may diverge.
export const PROFESSION_ICONS = {
    doctors: {
        eyebrowIcon: Stethoscope,
        stressorIcons: [Clock, HeartPulse, Brain, Moon],
        testimonialIcon: Activity,
    },
    attorneys: {
        eyebrowIcon: Scale,
        stressorIcons: [Gavel, ShieldAlert, FileSearch, Eye],
        testimonialIcon: Gavel,
    },
    teachers: {
        eyebrowIcon: GraduationCap,
        stressorIcons: [Volume2, MessageCircle, Users, Bell],
        testimonialIcon: BookOpen,
    },
    managers: {
        eyebrowIcon: Briefcase,
        stressorIcons: [Users, UserMinus, ClipboardList, TrendingUp],
        testimonialIcon: MessageSquare,
    },
};

// Audience accents for the 3rd pricing tier label inside the t() catalog
export const PROFESSION_META = {
    doctors: { audience: "doctors", footerBrand: "Doctors" },
    attorneys: { audience: "attorneys", footerBrand: "Attorneys" },
    teachers: { audience: "teachers", footerBrand: "Teachers" },
    managers: { audience: "managers", footerBrand: "Managers" },
};
