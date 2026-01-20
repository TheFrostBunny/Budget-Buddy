import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf } from 'lucide-react';
import { usePreferences } from '@/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import { DietaryInfo } from '@/types';

const DietaryPreferencesCard = () => {
  const { preferences, toggleDietaryPreference } = usePreferences();
  const { t } = useTranslation();
  const dietaryOptions: DietaryInfo[] = [
    'vegetar',
    'vegan',
    'glutenfri',
    'laktosefri',
    'økologisk',
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Leaf className="h-4 w-4" />
          {t('settings.dietary.title')}
        </CardTitle>
        <CardDescription>{t('settings.dietary.description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {dietaryOptions.map((diet) => (
          <Badge
            key={diet}
            variant={preferences.dietaryPreferences.includes(diet) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleDietaryPreference(diet)}
          >
            {t(`diet.${diet}`)}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
};

export default DietaryPreferencesCard;
