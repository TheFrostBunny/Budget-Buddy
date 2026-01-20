import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { ModeToggle } from '@/components/settings/mode-toggle';
import { useTranslation } from 'react-i18next';

const AppearanceCard = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="h-4 w-4" />
            {t('settings.appearance.title')}
          </CardTitle>
          <CardDescription>{t('settings.appearance.description')}</CardDescription>
        </div>
        <ModeToggle />
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default AppearanceCard;
