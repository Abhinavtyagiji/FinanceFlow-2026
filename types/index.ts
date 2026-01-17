export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Budget {
  category: string;
  amount: number;
  period: 'monthly';
}

export interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  darkMode: boolean;
}

