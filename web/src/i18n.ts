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

const getLanguage = (): string => {
  const lang = navigator.language.split(/[-_]/)[0]
  return lang in resources ? lang : 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: getLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // React already escapes values
  }
})

export default i18n
