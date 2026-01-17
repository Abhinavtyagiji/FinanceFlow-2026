'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateSavings,
  calculateBudgetHealth,
  getFinancialHealthScore,
} from '@/utils/calculations';
import { TrendingUp, TrendingDown, PiggyBank, Heart } from 'lucide-react';

export default function OverviewCards() {
  const transactions = useStore((state) => state.transactions);
  const budgets = useStore((state) => state.budgets);

  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  const savings = calculateSavings(transactions);
  const budgetHealth = calculateBudgetHealth(transactions, budgets);
  const financialHealth = getFinancialHealthScore(transactions);

  const cards = [
    {
      title: 'Total Income',
      value: `$${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Expenses',
      value: `$${expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingDown,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Savings',
      value: `$${savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: PiggyBank,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Financial Health',
      value: `${financialHealth}/100`,
      icon: Heart,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      subtitle: `Budget Health: ${budgetHealth}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass rounded-2xl p-6 backdrop-blur-xl border border-white/30 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} ${card.bgColor}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {card.value}
            </p>
            {card.subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {card.subtitle}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

