import { HeroUIProvider } from '@heroui/react'
import { IntlProvider } from 'react-intl'

import enMessages from './locales/en.json'
import esMessages from './locales/es.json'

const messages: Record<string, Record<string, any>> = {
  en: enMessages,
  es: esMessages
}

const getLocale = (): string => {
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
