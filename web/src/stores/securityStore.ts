import { create } from 'zustand'

import { Security } from '@/@types'
import apiClient from '@/config/api-client'
import { ApiError } from '@/utils'

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface UpdateSecuritySettingsData {
  pin?: string
  pinHint?: string
  recoveryEmail?: string
  phone?: string
}

interface SecurityState {
  settings: Security | null
  isLoading: boolean
  error: string | null
  fetchSecuritySettings: (userId: string) => Promise<void>
  changePassword: (userId: string, data: ChangePasswordData) => Promise<void>
  updateSecuritySettings: (
    userId: string,
    data: UpdateSecuritySettingsData
  ) => Promise<void>
  clearSecurityData: () => void
}

export const useSecurityStore = create<SecurityState>((set, _get) => ({
  settings: null,
  isLoading: false,
  error: null,
  fetchSecuritySettings: async (userId: string): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<Security>(`users/${userId}/security`)
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
      await apiClient.patch(`users/${userId}`, data)
      set({ isLoading: false })
    } catch (err: unknown) {
      const errorMsg = (err as ApiError)?.message || 'Failed to change password'
      set({ error: errorMsg, isLoading: false })
      console.error('Error changing password:', err)
      throw err
    }
  },
  updateSecuritySettings: async (
    userId: string,
    data: UpdateSecuritySettingsData
  ): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.patch<Security>(
        `users/${userId}/security`,
        data
      )
      set({ settings: response.data, isLoading: false })
    } catch (err: unknown) {
      const errorMsg =
        (err as ApiError)?.message || 'Failed to update security settings'
      set({ error: errorMsg, isLoading: false })
      console.error('Error updating security settings:', err)
      throw err
    }
  },
  clearSecurityData: (): void => {
    set({ settings: null, isLoading: false, error: null })
  }
}))
