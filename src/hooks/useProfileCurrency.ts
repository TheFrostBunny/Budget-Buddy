import { useState, useEffect } from 'react';

export function useProfileCurrency(defaultCurrency = 'NOK') {
  const [currency, setCurrency] = useState(() => localStorage.getItem('profileCurrency') || defaultCurrency);

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem('profileCurrency') || defaultCurrency;
      setCurrency(stored);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [defaultCurrency]);

  useEffect(() => {
    localStorage.setItem('profileCurrency', currency);
  }, [currency]);

  return [currency, setCurrency] as const;
}
