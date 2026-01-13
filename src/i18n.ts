import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import no from "./locales/no.json";
import en from "./locales/en.json";
import nn from "./locales/nn.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      no: { translation: no },
      en: { translation: en },
      nn: { translation: nn },  
    },
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
