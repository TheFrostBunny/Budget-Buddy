import React from 'react';
import { Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardHeaderProps {
  selectedView: 'add' | 'converter';
  setSelectedView: (view: 'add' | 'converter') => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ selectedView, setSelectedView }) => {
  const { t } = useTranslation();
  return (
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
  );
};

export default DashboardHeader;
