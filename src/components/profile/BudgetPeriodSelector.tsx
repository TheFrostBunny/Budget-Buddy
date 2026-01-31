import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { usePreferences } from '@/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';

interface BudgetPeriodSelectorProps {
  value: string;
  onChange: (period: string) => void;
}

const BudgetPeriodSelector: React.FC<BudgetPeriodSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base" lang="no">{t('profile.period.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Button
          variant={value === 'weekly' ? 'default' : 'outline'}
          onClick={() => onChange('weekly')}
          className="flex-1"
        >
          <span lang="no">{t('profile.period.weekly')}</span>
        </Button>
        <Button
          variant={value === 'monthly' ? 'default' : 'outline'}
          onClick={() => onChange('monthly')}
          className="flex-1"
        >
          <span lang="no">{t('profile.period.monthly')}</span>
        </Button>
        <Button
          variant={value === 'daily' ? 'default' : 'outline'}
          onClick={() => onChange('daily')}
          className="flex-1"
        >
          <span lang="no">{t('profile.period.daily')}</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BudgetPeriodSelector;
