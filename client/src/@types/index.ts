export interface User {
  id: string | number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  is_active: boolean;
}

export interface Profile {
  id: number;
  user: number;
  username: string;
  display_currency: string;
  created_at: string;
  modified_at: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  created_at: string;
  modified_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  modified_at: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  type: TransactionType;
  description: string;
  account: string;
  category?: string | null;
  created_at: string;
  modified_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
