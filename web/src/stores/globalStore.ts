import { create } from 'zustand'

interface GlobalState {
  isLoading: boolean
  error: string | null
  isModalOpen: boolean
  theme: 'light' | 'dark'
  isSidebarCollapsed: boolean
  isFirstVisit: boolean
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  openModal: () => void
  closeModal: () => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  setFirstVisit: () => void
}

export const useGlobalStore = create<GlobalState>(set => ({
  isLoading: true,
  error: null,
  isModalOpen: false,
  theme: 'dark',
  isSidebarCollapsed: false,
  isFirstVisit: false,
  setIsLoading: (loading: boolean): void => set({ isLoading: loading }),
  setError: (error: string | null): void => set({ error: error }),
  openModal: (): void => set({ isModalOpen: true }),
  closeModal: (): void => set({ isModalOpen: false }),
  setTheme: (theme: 'light' | 'dark'): void => set({ theme }),
  toggleSidebar: (): void =>
    set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setFirstVisit: (): void => set({ isFirstVisit: true })
}))
