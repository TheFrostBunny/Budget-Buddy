import { useState, useEffect, useCallback } from 'react';

export function useCustomRates() {
  const [customRates, setCustomRates] = useState<{ [key: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('customRates');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [editRates, setEditRates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('customRates');
      setCustomRates(saved ? JSON.parse(saved) : {});
    } catch {
      setCustomRates({});
    }
  }, []);

  const handleRateChange = useCallback((key: string, value: string) => {
    setEditRates(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleRateSave = useCallback((key: string) => {
    const normalized = editRates[key]?.replace(',', '.');
    const rate = parseFloat(normalized);
    if (!rate || rate <= 0) return;
    const updatedRates = { ...customRates, [key]: rate };
    setCustomRates(updatedRates);
    localStorage.setItem('customRates', JSON.stringify(updatedRates));
    setEditRates(prev => ({ ...prev, [key]: '' }));
  }, [customRates, editRates]);

  const handleRateDelete = useCallback((key: string) => {
    const updatedRates = { ...customRates };
    delete updatedRates[key];
    setCustomRates(updatedRates);
    localStorage.setItem('customRates', JSON.stringify(updatedRates));
    setEditRates(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }, [customRates]);

  return {
    customRates,
    editRates,
    handleRateChange,
    handleRateSave,
    handleRateDelete,
    setCustomRates,
    setEditRates,
  };
}
