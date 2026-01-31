import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePreferences, currencyOptions } from '@/hooks/useLocalStorage';
import { useCustomRates } from '@/hooks/useCustomRates';
import { useBudget } from '@/components/budget/budget-provider';
import { useEffect } from 'react';
import { useStoredRoundsAndMoney } from '@/hooks/useStoredRoundsAndMoney';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProfileHeader from '@/components/profile/ProfileHeader';
import BudgetPeriodSelector from '@/components/profile/BudgetPeriodSelector';
import BudgetStatusCard from '@/components/profile/BudgetStatusCard';

const Profile = () => {
    const {
      customRates,
      editRates,
      handleRateChange,
      handleRateSave,
      handleRateDelete,
    } = useCustomRates();
  const { t, i18n } = useTranslation();
  const { preferences, setDefaultBudgetPeriod, setPreferencesState } = usePreferences();
  const { budget, updateBudget, resetSpending, spending, resetSavingsBalance } = useBudget();

  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0];
    if (!preferences.language) {
      setPreferencesState((prev) => ({ ...prev, language: browserLanguage }));
      i18n.changeLanguage(browserLanguage);
    }
  }, [preferences.language, setPreferencesState, i18n]);

  return (
    <div>
      <div className="space-y-4 p-4 pt-6">
        <ProfileHeader />
        <BudgetPeriodSelector
          value={preferences.defaultBudgetPeriod || 'weekly'}
          onChange={setDefaultBudgetPeriod}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base" lang="no">
              {preferences.defaultBudgetPeriod === 'daily'
                ? t('profile.labels.dailyFood')
                : preferences.defaultBudgetPeriod === 'monthly'
                  ? t('profile.labels.monthlyBudget')
                  : t('profile.labels.weeklyBudget')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-2">
            <div className="flex w-full items-center gap-2">
              <input
                type="number"
                min={0}
                value={preferences.dailyBudgetAmount ?? ''}
                onChange={(e) => {
                  const amount = parseFloat(e.target.value);
                  if (!isNaN(amount) && amount >= 0) {
                    setPreferencesState((prev) => ({ ...prev, dailyBudgetAmount: amount }));
                  }
                }}
                onBlur={() => {
                  if (preferences.dailyBudgetAmount) {
                    updateBudget(
                      preferences.dailyBudgetAmount,
                      preferences.defaultBudgetPeriod || 'weekly',
                    );
                  }
                }}
                placeholder={
                  preferences.defaultBudgetPeriod === 'daily'
                    ? t('profile.placeholders.daily')
                    : t('profile.placeholders.amount')
                }
                lang="no"
                className="dark:bg-dark-background dark:text-dark-foreground dark:border-dark-border w-72 rounded border border-border bg-background px-3 py-2 text-base text-foreground"
              />
            </div>
            {preferences.defaultBudgetPeriod === 'daily' && (
              <div style={{ marginTop: 8, width: '100%' }}>
                <input
                  type="number"
                  min={1}
                  value={preferences.dailyBudgetDays ?? ''}
                  onChange={(e) => {
                    const days = parseInt(e.target.value);
                    if (!isNaN(days) && days > 0) {
                      setPreferencesState((prev) => ({ ...prev, dailyBudgetDays: days }));
                    }
                  }}
                  onBlur={() => {
                    if (preferences.dailyBudgetAmount) {
                      updateBudget(
                        preferences.dailyBudgetAmount,
                        preferences.defaultBudgetPeriod || 'weekly',
                      );
                    }
                  }}
                  placeholder={t('profile.placeholders.days')}
                  lang="no"
                  className="dark:bg-dark-background dark:text-dark-foreground dark:border-dark-border w-1/2 rounded border border-border bg-background px-2 py-2 text-base text-foreground"
                  style={{ marginLeft: 8 }}
                />
              </div>
            )}
            {budget && (
              <BudgetStatusCard
                budget={budget}
                spending={spending}
                preferences={preferences}
                t={t}
              />
            )}
          </CardContent>
        </Card>

        {budget && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base" lang="no">{t('profile.actions.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={resetSpending} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                <span lang="no">{t('profile.actions.resetSpending')}</span>
              </Button>
              <Button
                variant="ghost"
                className="mt-2 w-full text-muted-foreground hover:text-destructive"
                onClick={() => {
                  if (confirm(t('profile.actions.confirmResetSavings'))) {
                    resetSavingsBalance();
                  }
                }}
              >
                <span lang="no">{t('profile.actions.resetSavings')}</span>
              </Button>

              {/* Valutakurser handlinger */}
              <div className="mt-6">
                <h3 className="text-base font-semibold mb-2">{t('profile.actions.currencyRates', 'Valutakurser')}</h3>
                {Object.keys(customRates).length === 0 && (
                  <div className="text-muted-foreground">{t('profile.actions.noRates', 'Ingen lagrede valutakurser.')}</div>
                )}
                {Object.entries(customRates).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 mb-2">
                    <span className="w-32">{key.replace('_', ' → ')}</span>
                    <input
                      type="text"
                      value={editRates[key] ?? value}
                      onChange={e => handleRateChange(key, e.target.value)}
                      className="w-20 border rounded px-2 py-1 bg-background text-foreground border-border dark:bg-dark-background dark:text-dark-foreground dark:border-dark-border"
                    />
                    <Button size="sm" onClick={() => handleRateSave(key)}>{t('profile.actions.save', 'Lagre')}</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRateDelete(key)}>{t('profile.actions.delete', 'Slett')}</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
