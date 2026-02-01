import { Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DietaryPreferencesCard from '@/components/settings/DietaryPreferencesCard';
import AppearanceCard from '@/components/settings/AppearanceCard';
import LanguageCard from '@/components/settings/LanguageCard';
import DeveloperCard from '@/components/settings/DeveloperCard';
import BetaFeaturesCard from '@/components/settings/BetaFeaturesCard';
import BudgetPeriodSelector from '@/components/profile/BudgetPeriodSelector';
import BudgetStatusCard from '@/components/profile/BudgetStatusCard';
import { usePreferences, currencyOptions } from '@/hooks/useLocalStorage';
import { useBudget } from '@/components/budget/budget-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useCustomRates } from '@/hooks/useCustomRates';
import { useEffect } from 'react';

const SettingsProfile = () => {
  const { t, i18n } = useTranslation();
  const { preferences, setDefaultBudgetPeriod, setPreferencesState, inputCurrency, setInputCurrency } = usePreferences();
  const { budget, updateBudget, resetSpending, spending, resetSavingsBalance } = useBudget();
  const { customRates, editRates, handleRateChange, handleRateSave, handleRateDelete } = useCustomRates();

  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0];
    if (!preferences.language) {
      setPreferencesState((prev) => ({ ...prev, language: browserLanguage }));
      i18n.changeLanguage(browserLanguage);
    }
  }, [preferences.language, setPreferencesState, i18n]);

  return (
    <div className="space-y-8 p-4 pb-24 pt-6 max-w-2xl mx-auto">
      <header className="flex items-center gap-3 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <SettingsIcon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('profile.title', { defaultValue: 'Profil & Budsjett' })}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BudgetPeriodSelector
            value={preferences.defaultBudgetPeriod || 'weekly'}
            onChange={setDefaultBudgetPeriod}
          />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base" lang="no">
                {preferences.defaultBudgetPeriod === 'daily'
                  ? t('profile.labels.dailyFood', { defaultValue: 'Daglig matbudsjett' })
                  : preferences.defaultBudgetPeriod === 'monthly'
                    ? t('profile.labels.monthlyBudget', { defaultValue: 'Månedlig budsjett' })
                    : t('profile.labels.weeklyBudget', { defaultValue: 'Ukentlig budsjett' })}
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
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base" lang="no">{t('profile.actions.title', { defaultValue: 'Handlinger' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={resetSpending} className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  <span lang="no">{t('profile.actions.resetSpending', { defaultValue: 'Nullstill forbruk' })}</span>
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
                  <span lang="no">{t('profile.actions.resetSavings', { defaultValue: 'Nullstill sparing' })}</span>
                </Button>
                <div className="mt-6">
                  <h3 className="text-base font-semibold mb-2">{t('profile.actions.currencyRates', { defaultValue: 'Valutakurser' })}</h3>
                  {Object.keys(customRates).length === 0 && (
                    <div className="text-muted-foreground">{t('profile.actions.noRates', { defaultValue: 'Ingen lagrede valutakurser.' })}</div>
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
                      <Button size="sm" onClick={() => handleRateSave(key)}>{t('profile.actions.save', { defaultValue: 'Lagre' })}</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRateDelete(key)}>{t('profile.actions.delete', { defaultValue: 'Slett' })}</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="appearance">
              <AccordionTrigger>{t('settings.appearance.title', { defaultValue: 'Utseende' })}</AccordionTrigger>
              <AccordionContent><AppearanceCard /></AccordionContent>
            </AccordionItem>
            <AccordionItem value="language">
              <AccordionTrigger>{t('settings.language.title', { defaultValue: 'Språk' })}</AccordionTrigger>
              <AccordionContent><LanguageCard /></AccordionContent>
            </AccordionItem>
            <AccordionItem value="currency">
              <AccordionTrigger>{t('settings.currency.title', { defaultValue: 'Standard valuta' })}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 py-2">
                  <label className="font-medium mb-2" htmlFor="currency-select">{t('settings.currency.label', { defaultValue: 'Velg din standard valuta' })}</label>
                  <select
                    id="currency-select"
                    value={inputCurrency}
                    onChange={e => setInputCurrency(e.target.value as 'NOK' | 'EUR' | 'OTHER')}
                    className="w-64 rounded border border-border bg-background px-3 py-2 text-base text-foreground"
                  >
                    {currencyOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="dietary">
              <AccordionTrigger>{t('settings.dietary.title', { defaultValue: 'Kostpreferanser' })}</AccordionTrigger>
              <AccordionContent><DietaryPreferencesCard /></AccordionContent>
            </AccordionItem>
            <AccordionItem value="beta">
              <AccordionTrigger>{t('settings.beta.title', { defaultValue: 'Beta-funksjoner' })}</AccordionTrigger>
              <AccordionContent><BetaFeaturesCard /></AccordionContent>
            </AccordionItem>
            <AccordionItem value="developer">
              <AccordionTrigger>{t('settings.developer.title', { defaultValue: 'Utviklermodus' })}</AccordionTrigger>
              <AccordionContent><DeveloperCard /></AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="pt-8 text-center text-xs text-muted-foreground">
        <p>Budget Buddy V1.8.0</p>
      </div>
    </div>
  );
};

export default SettingsProfile;
