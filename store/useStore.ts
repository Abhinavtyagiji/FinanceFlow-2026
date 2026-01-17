import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Category, Budget } from '@/types';

interface StoreState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  darkMode: boolean;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  setBudget: (budget: Budget) => void;
  deleteBudget: (category: string) => void;
  toggleDarkMode: () => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#FF6B6B' },
  { id: '2', name: 'Shopping', color: '#4ECDC4' },
  { id: '3', name: 'Transportation', color: '#45B7D1' },
  { id: '4', name: 'Bills & Utilities', color: '#FFA07A' },
  { id: '5', name: 'Entertainment', color: '#98D8C8' },
  { id: '6', name: 'Healthcare', color: '#F7DC6F' },
  { id: '7', name: 'Education', color: '#BB8FCE' },
  { id: '8', name: 'Salary', color: '#52BE80' },
  { id: '9', name: 'Freelance', color: '#5DADE2' },
  { id: '10', name: 'Investment', color: '#F4D03F' },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: [],
      categories: defaultCategories,
      budgets: [],
      darkMode: false,
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      setBudget: (budget) =>
        set((state) => {
          const existing = state.budgets.find((b) => b.category === budget.category);
          if (existing) {
            return {
              budgets: state.budgets.map((b) =>
                b.category === budget.category ? budget : b
              ),
            };
          }
          return { budgets: [...state.budgets, budget] };
        }),
      deleteBudget: (category) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.category !== category),
        })),
      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.darkMode;
          if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('dark', newMode);
          }
          return { darkMode: newMode };
        }),
    }),
    {
      name: 'financeflow-storage',
    }
  )
);

