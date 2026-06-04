import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import hi from './locales/hi.json'

/* Read the app language from its dedicated persistence key. */
function initialLanguage() {
  try {
    const lang = localStorage.getItem('ut-lang')
    if (lang) return lang
  } catch {
    /* ignore malformed storage */
  }
  return 'en'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    lng: initialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
