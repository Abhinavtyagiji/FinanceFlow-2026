'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { calculateMonthlyExpenses, calculateMonthlyIncome, getCategoryExpenses } from '@/utils/calculations';
import { format, subMonths, startOfMonth } from 'date-fns';

export default function ChartsSection() {
  const transactions = useStore((state) => state.transactions);
  const categories = useStore((state) => state.categories);

  // Prepare monthly trend data (last 6 months)
  const monthlyTrendData = Array.from({ length: 6 }, (_, i) => {
    const month = startOfMonth(subMonths(new Date(), 5 - i));
    return {
      month: format(month, 'MMM yyyy'),
      expenses: calculateMonthlyExpenses(transactions, month),
      income: calculateMonthlyIncome(transactions, month),
    };
  });

  // Prepare category-wise spending data
  const categoryData = categories
    .filter((cat) => {
      const expense = getCategoryExpenses(transactions, cat.name);
      return expense > 0;
    })
    .map((cat) => ({
      name: cat.name,
      value: getCategoryExpenses(transactions, cat.name),
      color: cat.color,
    }))
    .sort((a, b) => b.value - a.value);

  // Prepare income vs expenses comparison (last 6 months)
  const comparisonData = monthlyTrendData.map((data) => ({
    month: data.month,
    Income: data.income,
    Expenses: data.expenses,
  }));

  return (
    <div className="mt-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 backdrop-blur-xl border border-white/30 dark:border-white/10"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Monthly Expense Trends
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyTrendData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              tick={{ fill: 'currentColor' }}
              className="text-xs"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              name="Expenses"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              name="Income"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-6 backdrop-blur-xl border border-white/30 dark:border-white/10"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Category-wise Spending
          </h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              No expense data available
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-6 backdrop-blur-xl border border-white/30 dark:border-white/10"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Income vs Expenses
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis
                tick={{ fill: 'currentColor' }}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="Income" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

