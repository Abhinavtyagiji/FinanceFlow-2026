'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Target } from 'lucide-react';
import { Budget } from '@/types';
import { getCategoryExpenses } from '@/utils/calculations';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export default function BudgetPlanner() {
  const budgets = useStore((state) => state.budgets);
  const categories = useStore((state) => state.categories);
  const transactions = useStore((state) => state.transactions);
  const setBudget = useStore((state) => state.setBudget);
  const deleteBudget = useStore((state) => state.deleteBudget);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budget: Budget = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: 'monthly',
    };
    setBudget(budget);
    setFormData({ category: '', amount: '' });
    setIsModalOpen(false);
  };

  const getCurrentMonthSpending = (category: string): number => {
    const currentMonth = new Date();
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    return transactions
      .filter((t) => {
        const transactionDate = parseISO(t.date);
        return (
          t.type === 'expense' &&
          t.category === category &&
          isWithinInterval(transactionDate, { start, end })
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || '#6B7280';
  };

  const expenseCategories = categories.filter(
    (c) =>
      !['Salary', 'Freelance', 'Investment'].includes(c.name)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 backdrop-blur-xl border border-white/30 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Budget Planner
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Set Budget
        </motion.button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {budgets.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No budgets set. Create your first budget!
            </p>
          ) : (
            budgets.map((budget) => {
              const spent = getCurrentMonthSpending(budget.category);
              const percentage = (spent / budget.amount) * 100;
              const remaining = budget.amount - spent;
              const isOverBudget = spent > budget.amount;

              return (
                <motion.div
                  key={budget.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 rounded-lg bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(budget.category) }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {budget.category}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Budget: ${budget.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteBudget(budget.category)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Spent: ${spent.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span
                        className={`font-semibold ${
                          isOverBudget
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {isOverBudget ? 'Over' : 'Remaining'}: $
                        {Math.abs(remaining).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-2.5 rounded-full ${
                          isOverBudget
                            ? 'bg-red-500'
                            : percentage > 80
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ maxWidth: '100%' }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {percentage.toFixed(1)}% of budget used
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {typeof window !== 'undefined' && isModalOpen &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'auto' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 w-full max-w-md backdrop-blur-xl relative z-[10000] shadow-2xl"
              style={{ pointerEvents: 'auto' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Set Monthly Budget
                </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-colors"
                  >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {expenseCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Budget Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-semibold"
                >
                  Set Budget
                </button>
              </form>
            </motion.div>
          </motion.div>,
          document.body
        )}
    </motion.div>
  );
}

