import { create } from 'zustand'

import apiClient from '@/config/api-client'
import { ApiError } from '@/utils'

interface SecuritySettings {
  twoFactorEnabled: boolean
  passwordLastChanged: string | null
  activeSessions: number
  securityEvents: SecurityEvent[]
}

interface SecurityEvent {
  id: string
  type:
    | 'login'
    | 'password_change'
    | 'two_factor_enabled'
    | 'two_factor_disabled'
  timestamp: string
  ipAddress: string
  userAgent: string
}

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface SecurityState {
  settings: SecuritySettings | null
  isLoading: boolean
  error: string | null
  fetchSecuritySettings: (userId: string) => Promise<void>
  changePassword: (userId: string, data: ChangePasswordData) => Promise<void>
  clearSecurityData: () => void
}

export const useSecurityStore = create<SecurityState>((set, _get) => ({
  settings: null,
  isLoading: false,
  error: null,
  fetchSecuritySettings: async (userId: string): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<SecuritySettings>(
        `users/${userId}/security`
      )
      set({ settings: response.data, isLoading: false })
    } catch (err: unknown) {
      const errorMsg =
        (err as ApiError)?.message || 'Failed to fetch security settings'
      set({ settings: null, error: errorMsg, isLoading: false })
      console.error('Error fetching security settings:', err)
    }
  },
  changePassword: async (
    userId: string,
    data: ChangePasswordData
  ): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.post(`users/${userId}/security/change-password`, data)
      set({ isLoading: false })
    } catch (err: unknown) {
      const errorMsg = (err as ApiError)?.message || 'Failed to change password'
      set({ error: errorMsg, isLoading: false })
      console.error('Error changing password:', err)
      throw err
    }
  },
  clearSecurityData: (): void => {
    set({ settings: null, isLoading: false, error: null })
  }
}))
