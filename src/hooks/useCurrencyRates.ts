import { useState, useEffect, useCallback } from 'react';

export function useCurrencyRates(currency: string, baseCurrency = 'NOK') {
  const [rates, setRates] = useState<{ [key: string]: number }>({ [baseCurrency]: 1 });
  const [loadingRates, setLoadingRates] = useState(false);

  useEffect(() => {
    if (currency === baseCurrency) {
      setRates({ [baseCurrency]: 1 });
      return;
    }
    setLoadingRates(true);
    fetch(`https://api.exchangerate.host/latest?base=${baseCurrency}&symbols=${currency}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates[currency]) {
          setRates({ [baseCurrency]: 1, [currency]: data.rates[currency] });
        }
      })
      .catch(() => setRates({ [baseCurrency]: 1 }))
      .finally(() => setLoadingRates(false));
  }, [currency, baseCurrency]);

  const convert = useCallback(
    (amount: number) => {
      if (currency === baseCurrency) return amount;
      if (rates[currency]) return amount * rates[currency];
      return amount;
    },
    [currency, baseCurrency, rates]
  );

  return { rates, loadingRates, convert };
}
