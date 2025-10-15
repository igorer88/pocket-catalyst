import { create } from 'zustand'

interface GlobalState {
  isLoading: boolean
  error: string | null
  isModalOpen: boolean
  theme: 'light' | 'dark' | 'auto'
  isSidebarCollapsed: boolean
  isFirstVisit: boolean
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  openModal: () => void
  closeModal: () => void
  setTheme: (theme: 'light' | 'dark' | 'auto') => void
  toggleSidebar: () => void
  setFirstVisit: () => void
}

const getInitialTheme = (): 'light' | 'dark' | 'auto' => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme') as
      | 'light'
      | 'dark'
      | 'auto'
      | null
    if (
      storedTheme === 'light' ||
      storedTheme === 'dark' ||
      storedTheme === 'auto'
    ) {
      return storedTheme
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  }
  return 'dark'
}

export const useGlobalStore = create<GlobalState>(set => ({
  isLoading: true,
  error: null,
  isModalOpen: false,
  theme: getInitialTheme(),
  isSidebarCollapsed: false,
  isFirstVisit: false,
  setIsLoading: (loading: boolean): void => set({ isLoading: loading }),
  setError: (error: string | null): void => set({ error: error }),
  openModal: (): void => set({ isModalOpen: true }),
  closeModal: (): void => set({ isModalOpen: false }),
  setTheme: (theme: 'light' | 'dark' | 'auto'): void => set({ theme }),
  toggleSidebar: (): void =>
    set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setFirstVisit: (): void => set({ isFirstVisit: true })
}))
