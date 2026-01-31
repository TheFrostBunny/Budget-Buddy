import { useBudget } from '@/components/budget/budget-provider';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingUp } from 'lucide-react';
import React from 'react';
import type {} from 'react/jsx-runtime';
export interface BudgetOverviewProps {
  currency: string;
  convert: (amount: number) => number;
  loadingRates: boolean;
}
const BudgetOverview: React.FC<BudgetOverviewProps> = React.memo(({ currency, convert, loadingRates }) => {
  const { budget, spending, savings, completePeriod } = useBudget();
  const { t } = useTranslation();

  if (!budget)
    return <div className="p-4 text-center text-muted-foreground">{t('dashboard.noBudget')}</div>;

  const spent = spending.spent;
  const covered = spending.coveredBySavings || 0;
  const remaining = budget.amount - (spent - covered);
  const percentage = Math.min((spent / budget.amount) * 100, 100);
  const isOverBudget = remaining < 0;

  return (
    <section className="mb-6">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                {t('dashboard.overview.remaining')}
              </p>
              <h2
                className={`text-4xl font-bold ${isOverBudget ? 'text-red-500' : 'text-primary'}`}
              >
                {remaining.toFixed(0)} kr
              </h2>
            </div>
            <div
              className={`rounded-full p-3 ${isOverBudget ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-primary/20 text-primary'}`}
            >
              {isOverBudget ? (
                <AlertCircle className="h-6 w-6" />
              ) : (
                <TrendingUp className="h-6 w-6" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t('dashboard.overview.spent')}{' '}
                <span className="font-medium text-foreground">{spent.toFixed(0)} kr</span>
              </span>
              <span className="text-muted-foreground">
                {t('dashboard.overview.total')}{' '}
                <span className="font-medium text-foreground">{budget.amount} kr</span>
              </span>
            </div>
            <Progress
              value={percentage}
              className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
              indicatorClassName={isOverBudget ? 'bg-red-500' : ''}
            />

            {savings > 0 && (
              <div className="mt-4 flex items-center justify-between border-t pt-4 animate-in fade-in slide-in-from-top-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {t('dashboard.overview.savedTotal')}
                </span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {savings.toFixed(0)} kr
                </span>
              </div>
            )}

            {remaining > 0 && (
              <div className="mt-2 text-center text-xs text-muted-foreground">
                {t('dashboard.overview.autoSaveInfo')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
});
export default BudgetOverview;
