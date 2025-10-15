import { useCallback, useEffect, useMemo } from 'react'

import { useGlobalStore } from '@/stores/globalStore'
import { useProfileStore } from '@/stores/profileStore'

type Theme = 'light' | 'dark' | 'auto'

export const useTheme = (): [Theme, () => void] => {
  const globalTheme = useGlobalStore(state => state.theme)
  const setThemeInStore = useGlobalStore(state => state.setTheme)
  const profile = useProfileStore(state => state.profile)

  // Get theme from profile or fallback to global store
  const getCurrentTheme = useCallback((): Theme => {
    if (profile?.extraSettings && typeof profile.extraSettings === 'object') {
      const appPreferences = (profile.extraSettings as Record<string, unknown>)
        ?.appPreferences as Record<string, unknown> | undefined
      const profileTheme = appPreferences?.theme as Theme | undefined
      if (profileTheme && ['light', 'dark', 'auto'].includes(profileTheme)) {
        return profileTheme
      }
    }
    return globalTheme as Theme
  }, [profile, globalTheme])

  const theme = useMemo(() => getCurrentTheme(), [getCurrentTheme])

  useEffect(() => {
    const root = window.document.documentElement
    const actualTheme =
      theme === 'auto'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme

    root.classList.remove('light', 'dark')
    root.classList.add(actualTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', actualTheme)
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    const currentTheme = getCurrentTheme()
    let newTheme: Theme

    if (currentTheme === 'light') {
      newTheme = 'dark'
    } else if (currentTheme === 'dark') {
      newTheme = 'auto'
    } else {
      newTheme = 'light'
    }

    setThemeInStore(newTheme)
  }, [setThemeInStore, getCurrentTheme])

  return [theme, toggleTheme]
}
