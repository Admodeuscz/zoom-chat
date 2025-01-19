import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// import translationJA from './locales/ja/translation.json';
import translationEN from "./locales/en/translation.json";
const resources = {
  // ja: {
  //     translation: translationJA
  // },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",

    keySeparator: false,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
