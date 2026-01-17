'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import OverviewCards from '@/components/OverviewCards';
import ExpenseTracker from '@/components/ExpenseTracker';
import ChartsSection from '@/components/ChartsSection';
import BudgetPlanner from '@/components/BudgetPlanner';
import CategoryManager from '@/components/CategoryManager';
import Header from '@/components/Header';

export default function Home() {
  const darkMode = useStore((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <OverviewCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ExpenseTracker />
          <BudgetPlanner />
        </div>
        <ChartsSection />
        <CategoryManager />
      </div>
    </main>
  );
}

