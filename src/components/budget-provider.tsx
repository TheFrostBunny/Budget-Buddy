import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Budget, BudgetSpending } from "@/types";

const STORAGE_KEYS = {
  BUDGET: "budgetbuddy_budget",
  SPENDING: "budgetbuddy_spending",
};

interface BudgetContextType {
  budget: Budget | null;
  spending: BudgetSpending;
  setBudget: (amount: number, period: "weekly" | "monthly" | "daily") => void;
  addSpending: (amount: number, storeId?: string, description?: string) => void;
  resetSpending: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budget, setBudgetState] = useState<Budget | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.BUDGET);
    return stored ? JSON.parse(stored) : null;
  });

  const [spending, setSpendingState] = useState<BudgetSpending>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SPENDING);
    return stored ? JSON.parse(stored) : { budgetId: "", spent: 0, transactions: [], dailyRollover: 0 };
  });

  useEffect(() => {
    if (budget) {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
    } else {
        // If budget is explicitly null/cleared, maybe remove it? 
        // For now keeping logic same as before, but 'if (budget)' implies we don't clear it if null.
    }
  }, [budget]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPENDING, JSON.stringify(spending));
  }, [spending]);

  const setBudget = (amount: number, period: "weekly" | "monthly" | "daily") => {
    const newBudget: Budget = {
      id: crypto.randomUUID(),
      amount,
      period,
      startDate: new Date().toISOString(),
    };
    setBudgetState(newBudget);
    setSpendingState({ budgetId: newBudget.id, spent: 0, transactions: [], dailyRollover: 0 });
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(newBudget));
  };

  const addSpending = (amount: number, storeId?: string, description?: string) => {
    setSpendingState((prev) => ({
      ...prev,
      spent: prev.spent + amount,
      transactions: [
        ...prev.transactions,
        {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          amount,
          storeId,
          description,
        },
      ],
    }));
  };

  const resetSpending = () => {
    setSpendingState({ budgetId: budget?.id || "", spent: 0, transactions: [] });
  };

  return (
    <BudgetContext.Provider value={{ budget, spending, setBudget, addSpending, resetSpending }}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
