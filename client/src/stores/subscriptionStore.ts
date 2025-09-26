import { create } from 'zustand'

export interface ApiSubscription {
  id: string;
  description: string;
  subscription_service?: { name: string } | null;
  category?: { id: string; title: string } | null;
  amount: string;
  currency: string;
  frequency_unit: 'day' | 'week' | 'month' | 'year';
  frequency_value: number;
  next_due_date: string;
  is_active: boolean;
  type: 'income' | 'expense';
}

const MOCK_API_SUBSCRIPTIONS: ApiSubscription[] = [
  {
    id: 'api_sub1',
    subscription_service: { name: 'Netflix' },
    description: 'Premium Plan',
    category: { id: 'cat_entertainment', title: 'Entertainment' },
    amount: '19.99',
    currency: 'USD',
    frequency_unit: 'month',
    frequency_value: 1,
    next_due_date: '2023-11-01',
    is_active: true,
    type: 'expense',
  },
  {
    id: 'api_sub2',
    subscription_service: { name: 'Spotify' },
    description: 'Family Plan',
    category: { id: 'cat_music', title: 'Music' },
    amount: '15.99',
    currency: 'USD',
    frequency_unit: 'month',
    frequency_value: 1,
    next_due_date: '2023-11-15',
    is_active: true,
    type: 'expense',
  },
  {
    id: 'api_sub3',
    description: 'Gym Membership',
    category: { id: 'cat_health', title: 'Health' },
    amount: '50.00',
    currency: 'USD',
    frequency_unit: 'month',
    frequency_value: 1,
    next_due_date: '2023-11-10',
    is_active: false,
    type: 'expense',
  },
]

interface SubscriptionState {
  subscriptions: ApiSubscription[];
  isLoading: boolean;
  error: string | null;
  fetchSubscriptions: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>(set => ({
  subscriptions: [],
  isLoading: false,
  error: null,
  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      set({ subscriptions: MOCK_API_SUBSCRIPTIONS, isLoading: false })
    } catch (err) {
      set({
        error: (err as Error).message || 'Failed to fetch subscriptions',
        isLoading: false,
      })
    }
  },
}))
