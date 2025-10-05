import { create } from 'zustand'

export interface ApiSubscription {
  id: string
  description: string
  subscriptionService?: { name: string } | null
  category?: { id: string; title: string } | null
  amount: string
  currency: string
  frequencyUnit: 'day' | 'week' | 'month' | 'year'
  frequencyValue: number
  nextDueDate: string
  isActive: boolean
  type: 'income' | 'expense'
}

const MOCK_API_SUBSCRIPTIONS: ApiSubscription[] = [
  {
    id: 'api_sub1',
    subscriptionService: { name: 'Netflix' },
    description: 'Premium Plan',
    category: { id: 'cat_entertainment', title: 'Entertainment' },
    amount: '19.99',
    currency: 'USD',
    frequencyUnit: 'month',
    frequencyValue: 1,
    nextDueDate: '2023-11-01',
    isActive: true,
    type: 'expense'
  },
  {
    id: 'api_sub2',
    subscriptionService: { name: 'Spotify' },
    description: 'Family Plan',
    category: { id: 'cat_music', title: 'Music' },
    amount: '15.99',
    currency: 'USD',
    frequencyUnit: 'month',
    frequencyValue: 1,
    nextDueDate: '2023-11-15',
    isActive: true,
    type: 'expense'
  },
  {
    id: 'api_sub3',
    description: 'Gym Membership',
    category: { id: 'cat_health', title: 'Health' },
    amount: '50.00',
    currency: 'USD',
    frequencyUnit: 'month',
    frequencyValue: 1,
    nextDueDate: '2023-11-10',
    isActive: false,
    type: 'expense'
  }
]

interface SubscriptionState {
  subscriptions: ApiSubscription[]
  isLoading: boolean
  error: string | null
  fetchSubscriptions: () => Promise<void>
}

export const useSubscriptionStore = create<SubscriptionState>(set => ({
  subscriptions: [],
  isLoading: false,
  error: null,
  fetchSubscriptions: async (): Promise<void> => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      set({ subscriptions: MOCK_API_SUBSCRIPTIONS, isLoading: false })
    } catch (err) {
      set({
        error: (err as Error).message || 'Failed to fetch subscriptions',
        isLoading: false
      })
    }
  }
}))
