import { create } from 'zustand'

import type { Profile } from '@/@types'
import { apiClient } from '@/config'
import { ApiError } from '@/utils'

interface ProfileState {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  fetchProfile: (userId: string, isAuthenticated?: boolean) => Promise<void>
  setProfile: (profile: Profile | null) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>(set => ({
  profile: null,
  isLoading: false,
  error: null,
  fetchProfile: async (
    userId: string,
    isAuthenticated = true
  ): Promise<void> => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping profile fetch.')
      set({ profile: null, isLoading: false, error: null })
      return
    }

    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<Profile>(`users/${userId}/profile`)
      set({ profile: response.data, isLoading: false })
    } catch (err: unknown) {
      const errorMsg = (err as ApiError)?.message || 'Failed to fetch profile'
      set({ profile: null, error: errorMsg, isLoading: false })
      console.error('Error fetching profile:', err)
    }
  },
  setProfile: (profile: Profile | null): void => {
    set({ profile: profile, isLoading: false, error: null })
  },
  clearProfile: (): void => {
    set({ profile: null, isLoading: false, error: null })
  }
}))
