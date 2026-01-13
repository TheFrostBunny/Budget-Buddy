import { useState, useEffect } from "react";
import { Budget, BudgetSpending, ShoppingListItem, UserPreferences, DietaryInfo } from "@/types";

const STORAGE_KEYS = {
  BUDGET: "budgetbuddy_budget",
  SPENDING: "budgetbuddy_spending",
  SHOPPING_LIST: "budgetbuddy_shopping_list",
  PREFERENCES: "budgetbuddy_preferences",
  FAVORITE_STORES: "budgetbuddy_favorite_stores",
};

// Budget hook
export function useBudget() {
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
    }
  }, [budget]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPENDING, JSON.stringify(spending));
  }, [spending]);

  // Kalles hver dag for å rulle over ubrukte penger
  const dailyRollover = (dailyBudgetAmount: number) => {
    if (budget?.period === "daily") {
      const unused = dailyBudgetAmount - spending.spent;
      setSpendingState((prev) => ({
        ...prev,
        spent: 0,
        dailyRollover: (prev.dailyRollover || 0) + (unused > 0 ? unused : 0),
        transactions: [],
      }));
    }
  };

  const setBudget = (amount: number, period: "weekly" | "monthly" | "daily") => {
    const newBudget: Budget = {
      id: crypto.randomUUID(),
      amount,
      period,
      startDate: new Date().toISOString(),
    };
    setBudgetState(newBudget);
    setSpendingState({ budgetId: newBudget.id, spent: 0, transactions: [], dailyRollover: 0 });
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

  return { budget, spending, setBudget, addSpending, resetSpending };
}

// Shopping list hook
export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string, quantity: number = 1) => {
    const existing = items.find((item) => item.productId === productId);
    if (existing) {
      setItems(
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          id: crypto.randomUUID(),
          productId,
          quantity,
          isChecked: false,
        },
      ]);
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setItems(
        items.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const toggleChecked = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const clearList = () => setItems([]);
  const clearChecked = () => setItems(items.filter((item) => !item.isChecked));

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    toggleChecked,
    clearList,
    clearChecked,
  };
}

// User preferences hook
export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return stored
      ? JSON.parse(stored)
      : {
          dietaryPreferences: [],
          favoriteStores: [],
          defaultBudgetPeriod: "weekly",
          dailyBudgetDays: 7,
        };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  }, [preferences]);

  const toggleDietaryPreference = (pref: DietaryInfo) => {
    setPreferencesState((prev) => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(pref)
        ? prev.dietaryPreferences.filter((p) => p !== pref)
        : [...prev.dietaryPreferences, pref],
    }));
  };

  const toggleFavoriteStore = (storeId: string) => {
    setPreferencesState((prev) => ({
      ...prev,
      favoriteStores: prev.favoriteStores.includes(storeId)
        ? prev.favoriteStores.filter((s) => s !== storeId)
        : [...prev.favoriteStores, storeId],
    }));
  };

  const setDefaultBudgetPeriod = (period: "weekly" | "monthly" | "daily") => {
    setPreferencesState((prev) => ({ ...prev, defaultBudgetPeriod: period }));
  };

  return {
    preferences,
    toggleDietaryPreference,
    toggleFavoriteStore,
    setDefaultBudgetPeriod,
    setPreferencesState,
  };
}