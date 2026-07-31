/// Localization setup using i18next and react-i18next.
/// Rule 3 from 00_rn_non_negotiables.md:
/// ALL user-visible text MUST come from i18next translation files via useTranslation().

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
