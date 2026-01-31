import React, { useState } from 'react';
// Legg til denne importen for å sikre at JSX-elementer gjenkjennes
import type {} from 'react/jsx-runtime';
import { useBudget } from '@/components/budget/budget-provider';
import { useTranslation } from 'react-i18next';
import { CardTitle } from '@/components/ui/card';
import { ChartPie } from 'lucide-react';
import { ExportExcelButton } from '@/components/budget/ExportExcelButton';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { categoryIcons } from './categoryIcons';
import BudgetAnalysisGraph from '@/components/budget/BudgetAnalysisGraph';

export interface ExpenseHistoryProps {
  betaEnabled: boolean;
  currency: string;
  convert: (amount: number) => number;
}
const ExpenseHistory: React.FC<ExpenseHistoryProps> = React.memo(({ betaEnabled, currency, convert }) => {
  const { spending, removeSpending } = useBudget();
  const { t } = useTranslation();
  const [showGraph, setShowGraph] = useState(false);

  if (!spending.transactions || !Array.isArray(spending.transactions) || !spending.transactions.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Det er ingen utgifter enda.
      </div>
    );
  }

  const sortedTransactions = [...spending.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  type Transaction = typeof sortedTransactions[0];
  const grouped: Record<string, Transaction[]> = {};
  sortedTransactions.forEach((tx) => {
    const date = new Date(tx.date).toLocaleDateString('nb-NO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const formattedDate = date.charAt(0).toUpperCase() + date.slice(1);
    if (!grouped[formattedDate]) grouped[formattedDate] = [];
    grouped[formattedDate].push(tx);
  });
  return (
    <section className="mt-8 space-y-6">
      <CardTitle className="flex items-center justify-between px-1 text-xl">
        <span className="flex items-center gap-2">
          {t('dashboard.history.title')}
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Vis budsjettanalyse-graf"
            className="rounded-full p-2 hover:bg-muted transition-colors ml-2"
            onClick={() => setShowGraph((v) => !v)}
          >
            <ChartPie className="h-6 w-6 text-primary" />
          </button>
          {betaEnabled && (
            <ExportExcelButton
              data={(spending.transactions as Transaction[]).map((tx) => ({
                Dato: new Date(tx.date).toLocaleString('nb-NO'),
                Beløp: tx.amount,
                Beskrivelse: tx.description || '',
                Butikk: tx.storeId || '',
              }))}
              filename="utgifter.xlsx"
              label="Eksporter til Excel"
            />
          )}
        </div>
      </CardTitle>
      {showGraph && (
        <div className="mb-4">
          <BudgetAnalysisGraph />
        </div>
      )}
      {Object.entries(grouped).map(([date, transactions]) => (
        <div key={date}>
          <h3 className="mb-2 px-1 text-sm font-medium text-muted-foreground">{date}</h3>
          <div className="card">
            <div className="p-0">
              <ul className="divide-y">
                {transactions.map((tx) => {
                  const dateObj = new Date(tx.date);
                  const timeStr = dateObj.toLocaleTimeString('nb-NO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <span>{categoryIcons[tx.category || 'Annet']}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {tx.description || t('dashboard.history.noDescription')}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {timeStr}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{tx.amount.toFixed(0)} kr</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSpending(tx.id)}
                          aria-label="Slett utgift"
                          className="h-auto w-auto p-0"
                        >
                          <Trash2 className="h-5 w-5 cursor-pointer text-red-500" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
});
export default ExpenseHistory;
