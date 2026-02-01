import { ChartContainer } from '@/components/ui/chart';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useBudget } from '@/components/budget/budget-provider';
import { useState, useEffect } from 'react';
import { ButtonGroup } from '@/components/ui/ButtonGroup';
import { useProfileCurrency } from '@/hooks/useProfileCurrency';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useBudgetPieData } from '@/hooks/useBudgetPieData';
import { useBudgetGraphData } from '@/hooks/useBudgetGraphData';



const BudgetAnalysisGraph = () => {
  const { spending, budget } = useBudget();
  const [currency] = useProfileCurrency();
  const { t } = useTranslation();
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const chartColors = ['#3b82f6', '#22c55e', '#f59e42', '#ef4444', '#a855f7', '#14b8a6', '#fbbf24', '#6366f1'];
  const { grouped, data } = useBudgetGraphData(spending.transactions, type);
  const pieData = useBudgetPieData(chartType, type, grouped, budget, t, data);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="text-muted-foreground animate-pulse">{t('dashboard.graph.loading', 'Laster data...')}</span>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    const noDataText = t('dashboard.graph.noData', 'Ingen data å vise') || 'Ingen data å vise';
    return (
      <div className="flex items-center justify-center h-48">
        <span className="text-muted-foreground">{noDataText}</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-2 flex flex-wrap gap-2">
        <ButtonGroup
          options={[
            { value: 'daily', label: t('dashboard.graph.daily', 'Daglig') },
            { value: 'weekly', label: t('dashboard.graph.weekly', 'Ukentlig') },
            { value: 'monthly', label: t('dashboard.graph.monthly', 'Månedlig') },
          ]}
          value={type}
          onChange={v => setType(v as 'daily' | 'weekly' | 'monthly')}
        />
        <ButtonGroup
          options={[
            { value: 'line', label: t('dashboard.graph.line', 'Linje') },
            { value: 'bar', label: t('dashboard.graph.bar', 'Søyle') },
            { value: 'pie', label: t('dashboard.graph.pie', 'Pai') },
          ]}
          value={chartType}
          onChange={v => setChartType(v as 'line' | 'bar' | 'pie')}
          className="ml-4"
        />
      </div>
      <ChartContainer config={{ amount: { label: t('dashboard.graph.amount', 'Forbruk'), color: chartColors[0] } }}>
        <ResponsiveContainer width="100%" height={250}>
          {(() => {
            if (chartType === 'line') {
              return (
                <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} label={{ value: t('dashboard.graph.date', 'Dato'), position: 'insideBottom', offset: -5 }} />
                  <YAxis fontSize={12} label={{ value: t('dashboard.graph.amount', 'Forbruk'), angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} ${currency || ''}`} labelFormatter={label => `${t('dashboard.graph.date', 'Dato')}: ${label}`} />
                  <Line type="monotone" dataKey="amount" stroke={chartColors[0]} strokeWidth={2} dot label={{ position: 'top', fill: chartColors[0], fontSize: 10 }} />
                </LineChart>
              );
            }
            if (chartType === 'bar') {
              return (
                <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} label={{ value: t('dashboard.graph.date', 'Dato'), position: 'insideBottom', offset: -5 }} />
                  <YAxis fontSize={12} label={{ value: t('dashboard.graph.amount', 'Forbruk'), angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => `${value.toLocaleString()} ${currency || ''}`} labelFormatter={label => `${t('dashboard.graph.date', 'Dato')}: ${label}`} />
                  <Bar dataKey="amount" fill={chartColors[1]} label={{ position: 'top', fill: chartColors[1], fontSize: 10 }} />
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
                    label={({ name, value }) => `${name}: ${value.toLocaleString()}${currency ? ' ' + currency : ''}`}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={type === 'daily' ? (entry.name === t('dashboard.graph.spent', 'Spent') ? chartColors[0] : chartColors[1]) : chartColors[idx % chartColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString()}${currency ? ' ' + currency : ''}`, name]} />
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
