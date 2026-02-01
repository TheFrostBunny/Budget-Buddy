import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Laptop } from 'lucide-react';
import { useState } from 'react';
import { useBudget } from '@/components/budget/budget-provider';
import { usePreferences } from '@/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import { UserPreferences } from '@/types';
import { exportDataToJson, importDataFromJson } from '@/lib/dataTransfer';
import BetaFeaturesCard from '@/components/settings/BetaFeaturesCard';

const DeveloperCard = () => {
  const { preferences, setPreferencesState } = usePreferences();
  const budget = useBudget();
  const [isDevMode, setIsDevMode] = useState(false);
  const { t } = useTranslation();

  const handleImport = (data: any) => {
    if (data.preferences) {
      setPreferencesState(data.preferences);
    }
    if (data.budget) {
      // Sjekk om det finnes et budsjett fra før
      if (budget.budget) {
        const overwrite = confirm(
          t('settings.developer.confirmOverwriteBudget', 'Det finnes allerede et budsjett. Vil du overskrive det med det importerte?')
        );
        if (!overwrite) return;
      }
      const validPeriods: Array<'weekly' | 'monthly' | 'daily'> = ['weekly', 'monthly', 'daily'];
      const period = validPeriods.includes(data.budget.period) ? data.budget.period : 'weekly';
      budget.setBudget(data.budget.amount, period);
    }
    // Sikre at alle hooks/state oppdateres
    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Laptop className="h-4 w-4" />
            {t('settings.developer.title')}
          </CardTitle>
          <CardDescription>{t('settings.developer.description')}</CardDescription>
        </div>
        <Switch checked={isDevMode} onCheckedChange={setIsDevMode} />
      </CardHeader>
      <CardContent>
        {isDevMode && (
          <div className="mt-4 border-t pt-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              <p className="mb-2 text-sm font-medium">{t('settings.developer.debugTools')}</p>
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => {
                  if (confirm(t('settings.developer.confirmSimulation'))) {
                    budget.completePeriod();
                  }
                }}
              >
                {t('settings.developer.simulateNewDay')}
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('settings.developer.simulateDescription')}
              </p>
              {/* Export Data Feature */}
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={async () => {
                  const encrypt = confirm('Vil du kryptere eksporten med passord?');
                  await exportDataToJson('budgetbuddy-data.json', encrypt);
                }}
              >
                {t('settings.developer.exportData', 'Eksporter data til JSON')}
              </Button>
              {/* Import Data Feature */}
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => importDataFromJson(handleImport)}
              >
                {t('settings.developer.importData', 'Importer data fra JSON')}
              </Button>
            </div>
            <BetaFeaturesCard />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeveloperCard;
