import { useMemo } from 'react';

function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function groupBy(transactions: { date: string; amount: number }[], type: 'daily' | 'weekly' | 'monthly') {
  return transactions.reduce((acc, tx) => {
    let key;
    if (type === 'weekly') {
      const d = new Date(tx.date);
      const week = getWeekNumber(d);
      key = `${d.getFullYear()}-Uke${week}`;
    } else if (type === 'monthly') {
      const d = new Date(tx.date);
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    } else {
      key = new Date(tx.date).toLocaleDateString('nb-NO', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    acc[key] = (acc[key] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);
}

export function useBudgetGraphData(transactions: { date: string; amount: number }[], type: 'daily' | 'weekly' | 'monthly') {
  const grouped = useMemo(() => groupBy(transactions, type), [transactions, type]);
  const data = useMemo(() =>
    Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount: Number(amount) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  , [grouped]);
  return { grouped, data };
}
