import { encryptData, decryptData } from '@/lib/crypto';

import { UserPreferences, Budget, BudgetSpending, ShoppingListItem } from '@/types';


// Eksporter ALLE relevante data fra localStorage
export const exportDataToJson = async (filename: string = 'budgetbuddy-data.json', encrypt = false) => {
  const data = {
    budget: JSON.parse(localStorage.getItem('budgetbuddy_budget') || 'null'),
    spending: JSON.parse(localStorage.getItem('budgetbuddy_spending') || 'null'),
    savings: parseFloat(localStorage.getItem('budgetbuddy_savings') || '0'),
    preferences: JSON.parse(localStorage.getItem('budgetbuddy_preferences') || 'null'),
    shoppingList: JSON.parse(localStorage.getItem('budgetbuddy_shopping_list') || '[]'),
  };
  let out = JSON.stringify(data, null, 2);
  let outFilename = filename;
  if (encrypt) {
    const password = prompt('Velg et passord for å kryptere eksporten:');
    if (!password) return;
    out = await encryptData(out, password);
    outFilename = filename.replace(/\.json$/, '.enc.json');
  }
  const blob = new Blob([out], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = outFilename;
  link.click();
  URL.revokeObjectURL(url);
};


// Importer ALLE relevante data til localStorage og kall onImport for å oppdatere hooks/state
export const importDataFromJson = (
  onImport: (data: {
    budget?: Budget;
    spending?: BudgetSpending;
    savings?: number;
    preferences?: UserPreferences;
    shoppingList?: ShoppingListItem[];
  }) => void,
) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.enc.json';
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      let content = await file.text();
      if ((content.match(/:/g) || []).length === 2) {
        const password = prompt('Skriv inn passordet for å dekryptere filen:');
        if (!password) return;
        try {
          content = await decryptData(content, password);
        } catch {
          alert('Feil passord eller korrupt fil.');
          return;
        }
      }
      const data = JSON.parse(content);
      if (data.budget) localStorage.setItem('budgetbuddy_budget', JSON.stringify(data.budget));
      if (data.spending) localStorage.setItem('budgetbuddy_spending', JSON.stringify(data.spending));
      if (typeof data.savings === 'number') localStorage.setItem('budgetbuddy_savings', data.savings.toString());
      if (data.preferences) localStorage.setItem('budgetbuddy_preferences', JSON.stringify(data.preferences));
      if (data.shoppingList) localStorage.setItem('budgetbuddy_shopping_list', JSON.stringify(data.shoppingList));
      onImport(data);
    }
  };
  input.click();
};
