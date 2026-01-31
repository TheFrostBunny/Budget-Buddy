import { ChartContainer } from '@/components/ui/chart';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useBudget } from '@/components/budget/budget-provider';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const groupBy = (transactions, type) => {
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
};

function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

const BudgetAnalysisGraph = () => {
  const { spending, budget } = useBudget();
  const { t } = useTranslation();
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [today, setToday] = useState(() => new Date().toDateString());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toDateString();
      if (now !== today) {
        setToday(now);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [today]);


  const grouped = groupBy(spending.transactions, type);
  let data = Object.entries(grouped)
    .map(([date, amount]) => ({ date, amount: Number(amount) }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let pieData: { name: string; value: number }[] = [];
  if (chartType === 'pie') {
    if (type === 'daily') {
      const todayKey = new Date().toLocaleDateString('nb-NO', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const spent = grouped[todayKey] || 0;
      const budgetAmount = budget?.amount || 0;
      const spentCapped = Math.min(spent, budgetAmount);
      const remaining = Math.max(budgetAmount - spent, 0);
      pieData = [
        { name: t('dashboard.graph.spent', 'Spent'), value: spentCapped },
        { name: t('dashboard.graph.remaining', 'Remaining'), value: remaining },
      ];
    } else {
      pieData = data.map((d) => ({ name: d.date, value: Number(d.amount) }));
    }
  }

  if (data.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="mb-2 flex flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            className={`px-2 py-1 rounded text-xs border ${type === 'daily' ? 'bg-primary text-white' : 'bg-card'}`}
            onClick={() => setType('daily')}
          >
            {t('dashboard.graph.daily', 'Daglig')}
          </button>
          <button
            className={`px-2 py-1 rounded text-xs border ${type === 'weekly' ? 'bg-primary text-white' : 'bg-card'}`}
            onClick={() => setType('weekly')}
          >
            {t('dashboard.graph.weekly', 'Ukentlig')}
          </button>
          <button
            className={`px-2 py-1 rounded text-xs border ${type === 'monthly' ? 'bg-primary text-white' : 'bg-card'}`}
            onClick={() => setType('monthly')}
          >
            {t('dashboard.graph.monthly', 'Månedlig')}
          </button>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            className={`px-2 py-1 rounded text-xs border ${chartType === 'line' ? 'bg-primary text-white' : 'bg-card'}`}
            onClick={() => setChartType('line')}
          >
            {t('dashboard.graph.line', 'Linje')}
          </button>
          <button
            className={`px-2 py-1 rounded text-xs border ${chartType === 'bar' ? 'bg-primary text-white' : 'bg-card'}`}
            onClick={() => setChartType('bar')}
          >
            {t('dashboard.graph.bar', 'Søyle')}
          </button>
          <button
            className={`px-2 py-1 rounded text-xs border ${chartType === 'pie' ? 'bg-primary text-white' : 'bg-card'}`}
            onClick={() => setChartType('pie')}
          >
            {t('dashboard.graph.pie', 'Pai')}
          </button>
        </div>
      </div>
      <ChartContainer config={{ amount: { label: 'Forbruk', color: '#3b82f6' } }}>
        <ResponsiveContainer width="100%" height={250}>
          {(() => {
            if (chartType === 'line') {
              return (
                <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot />
                </LineChart>
              );
            }
            if (chartType === 'bar') {
              return (
                <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              );
            }
            if (chartType === 'pie') {
              return (
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, idx) => {
                      if (type === 'daily') {
                        return (
                          <Cell
                            key={`cell-${idx}`}
                            fill={entry.name === t('dashboard.graph.spent', 'Spent') ? '#3b82f6' : '#22c55e'}
                          />
                        );
                      }
                      return <Cell key={`cell-${idx}`} fill="#3b82f6" />;
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              );
            }
            return null;
          })()}
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default BudgetAnalysisGraph;
