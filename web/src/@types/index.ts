export interface User {
  id: string
  username: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface Profile {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  language: string
  displayCurrency: string
  extraSettings: Record<string, unknown>
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface Security {
  id: string
  userId: string
  pinAttempts: number
  pinLockedUntil: string | null
  pinHint: string | null
  recoveryEmail: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
}

export interface Account {
  id: string
  name: string
  balance: number
  currency: string
  created_at: string
  modified_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  created_at: string
  modified_at: string
}

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  date: string
  amount: string
  type: TransactionType
  description: string
  account: string
  category?: string | null
  created_at: string
  modified_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
