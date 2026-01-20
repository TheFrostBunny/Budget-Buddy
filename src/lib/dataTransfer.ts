import { UserPreferences } from '@/types';

export const exportDataToJson = (data: object, filename: string = 'data.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const importDataFromJson = (
  onImport: (data: {
    preferences?: UserPreferences;
    budget?: { amount: number; period: 'weekly' | 'monthly' | 'daily' };
  }) => void,
) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const content = await file.text();
      const data = JSON.parse(content);
      onImport(data);
    }
  };
  input.click();
};
