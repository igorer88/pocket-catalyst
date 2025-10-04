import { create } from 'zustand'

export interface ApiTransaction {
  id: string
  date: string
  category?: { id: string; title: string } | null
  description: string
  amount: string
  type: 'income' | 'expense'
  accountCurrency?: string
}

const MOCK_API_TRANSACTIONS: ApiTransaction[] = [
  {
    id: 'api_inc1',
    date: '2023-10-01',
    category: { id: 'cat_salary', title: 'Salary' },
    description: 'Monthly paycheck',
    amount: '5000.00',
    type: 'income',
    accountCurrency: 'USD'
  },
  {
    id: 'api_inc2',
    date: '2023-10-05',
    category: { id: 'cat_freelance', title: 'Freelance' },
    description: 'Web design project',
    amount: '750.00',
    type: 'income',
    accountCurrency: 'USD'
  },
  {
    id: 'api_exp1',
    date: '2023-10-02',
    category: { id: 'cat_groceries', title: 'Groceries' },
    description: 'Supermarket shopping',
    amount: '125.50',
    type: 'expense',
    accountCurrency: 'USD'
  },
  {
    id: 'api_exp2',
    date: '2023-10-07',
    category: { id: 'cat_dining', title: 'Dining Out' },
    description: 'Dinner with friends',
    amount: '60.00',
    type: 'expense',
    accountCurrency: 'EUR'
  }
]

interface TransactionState {
  transactions: ApiTransaction[]
  isLoading: boolean
  error: string | null
  fetchTransactions: () => Promise<void>
}

export const useTransactionStore = create<TransactionState>(set => ({
  transactions: [],
  isLoading: false,
  error: null,
  fetchTransactions: async () => {
    set({ isLoading: true, error: null })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      set({ transactions: MOCK_API_TRANSACTIONS, isLoading: false })
    } catch (err) {
      set({
        error: (err as Error).message || 'Failed to fetch transactions',
        isLoading: false
      })
    }
  }
}))
