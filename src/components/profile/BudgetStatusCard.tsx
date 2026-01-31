import React from 'react';

interface BudgetStatusCardProps {
  budget: {
    amount: number;
    period: string;
    startDate: string;
  };
  spending: {
    spent: number;
    transactions: { amount: number; date: string }[];
  };
  preferences: {
    dailyBudgetDays?: number;
  };
  t: (key: string) => string;
}

const BudgetStatusCard: React.FC<BudgetStatusCardProps> = ({ budget, spending, preferences, t }) => {
  const isDailyWithDuration =
    budget.period === 'daily' &&
    preferences.dailyBudgetDays &&
    preferences.dailyBudgetDays > 0;
  const totalAmount = isDailyWithDuration
    ? budget.amount * (preferences.dailyBudgetDays || 1)
    : budget.amount;
  const totalSpentSinceStart = spending.transactions
    .filter((tx) => new Date(tx.date) >= new Date(budget.startDate))
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="mt-4 w-full space-y-2 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
      <p className="font-semibold text-foreground" lang="no">{t(`budget.status`)}</p>
      <div className="flex justify-between">
        <span lang="no">{t(`budget.dailyBudget`)}</span>
        <span className="font-medium">{budget.amount} kr</span>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span lang="no">{t(`budget.spent`)}</span>
        <span>-{spending.spent} kr</span>
      </div>
      <div className="mt-1 flex justify-between border-t border-border/50 pt-1 font-medium">
        <span lang="no">{t(`budget.leftover`)}</span>
        <span>{budget.amount - spending.spent} kr</span>
      </div>

      {isDailyWithDuration && (
        <div className="mt-2 border-t border-border/50 pt-2">
          <div className="flex justify-between">
            <span>Totalt ({preferences.dailyBudgetDays} dager):</span>
            <span className="font-bold text-primary">{totalAmount} kr</span>
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span lang="no">{t(`budget.spent`)}</span>
            <span className="text-destructive">
              -{totalSpentSinceStart.toFixed(0)} kr
            </span>
          </div>
          <div className="mt-1 flex justify-between text-xs font-medium text-muted-foreground">
            <span lang="no">{t(`budget.leftovertotal`)}</span>
            <span className="text-foreground">
              {Math.max(0, totalAmount - totalSpentSinceStart).toFixed(0)} kr
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetStatusCard;
