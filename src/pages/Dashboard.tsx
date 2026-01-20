import React, { useState, useEffect } from 'react';
import BudgetAnalysisGraph from '@/components/budget/BudgetAnalysisGraph';
import { ChartPie } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/components/budget/budget-provider';
import { Wallet, Calendar, Clock, Plus, Check, TrendingUp, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExportExcelButton } from '@/components/budget/ExportExcelButton';

const Dashboard = () => {
  const { t } = useTranslation();
  const { budget, spending, setBudget } = useBudget();
  const [budgetInput, setBudgetInput] = useState('');
  const [betaEnabled, setBetaEnabled] = useState(false);

  const handleSetBudget = () => {
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount > 0) {
      setBudget(amount, 'weekly');
      setBudgetInput('');
    }
  };

  useEffect(() => {
    setBetaEnabled(localStorage.getItem('beta_features') === 'true');
    const handler = () => setBetaEnabled(localStorage.getItem('beta_features') === 'true');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <div className="space-y-6 p-2 pt-4 sm:p-4 sm:pt-6">
      <header className="mb-6 flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        </div>
      </header>
      <Card>
        <CardHeader></CardHeader>
        <CardContent className="space-y-4">
          <BudgetOverview />
          <AddSpentAmount />
          <ExpenseHistory betaEnabled={betaEnabled} />
        </CardContent>
      </Card>
    </div>
  );
};

const ExpenseHistory = ({ betaEnabled }) => {
  const { spending, removeSpending } = useBudget();
  const { t } = useTranslation();

  if (!spending.transactions.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        {t('dashboard.history.noExpenses', 'Ingen utgifter registrert enda.')}
      </div>
    );
  }

  const sortedTransactions = [...spending.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const grouped: Record<string, typeof sortedTransactions> = {};
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

  const [showGraph, setShowGraph] = useState(false);
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
              data={spending.transactions.map((tx) => ({
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
          <Card>
            <CardContent className="p-0">
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
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {tx.description || t('dashboard.history.noDescription')}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {timeStr}
                        </span>
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
            </CardContent>
          </Card>
        </div>
      ))}
    </section>
  );
};

const AddSpentAmount = () => {
  const { addSpending } = useBudget();
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [success, setSuccess] = useState(false);

  const handleAdd = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0 && date && time) {
      addSpending(value, undefined, 'Utgift');
      setAmount('');
      setSuccess(true);
      toast({
        title: 'Utgift lagret!',
        description: `Du har lagt til ${value} kr.`,
      });
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <section className="mx-auto w-full max-w-md">
      <Card className="overflow-hidden border-none bg-white/50 shadow-md ring-1 ring-border backdrop-blur-sm dark:bg-card/50">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-primary">
            <Wallet className="h-5 w-5" />
            {t('dashboard.addExpense.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-muted-foreground">
              {t('dashboard.addExpense.amount')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                kr
              </span>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="h-14 border-muted-foreground/20 pl-12 text-2xl font-bold focus-visible:ring-primary/30 sm:h-16 sm:text-3xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3 w-3" /> {t('dashboard.addExpense.date')}
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="ml-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Clock className="h-3 w-3" /> {t('dashboard.addExpense.time')}
              </label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="font-medium"
              />
            </div>
          </div>

          <Button
            onClick={handleAdd}
            disabled={!amount || parseFloat(amount) <= 0}
            className={`h-12 w-full text-lg font-medium transition-all duration-300 ${
              success ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {success ? (
              <span className="flex items-center gap-2">
                <Check className="h-6 w-6" /> {t('dashboard.addExpense.saved')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-6 w-6" /> {t('dashboard.addExpense.add')}
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

const BudgetOverview = () => {
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
};

export default Dashboard;
