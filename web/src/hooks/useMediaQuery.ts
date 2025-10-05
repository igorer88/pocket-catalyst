import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = (): void => setMatches(media.matches)
    window.addEventListener('resize', listener)
    return (): void => {
      window.removeEventListener('resize', listener)
    }
  }, [matches, query])

  return matches
}

// Specific breakpoints for responsive design

export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 1024px)')

export const useIsTablet = (): boolean =>
  useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

export const useIsMobile = (): boolean => useMediaQuery('(max-width: 767px)')
