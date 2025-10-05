import { HeroUIProvider } from '@heroui/react'

// Import i18n configuration (this initializes i18next)
import './i18n'

export function Providers({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return <HeroUIProvider>{children}</HeroUIProvider>
}
