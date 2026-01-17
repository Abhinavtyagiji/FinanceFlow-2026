import { Transaction } from '@/types';

export function exportToCSV(transactions: Transaction[]): void {
  const headers = ['Type', 'Amount', 'Category', 'Date', 'Notes'];
  const rows = transactions.map((t) => [
    t.type,
    t.amount.toString(),
    t.category,
    t.date,
    t.notes || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `financeflow-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

