import { useMemo } from 'react';

interface PieDatum {
  name: string;
  value: number;
}

export function useBudgetPieData(
  chartType: 'line' | 'bar' | 'pie',
  type: 'daily' | 'weekly' | 'monthly',
  grouped: Record<string, number>,
  budget: { amount?: number } | undefined,
  t: (key: string, defaultValue: string) => string,
  data: { date: string; amount: number }[]
): PieDatum[] {
  return useMemo(() => {
    if (chartType === 'pie') {
      if (type === 'daily') {
        const todayKey = new Date().toLocaleDateString('nb-NO', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const spent = grouped[todayKey] || 0;
        const budgetAmount = budget?.amount || 0;
        const spentCapped = Math.min(spent, budgetAmount);
        const remaining = Math.max(budgetAmount - spent, 0);
        return [
          { name: t('dashboard.graph.spent', 'Spent'), value: spentCapped },
          { name: t('dashboard.graph.remaining', 'Remaining'), value: remaining },
        ];
      } else {
        return data.map((d) => ({ name: d.date, value: Number(d.amount) }));
      }
    }
    return [];
  }, [chartType, type, grouped, budget, t, data]);
}
