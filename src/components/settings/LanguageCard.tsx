import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageCard = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 text-base">
        <Languages className="h-4 w-4" />
        {t('settings.language.title')}
      </CardHeader>
      <CardContent className="flex gap-2">
        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="dark:bg-dark-background dark:text-dark-foreground dark:border-dark-border w-full rounded border border-border bg-background px-3 py-2 text-base text-foreground"
        >
          <option value="no">{t('settings.language.option.no')}</option>
          <option value="en">{t('settings.language.option.en')}</option>
          <option value="nn">{t('settings.language.option.nn')}</option>
          <option value="de">{t('settings.language.option.de')}</option>
        </select>
      </CardContent>
    </Card>
  );
};

export default LanguageCard;
