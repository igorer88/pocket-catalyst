import { create } from 'zustand'

import { User } from '@/@types'
import { environment } from '@/config'
import apiClient from '@/config/api-client'
import { ApiError } from '@/utils'

import { useProfileStore } from './profileStore'

interface LoginResponse {
  access: string | null
  refresh: string | null
}
interface TokenRefreshResponse {
  access: string
  refresh?: string
}

const demoUser: User = {
  id: '455be978-dd76-4456-bc23-158f8c2bb970',
  username: 'demo',
  email: 'demo@example.com',
  first_name: 'Demo',
  last_name: 'User',
  date_joined: '2023-01-01T00:00:00Z',
  is_active: true
}

interface AuthState {
  isAuthenticated: boolean
  isLocked: boolean
  user: User | null
  authToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  setIsAuthenticated: (status: boolean) => void
  setIsLocked: (status: boolean) => void
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
  handleTokenRefresh: () => Promise<string | null>
  setUser: (userData: User | null) => void
  getAuthToken: () => string | null
}

const getInitialTokens = (): {
  authToken: string | null
  refreshToken: string | null
} => {
  if (typeof window !== 'undefined') {
    return {
      authToken: localStorage.getItem('authToken'),
      refreshToken: localStorage.getItem('refreshToken')
    }
  }
  return { authToken: null, refreshToken: null }
}

const getInitialUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('userData')
    return storedUser ? (JSON.parse(storedUser) as User) : null
  }
  return null
}

const { authToken: initialAuthToken, refreshToken: initialRefreshToken } =
  getInitialTokens()
const initialUser = getInitialUser()

export const useAuthStore = create<AuthState>((set, get) => {
  const internalLogout = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userData')
    }
    set({
      isAuthenticated: false,
      user: null,
      authToken: null,
      refreshToken: null,
      error: null
    })
    useProfileStore.getState().clearProfile()
  }

  return {
    isAuthenticated: !!initialAuthToken,
    isLocked: false,
    user: initialUser,
    authToken: initialAuthToken,
    refreshToken: initialRefreshToken,
    isLoading: false,
    error: null,
    setIsAuthenticated: (status: boolean): void =>
      set({ isAuthenticated: status }),
    setIsLocked: (status: boolean): void => set({ isLocked: status }),
    login: async (username: string, password: string): Promise<boolean> => {
      set({ isLoading: true, error: null })

      // Development mode: allow demo login
      if (
        environment.isDevelopment &&
        username === 'demo' &&
        password === 'demo'
      ) {
        set({
          isAuthenticated: true,
          user: demoUser,
          authToken: 'demo_token_' + Date.now(),
          refreshToken: 'demo_refresh_token_' + Date.now(),
          isLoading: false,
          error: null
        })

        // Store demo tokens in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', `demo_token_${Date.now()}`)
          localStorage.setItem(
            'refreshToken',
            `demo_refresh_token_${Date.now()}`
          )
          localStorage.setItem('userData', JSON.stringify(demoUser))
        }

        console.log('🚀 Demo login successful - Development Mode')
        return true
      }

      // Development mode: provide helpful error message for demo credentials in production
      if (
        !environment.isDevelopment &&
        username === 'demo' &&
        password === 'demo'
      ) {
        set({
          error: 'Demo credentials are only available in development mode.',
          isLoading: false,
          isAuthenticated: false,
          user: null,
          authToken: null,
          refreshToken: null
        })
        return false
      }

      try {
        const response = await apiClient.post<LoginResponse>('/token/', {
          username,
          password
        })
        const { access, refresh } = response.data

        if (
          access &&
          refresh &&
          typeof access === 'string' &&
          typeof refresh === 'string'
        ) {
          set({
            isAuthenticated: true,
            authToken: access,
            refreshToken: refresh,
            isLoading: false,
            error: null
          })

          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', access)
            localStorage.setItem('refreshToken', refresh)
          }
          // TODO: The API should return the user object on login.
          // For now, we'll assume the demo user is the one logging in.
          set({ user: demoUser })
          if (typeof window !== 'undefined') {
            localStorage.setItem('userData', JSON.stringify(demoUser))
          }
          await useProfileStore
            .getState()
            .fetchProfile(demoUser.id.toString(), true)

          return true
        }
        throw new Error('Invalid token response from server.')
      } catch (err) {
        const errorMessage =
          (err as ApiError)?.message ||
          'Login failed. Please check your credentials.'
        set({
          error: errorMessage,
          isLoading: false,
          isAuthenticated: false,
          user: null,
          authToken: null,
          refreshToken: null
        })
        return false
      }
    },
    logout: internalLogout,
    setUser: (userData: User | null): void => set({ user: userData }),
    getAuthToken: (): string | null => get().authToken,
    handleTokenRefresh: async (): Promise<string | null> => {
      const currentRefreshToken = get().refreshToken
      if (!currentRefreshToken) {
        internalLogout()
        return null
      }

      try {
        console.log('Attempting to refresh token in authStore...')
        const response = await apiClient.post<TokenRefreshResponse>(
          '/token/refresh/',
          { refresh: currentRefreshToken }
        )

        const newAccessToken = response.data.access
        set({ authToken: newAccessToken })
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', newAccessToken)
        }
        if (response.data.refresh) {
          set({ refreshToken: response.data.refresh })
          if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', response.data.refresh)
          }
        }
        return newAccessToken
      } catch (refreshError) {
        console.error('Token refresh failed in authStore:', refreshError)
        internalLogout()
        return null
      }
    },
    checkAuth: (): void => {
      const { authToken, refreshToken } = getInitialTokens()
      if (authToken && refreshToken) {
        set({ isAuthenticated: true, authToken, refreshToken })
        const currentUser = get().user
        if (currentUser?.id) {
          void useProfileStore
            .getState()
            .fetchProfile(String(currentUser.id), get().isAuthenticated)
        }
      } else {
        get().logout()
      }
    }
  }
})

useAuthStore.getState().checkAuth()
