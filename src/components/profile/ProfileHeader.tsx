import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfileHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
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
  );
};

export default ProfileHeader;
