import { create } from 'zustand'

import { Account } from '@/@types'
import { apiClient } from '@/config'
import { ApiError } from '@/utils'

interface AccountsState {
  isLoading: boolean
  error: string | null
  accounts: Account[] | null
  selectedAccount: Account | null
  fetchAccounts: () => Promise<void>
  setAccounts: (accounts: Account[]) => void
  setSelectedAccount: (account: Account | null) => void
}

export const useAccountsStore = create<AccountsState>(set => ({
  accounts: [],
  selectedAccount: null,
  isLoading: false,
  error: null,
  setAccounts: accounts => set({ accounts }),
  setSelectedAccount: account => set({ selectedAccount: account }),
  fetchAccounts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<Account[]>('/accounts/')
      set({ accounts: response.data, isLoading: false })
    } catch (err: unknown) {
      set({ error: (err as ApiError).message, isLoading: false })
      console.error('Error fetching accounts:', err)
    }
  }
}))
