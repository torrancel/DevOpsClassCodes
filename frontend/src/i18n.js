import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import ptBR from "./locales/pt-BR.json";
import it from "./locales/it.json";
import ja from "./locales/ja.json";
import zhCN from "./locales/zh-CN.json";
import ko from "./locales/ko.json";
import ar from "./locales/ar.json";
import ru from "./locales/ru.json";
import hi from "./locales/hi.json";

export const LANGUAGES = [
    { code: "en",    label: "English",        native: "English" },
    { code: "es",    label: "Spanish",        native: "Español" },
    { code: "fr",    label: "French",         native: "Français" },
    { code: "de",    label: "German",         native: "Deutsch" },
    { code: "pt-BR", label: "Portuguese",     native: "Português" },
    { code: "it",    label: "Italian",        native: "Italiano" },
    { code: "ja",    label: "Japanese",       native: "日本語" },
    { code: "zh-CN", label: "Chinese",        native: "中文" },
    { code: "ko",    label: "Korean",         native: "한국어" },
    { code: "ar",    label: "Arabic",         native: "العربية", rtl: true },
    { code: "ru",    label: "Russian",        native: "Русский" },
    { code: "hi",    label: "Hindi",          native: "हिन्दी" },
];

const resources = {
    en:      { translation: en },
    es:      { translation: es },
    fr:      { translation: fr },
    de:      { translation: de },
    "pt-BR": { translation: ptBR },
    it:      { translation: it },
    ja:      { translation: ja },
    "zh-CN": { translation: zhCN },
    ko:      { translation: ko },
    ar:      { translation: ar },
    ru:      { translation: ru },
    hi:      { translation: hi },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        supportedLngs: LANGUAGES.map((l) => l.code),
        nonExplicitSupportedLngs: true,
        interpolation: { escapeValue: false },
        detection: {
            order: ["localStorage", "navigator", "htmlTag"],
            caches: ["localStorage"],
            lookupLocalStorage: "letitgo_lang",
        },
    });

// Set the html `dir` and `lang` for the chosen locale.
function syncDocumentDir(lng) {
    if (typeof document === "undefined") return;
    const entry = LANGUAGES.find((l) => l.code === lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = entry?.rtl ? "rtl" : "ltr";
}
syncDocumentDir(i18n.resolvedLanguage);
i18n.on("languageChanged", syncDocumentDir);

export default i18n;
