import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Budget, BudgetSpending } from "@/types";

const STORAGE_KEYS = {
  BUDGET: "budgetbuddy_budget",
  SPENDING: "budgetbuddy_spending",
  SAVINGS: "budgetbuddy_savings",
};

interface BudgetContextType {
  budget: Budget | null;
  spending: BudgetSpending;
  savings: number;
  setBudget: (amount: number, period: "weekly" | "monthly" | "daily") => void;
  updateBudget: (amount: number, period?: "weekly" | "monthly" | "daily") => void;
  addSpending: (amount: number, storeId?: string, description?: string) => void;
  resetSpending: () => void;
  completePeriod: () => void;
  resetSavingsBalance: () => void;
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

  const [savings, setSavings] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    return stored ? parseFloat(stored) : 0;
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVINGS, savings.toString());
  }, [savings]);

  // Check for daily rollover
  useEffect(() => {
    const checkRollover = () => {
      if (!budget) return;
      
      const lastCheck = localStorage.getItem("budgetbuddy_last_check");
      // Use local time for date check, not ISO (UTC)
      // en-CA format is YYYY-MM-DD
      const today = new Date().toLocaleDateString("en-CA");

      if (lastCheck !== today) {
        // It's a new day!
        if (budget.period === "daily") {
          completePeriod(); // This saves remaining and resets spending
        }
        localStorage.setItem("budgetbuddy_last_check", today);
      }
    };

    checkRollover();
    // Check every minute just in case app stays open across midnight
    const interval = setInterval(checkRollover, 60000);
    return () => clearInterval(interval);
  }, [budget, spending.spent]);

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

  const updateBudget = (amount: number, period?: "weekly" | "monthly" | "daily") => {
    if (budget) {
      const updated = { ...budget, amount, period: period || budget.period };
      setBudgetState(updated);
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(updated));
    } else {
        // If no budget exists, create one
        setBudget(amount, period || "weekly");
    }
  };

  const addSpending = (amount: number, storeId?: string, description?: string) => {
    let coveredBySavings = 0;
    
    if (budget) {
      // Calculate effective remaining budget (budget - (spent - covered))
      // Actually simpler: total spent including this new amount
      const currentSpent = spending.spent; // already includes previous savings-covered amounts? 
      // We want to calculate how much of THIS transaction is over budget.
      
      // Effective spent against budget limit so far:
      const effectiveSpent = currentSpent - (spending.coveredBySavings || 0);
      const remainingBudget = budget.amount - effectiveSpent;
      
      // If we are adding more than what's remaining
      if (amount > remainingBudget) {
        // The overdraft amount
        const overdraft = amount - Math.max(0, remainingBudget);
        
        // Take from savings if available
        if (savings >= overdraft) {
           coveredBySavings = overdraft;
           setSavings(prev => prev - overdraft);
        } else {
           // If we don't have enough savings, we take what we can? 
           // Or just take all available savings and leave the rest as overspending?
           // User said "takes from savings account", implying partial coverage is ok.
           coveredBySavings = Math.max(0, savings);
           setSavings(0);
        }
      }
    }

    setSpendingState((prev) => ({
      ...prev,
      spent: prev.spent + amount,
      coveredBySavings: (prev.coveredBySavings || 0) + coveredBySavings,
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
    setSpendingState({ budgetId: budget?.id || "", spent: 0, transactions: [], coveredBySavings: 0 });
  };

  const completePeriod = () => {
    if (budget) {
      // User says: "for it to count as a day, at least 1 kr must be used"
      // So we only save remaining budget if they actually used the app (spent >= 1)
      if (spending.spent >= 1) {
        const remaining = budget.amount - spending.spent;
        if (remaining > 0) {
          setSavings((prev) => prev + remaining);
        }
      }
      resetSpending();
    }
  };

  const resetSavingsBalance = () => {
    setSavings(0);
  };

  return (
    <BudgetContext.Provider value={{ budget, spending, savings, setBudget, updateBudget, addSpending, resetSpending, completePeriod, resetSavingsBalance }}>
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
