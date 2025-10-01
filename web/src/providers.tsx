import { IntlProvider } from 'react-intl'
import { HeroUIProvider } from '@heroui/react'

import enMessages from './locales/en.json'
import esMessages from './locales/es.json'

const messages = {
  en: enMessages,
  es: esMessages
}

const getLocale = () => {
  const lang = navigator.language.split(/[-_]/)[0]
  return lang in messages ? lang : 'en'
}

const locale = getLocale()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </IntlProvider>
  )
}
