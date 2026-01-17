import { Transaction, Budget } from '@/types';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateSavings(transactions: Transaction[]): number {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

export function calculateMonthlyExpenses(transactions: Transaction[], month: Date): number {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  
  return transactions
    .filter((t) => {
      const transactionDate = parseISO(t.date);
      return t.type === 'expense' && isWithinInterval(transactionDate, { start, end });
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateMonthlyIncome(transactions: Transaction[], month: Date): number {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  
  return transactions
    .filter((t) => {
      const transactionDate = parseISO(t.date);
      return t.type === 'income' && isWithinInterval(transactionDate, { start, end });
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getCategoryExpenses(transactions: Transaction[], category: string): number {
  return transactions
    .filter((t) => t.type === 'expense' && t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateBudgetHealth(
  transactions: Transaction[],
  budgets: Budget[]
): number {
  if (budgets.length === 0) return 100;

  const currentMonth = new Date();
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);

  const monthlyExpenses = transactions
    .filter((t) => {
      const transactionDate = parseISO(t.date);
      return t.type === 'expense' && isWithinInterval(transactionDate, { start, end });
    })
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  let totalScore = 0;
  let totalWeight = 0;

  budgets.forEach((budget) => {
    const spent = monthlyExpenses[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    let score = 100;

    if (percentage > 100) {
      score = Math.max(0, 100 - (percentage - 100) * 2);
    } else if (percentage > 80) {
      score = 100 - (percentage - 80) * 2;
    }

    totalScore += score * budget.amount;
    totalWeight += budget.amount;
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 100;
}

export function getFinancialHealthScore(transactions: Transaction[]): number {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  
  if (income === 0) return 0;
  
  const savingsRate = ((income - expenses) / income) * 100;
  
  let score = 50; // Base score
  
  // Savings rate contribution (0-30 points)
  if (savingsRate >= 20) score += 30;
  else if (savingsRate >= 10) score += 20;
  else if (savingsRate >= 5) score += 10;
  else if (savingsRate < 0) score -= 20;
  
  // Expense consistency (0-20 points)
  const monthlyExpenses = getLast6MonthsExpenses(transactions);
  const avgExpense = monthlyExpenses.reduce((a, b) => a + b, 0) / monthlyExpenses.length;
  const variance = monthlyExpenses.reduce((sum, exp) => sum + Math.pow(exp - avgExpense, 2), 0) / monthlyExpenses.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = avgExpense > 0 ? stdDev / avgExpense : 1;
  
  if (coefficientOfVariation < 0.2) score += 20;
  else if (coefficientOfVariation < 0.4) score += 10;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getLast6MonthsExpenses(transactions: Transaction[]): number[] {
  const months: number[] = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(calculateMonthlyExpenses(transactions, month));
  }
  
  return months;
}

