import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BetaFeaturesCard = () => {
  const { t } = useTranslation();
  const [betaEnabled, setBetaEnabled] = useState(() => localStorage.getItem('beta_features') === 'true');
  return (
    <Card className="mt-4 border-2 border-dashed border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
          <Leaf className="h-5 w-5" />
          {t('settings.developer.beta.title', 'Beta-funksjoner')}
        </CardTitle>
        <CardDescription className="text-yellow-700 dark:text-yellow-300">
          {t(
            'settings.developer.beta.description',
            'Slå på eksperimentelle funksjoner som eksport til Excel.',
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <span className="text-yellow-700 dark:text-yellow-300">
            {t('settings.developer.beta.toggleLabel', 'Aktiver beta-funksjoner')}
          </span>
          <Switch
            checked={betaEnabled}
            onCheckedChange={(checked) => {
              setBetaEnabled(checked);
              localStorage.setItem('beta_features', checked ? 'true' : 'false');
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BetaFeaturesCard;
