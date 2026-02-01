import { useState, Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/components/budget/budget-provider';
import { Wallet } from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import { useTranslation } from 'react-i18next';
const CurrencyConverter = lazy(() => import('@/components/budget/CurrencyConverter'));
const ExpenseHistory = lazy(() => import('@/components/budget/ExpenseHistory'));
const AddSpentAmount = lazy(() => import('@/components/budget/AddSpentAmount'));
const BudgetOverview = lazy(() => import('@/components/budget/BudgetOverview'));
import { useCurrencyRates } from '@/hooks/useCurrencyRates';
 import { usePreferences } from '@/hooks/useLocalStorage';

const Dashboard = () => {
  const { t } = useTranslation();
  const { spending, setBudget } = useBudget();
  const [budgetInput, setBudgetInput] = useState('');
  const { inputCurrency } = usePreferences();

  const baseCurrency = 'NOK';
  const { rates, loadingRates, convert } = useCurrencyRates(inputCurrency, baseCurrency);

  const [selectedView, setSelectedView] = useState<'converter' | 'add'>('add');
  // Legg til betaEnabled state og synkroniser med localStorage
  const [betaEnabled, setBetaEnabled] = useState(() => localStorage.getItem('beta_features') === 'true');

  return (
    <div className="space-y-6 p-2 pt-4 sm:p-4 sm:pt-6">
      <DashboardHeader selectedView={selectedView} setSelectedView={setSelectedView} />

      <Suspense fallback={<div>Laster...</div>}>
        {selectedView !== 'converter' && (
           <BudgetOverview currency={inputCurrency} convert={convert} loadingRates={loadingRates} />
        )}
        <div className="mb-4">
          {selectedView === 'converter' ? <CurrencyConverter /> : <AddSpentAmount currency={inputCurrency} convert={convert} betaEnabled={betaEnabled} />}
        </div>
        {selectedView === 'add' && spending.transactions && Array.isArray(spending.transactions) && spending.transactions.length > 0 && (
          <Card>
            <CardContent className="space-y-4">
               <ExpenseHistory betaEnabled={betaEnabled} currency={inputCurrency} convert={convert} />
            </CardContent>
          </Card>
        )}
      </Suspense>
    </div>
  );
};

export default Dashboard;
