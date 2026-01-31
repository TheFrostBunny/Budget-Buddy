import { Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DietaryPreferencesCard from '@/components/settings/DietaryPreferencesCard';
import AppearanceCard from '@/components/settings/AppearanceCard';
import LanguageCard from '@/components/settings/LanguageCard';
import DeveloperCard from '@/components/settings/DeveloperCard';

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 p-4 pb-24 pt-6">
      <header className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <SettingsIcon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>
      </header>
      <DietaryPreferencesCard />
      <AppearanceCard />
      <LanguageCard />
      <DeveloperCard />

      <div className="pt-8 text-center text-xs text-muted-foreground">
        <p>Budget Buddy V1.7.0</p>
      </div>
    </div>
  );
};

export default Settings;
