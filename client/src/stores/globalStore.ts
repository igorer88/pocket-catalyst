import { create } from 'zustand'

interface GlobalState {
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  theme: 'light' | 'dark';
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isFirstVisit: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  openModal: () => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: (isOpen?: boolean) => void;
  setFirstVisit: () => void;
}

export const useGlobalStore = create<GlobalState>(set => ({
  isLoading: true,
  error: null,
  isModalOpen: false,
  theme: 'dark',
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isFirstVisit: false,
  setIsLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error: error }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setTheme: theme => set({ theme }),
  toggleSidebar: () =>
    set(state => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleMobileSidebar: isOpen =>
    set(state => ({
      isMobileSidebarOpen:
        typeof isOpen === 'boolean' ? isOpen : !state.isMobileSidebarOpen,
    })),
  setFirstVisit: () => set({ isFirstVisit: true }),
}))
