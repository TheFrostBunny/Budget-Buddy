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
import { useProfileCurrency } from '@/hooks/useProfileCurrency';

const Dashboard = () => {
  const { t } = useTranslation();
  const { spending, setBudget } = useBudget();
  const [budgetInput, setBudgetInput] = useState('');
  const [betaEnabled, setBetaEnabled] = useState(false);
  const [currency, setCurrency] = useProfileCurrency('NOK');

  const baseCurrency = 'NOK';
  const { rates, loadingRates, convert } = useCurrencyRates(currency, baseCurrency);

  const [selectedView, setSelectedView] = useState<'converter' | 'add'>('add');

  return (
    <div className="space-y-6 p-2 pt-4 sm:p-4 sm:pt-6">
      <DashboardHeader selectedView={selectedView} setSelectedView={setSelectedView} />

      <Suspense fallback={<div>Laster...</div>}>
        {selectedView !== 'converter' && (
          <BudgetOverview currency={currency} convert={convert} loadingRates={loadingRates} />
        )}
        <div className="mb-4">
          {selectedView === 'converter' ? <CurrencyConverter /> : <AddSpentAmount currency={currency} convert={convert} betaEnabled={betaEnabled} />}
        </div>
        {selectedView === 'add' && spending.transactions && Array.isArray(spending.transactions) && spending.transactions.length > 0 && (
          <Card>
            <CardContent className="space-y-4">
              <ExpenseHistory betaEnabled={betaEnabled} currency={currency} convert={convert} />
            </CardContent>
          </Card>
        )}
      </Suspense>
    </div>
  );
};

export default Dashboard;
