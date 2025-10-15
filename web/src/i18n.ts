import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

import enMessages from './locales/en.json'
import esMessages from './locales/es.json'

const resources = {
  en: {
    translation: enMessages
  },
  es: {
    translation: esMessages
  }
}

export const getLanguage = (): string => {
  // Check localStorage first, then fallback to browser language
  const storedLang = localStorage.getItem('language')
  if (storedLang && storedLang in resources) {
    return storedLang
  }
  const browserLang = navigator.language.split(/[-_]/)[0]
  return browserLang in resources ? browserLang : 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: getLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // React already escapes values
  }
})

export const changeLanguage = (lng: string): void => {
  i18n.changeLanguage(lng)
  localStorage.setItem('language', lng)
}

export default i18n
