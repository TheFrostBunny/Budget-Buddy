import { useState, useEffect } from 'react';

export function useStoredRoundsAndMoney(preferences: { dailyBudgetAmount?: number; dailyBudgetDays?: number }) {
  const [rounds, setRounds] = useState<{ amount: number }[]>([]);
  const [money, setMoney] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const storedRounds = localStorage.getItem('foodBudgetRounds');
    if (storedRounds) {
      setRounds(JSON.parse(storedRounds));
    }
    const storedMoney = localStorage.getItem('foodBudgetMoney');
    if (storedMoney) {
      const { money, duration } = JSON.parse(storedMoney);
      setMoney(money);
      setDuration(duration);
    } else {
      if (preferences.dailyBudgetAmount && preferences.dailyBudgetDays) {
        setMoney(preferences.dailyBudgetAmount);
        setDuration(preferences.dailyBudgetDays);
      }
    }
  }, [preferences.dailyBudgetAmount, preferences.dailyBudgetDays]);

  return { rounds, setRounds, money, setMoney, duration, setDuration };
}
