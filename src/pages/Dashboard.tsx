import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/components/budget/budget-provider';
import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CurrencyConverter } from '@/components/budget/CurrencyConverter';
import ExpenseHistory from '@/components/budget/ExpenseHistory';
import AddSpentAmount from '@/components/budget/AddSpentAmount';
import BudgetOverview from '@/components/budget/BudgetOverview';

const Dashboard = () => {
  const { t } = useTranslation();
  const { spending, setBudget } = useBudget();
  const [budgetInput, setBudgetInput] = useState('');
  const [betaEnabled, setBetaEnabled] = useState(false);
  const [currency, setCurrency] = useState(() => localStorage.getItem('profileCurrency') || 'NOK');

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem('profileCurrency') || 'NOK';
      setCurrency(stored);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('profileCurrency', currency);
  }, [currency]);

  const handleSetBudget = () => {
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount > 0) {
      setBudget(amount, 'weekly');
      setBudgetInput('');
    }
  };

  const [rates, setRates] = useState({ NOK: 1 });
  const [loadingRates, setLoadingRates] = useState(false);
  const baseCurrency = 'NOK';

  useEffect(() => {
    if (currency === baseCurrency) {
      setRates({ [baseCurrency]: 1 });
      return;
    }
    setLoadingRates(true);
    fetch(`https://api.exchangerate.host/latest?base=${baseCurrency}&symbols=${currency}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates[currency]) {
          setRates({ [baseCurrency]: 1, [currency]: data.rates[currency] });
        }
      })
      .catch(() => setRates({ [baseCurrency]: 1 }))
      .finally(() => setLoadingRates(false));
  }, [currency]);

  const convert = (amount) => {
    if (currency === baseCurrency) return amount;
    if (rates[currency]) return amount * rates[currency];
    return amount;
  };

  const [selectedView, setSelectedView] = useState<'converter' | 'add'>('add');

  return (
    <div className="space-y-6 p-2 pt-4 sm:p-4 sm:pt-6">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card p-4 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="inline-flex rounded-md bg-muted p-1 shadow-inner">
            <button
              type="button"
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${selectedView === 'add' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setSelectedView('add')}
              aria-pressed={selectedView === 'add'}
            >
              <Wallet className="h-4 w-4" />
              {t('dashboard.addExpense.title', 'Legg til utgift')}
            </button>
            <button
              type="button"
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${selectedView === 'converter' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setSelectedView('converter')}
              aria-pressed={selectedView === 'converter'}
            >
              <span className="mr-1">💱</span>
              {t('dashboard.currencyConverter', 'Valutakalkulator')}
            </button>
          </div>
        </div>
      </header>
      
          {selectedView !== 'converter' && (
            <BudgetOverview currency={currency} convert={convert} loadingRates={loadingRates} />
          )}
      <div className="mb-4">
        {selectedView === 'converter' ? <CurrencyConverter /> : <AddSpentAmount currency={currency} convert={convert} />}
      </div>
      {selectedView === 'add' && spending.transactions && Array.isArray(spending.transactions) && spending.transactions.length > 0 && (
        <Card>
          <CardContent className="space-y-4">
            <ExpenseHistory betaEnabled={betaEnabled} currency={currency} convert={convert} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
