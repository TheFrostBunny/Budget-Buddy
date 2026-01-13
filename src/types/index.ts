// Store types
export interface Store {
  id: string;
  name: string;
  logo: string;
  address?: string;
  isFavorite: boolean;
}

// Product types
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string;
  dietaryInfo: DietaryInfo[];
}

export interface StorePrice {
  productId: string;
  storeId: string;
  price: number;
  isOnSale?: boolean;
  salePrice?: number;
}

export type ProductCategory = 
  | "frukt-gronnsaker"
  | "meieri"
  | "kjott-fisk"
  | "bakevarer"
  | "hermetikk"
  | "frossen"
  | "drikke"
  | "snacks"
  | "husholdning"
  | "annet";

export type DietaryInfo = 
  | "vegetar"
  | "vegan"
  | "glutenfri"
  | "laktosefri"
  | "økologisk";

// Shopping list types
export interface ShoppingListItem {
  id: string;
  productId: string;
  quantity: number;
  isChecked: boolean;
  note?: string;
}

// Offer types
export interface Offer {
  id: string;
  storeId: string;
  productId: string;
  originalPrice: number;
  salePrice: number;
  validFrom: string;
  validTo: string;
  description?: string;
}

// Budget types
export interface Budget {
  id: string;
  amount: number;
  period: "weekly" | "monthly" | "daily";
  startDate: string;
}

export interface BudgetSpending {
  budgetId: string;
  spent: number;
  transactions: Transaction[];
  dailyRollover?: number;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  storeId?: string;
  description?: string;
}

// User preferences
export interface UserPreferences {
  dietaryPreferences: DietaryInfo[];
  favoriteStores: string[];
  defaultBudgetPeriod: "weekly" | "monthly" | "daily";
  dailyBudgetDays?: number;
  dailyBudgetAmount?: number;
}

// Category display info
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "frukt-gronnsaker": "Frukt & Grønnsaker",
  "meieri": "Meieri",
  "kjott-fisk": "Kjøtt & Fisk",
  "bakevarer": "Bakevarer",
  "hermetikk": "Hermetikk",
  "frossen": "Frossen mat",
  "drikke": "Drikke",
  "snacks": "Snacks",
  "husholdning": "Husholdning",
  "annet": "Annet",
};

export const DIETARY_LABELS: Record<DietaryInfo, string> = {
  "vegetar": "Vegetar",
  "vegan": "Vegan",
  "glutenfri": "Glutenfri",
  "laktosefri": "Laktosefri",
  "økologisk": "Økologisk",
};