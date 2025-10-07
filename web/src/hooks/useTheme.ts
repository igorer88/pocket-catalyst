import { useCallback, useEffect } from 'react'

import { useGlobalStore } from '@/stores/globalStore'

type Theme = 'light' | 'dark'

export const useTheme = (): [Theme, () => void] => {
  const theme = useGlobalStore(state => state.theme)
  const setThemeInStore = useGlobalStore(state => state.setTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove(theme === 'light' ? 'dark' : 'light')
    root.classList.add(theme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeInStore(theme === 'light' ? 'dark' : 'light')
  }, [theme, setThemeInStore])

  return [theme, toggleTheme]
}
