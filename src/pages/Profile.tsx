import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePreferences } from '@/hooks/useLocalStorage';
import { useBudget } from '@/components/budget/budget-provider';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

const CURRENCIES = ["NOK", "EUR", "USD", "SEK", "GBP"];

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { preferences, setDefaultBudgetPeriod, setPreferencesState } = usePreferences();
  const { budget, updateBudget, resetSpending, spending, resetSavingsBalance } = useBudget();
  const [rounds, setRounds] = useState<{ amount: number }[]>([]);
  const [money, setMoney] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [currency, setCurrency] = useState(() => localStorage.getItem('profileCurrency') || 'NOK');

  useEffect(() => {
    const storedRounds = localStorage.getItem('foodBudgetRounds');
    if (storedRounds) {
      setRounds(JSON.parse(storedRounds));
    }
    const storedMoney = localStorage.getItem('foodBudgetMoney');
    if (storedMoney) {
      const { money, duration } = JSON.parse(storedMoney);
      setMoney(money);
      setDuration(duration);
    } else {
      if (preferences.dailyBudgetAmount && preferences.dailyBudgetDays) {
        setMoney(preferences.dailyBudgetAmount);
        setDuration(preferences.dailyBudgetDays);
      }
    }
  }, [preferences.dailyBudgetAmount, preferences.dailyBudgetDays]);

  useEffect(() => {
    const browserLanguage = navigator.language.split('-')[0];
    if (!preferences.language) {
      setPreferencesState((prev) => ({ ...prev, language: browserLanguage }));
      i18n.changeLanguage(browserLanguage);
    }
  }, [preferences.language, setPreferencesState, i18n]);

  useEffect(() => {
    localStorage.setItem('profileCurrency', currency);
  }, [currency]);

  return (
    <div className="space-y-4 p-4 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
            <p className="text-muted-foreground">{t('profile.subtitle')}</p>
          </div>
        </div>
        <Link
          to="/settings"
          className="p-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <SettingsIcon className="h-6 w-6" />
        </Link>
      </header>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-muted-foreground">Vis i valuta:</span>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map(cur => (
              <SelectItem key={cur} value={cur}>{cur}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('profile.period.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Button
            variant={preferences.defaultBudgetPeriod === 'weekly' ? 'default' : 'outline'}
            onClick={() => setDefaultBudgetPeriod('weekly')}
            className="flex-1"
          >
            {t('profile.period.weekly')}
          </Button>
          <Button
            variant={preferences.defaultBudgetPeriod === 'monthly' ? 'default' : 'outline'}
            onClick={() => setDefaultBudgetPeriod('monthly')}
            className="flex-1"
          >
            {t('profile.period.monthly')}
          </Button>
          <Button
            variant={preferences.defaultBudgetPeriod === 'daily' ? 'default' : 'outline'}
            onClick={() => setDefaultBudgetPeriod('daily')}
            className="flex-1"
          >
            {t('profile.period.daily')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
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
                className="dark:bg-dark-background dark:text-dark-foreground dark:border-dark-border w-1/2 rounded border border-border bg-background px-2 py-2 text-base text-foreground"
                style={{ marginLeft: 8 }}
              />
            </div>
          )}
          {budget &&
            (() => {
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
                  <p className="font-semibold text-foreground">{t(`budget.status`)}</p>
                  <div className="flex justify-between">
                    <span>{t(`budget.dailyBudget`)}</span>
                    <span className="font-medium">{budget.amount} kr</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t(`budget.spent`)}</span>
                    <span>-{spending.spent} kr</span>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-border/50 pt-1 font-medium">
                    <span>{t(`budget.leftover`)}</span>
                    <span>{budget.amount - spending.spent} kr</span>
                  </div>

                  {isDailyWithDuration && (
                    <div className="mt-2 border-t border-border/50 pt-2">
                      <div className="flex justify-between">
                        <span>Totalt ({preferences.dailyBudgetDays} dager):</span>
                        <span className="font-bold text-primary">{totalAmount} kr</span>
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>{t(`budget.spent`)}</span>
                        <span className="text-destructive">
                          -{totalSpentSinceStart.toFixed(0)} kr
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between text-xs font-medium text-muted-foreground">
                        <span>{t(`budget.leftovertotal`)}</span>
                        <span className="text-foreground">
                          {Math.max(0, totalAmount - totalSpentSinceStart).toFixed(0)} kr
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
        </CardContent>
      </Card>

      {budget && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('profile.actions.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={resetSpending} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('profile.actions.resetSpending')}
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
              {t('profile.actions.resetSavings')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
