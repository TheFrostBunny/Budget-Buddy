import { Store, Product, StorePrice, Offer } from '@/types';

// Hamburg supermarkets
export const stores: Store[] = [
  { id: 'rewe', name: 'REWE', logo: '🛒', isFavorite: false },
  { id: 'edeka', name: 'EDEKA', logo: '🏪', isFavorite: false },
  { id: 'lidl', name: 'Lidl', logo: '🛍️', isFavorite: false },
  { id: 'aldi', name: 'ALDI Nord', logo: '🏬', isFavorite: false },
  { id: 'penny', name: 'Penny', logo: '🛒', isFavorite: false },
  { id: 'netto', name: 'Netto', logo: '🛍️', isFavorite: false },
];

// Common grocery products
export const products: Product[] = [
  // Frukt & Grønnsaker
  {
    id: 'apples',
    name: 'Epler',
    category: 'frukt-gronnsaker',
    unit: 'kg',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },
  {
    id: 'bananas',
    name: 'Bananer',
    category: 'frukt-gronnsaker',
    unit: 'kg',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },
  {
    id: 'tomatoes',
    name: 'Tomater',
    category: 'frukt-gronnsaker',
    unit: 'kg',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },
  {
    id: 'potatoes',
    name: 'Poteter',
    category: 'frukt-gronnsaker',
    unit: 'kg',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },
  {
    id: 'onions',
    name: 'Løk',
    category: 'frukt-gronnsaker',
    unit: 'kg',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },
  {
    id: 'carrots',
    name: 'Gulrøtter',
    category: 'frukt-gronnsaker',
    unit: 'kg',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },

  // Meieri
  {
    id: 'milk',
    name: 'Melk (1L)',
    category: 'meieri',
    unit: 'stk',
    dietaryInfo: ['vegetar', 'glutenfri'],
  },
  {
    id: 'butter',
    name: 'Smør (250g)',
    category: 'meieri',
    unit: 'stk',
    dietaryInfo: ['vegetar', 'glutenfri'],
  },
  {
    id: 'cheese',
    name: 'Ost Gouda (200g)',
    category: 'meieri',
    unit: 'stk',
    dietaryInfo: ['vegetar', 'glutenfri'],
  },
  {
    id: 'yogurt',
    name: 'Yoghurt naturell',
    category: 'meieri',
    unit: 'stk',
    dietaryInfo: ['vegetar', 'glutenfri'],
  },
  {
    id: 'eggs',
    name: 'Egg (10 stk)',
    category: 'meieri',
    unit: 'pk',
    dietaryInfo: ['vegetar', 'glutenfri', 'laktosefri'],
  },

  // Kjøtt & Fisk
  {
    id: 'chicken',
    name: 'Kyllingfilet',
    category: 'kjott-fisk',
    unit: 'kg',
    dietaryInfo: ['glutenfri', 'laktosefri'],
  },
  {
    id: 'ground-beef',
    name: 'Kjøttdeig',
    category: 'kjott-fisk',
    unit: '500g',
    dietaryInfo: ['glutenfri', 'laktosefri'],
  },
  {
    id: 'salmon',
    name: 'Laks',
    category: 'kjott-fisk',
    unit: 'kg',
    dietaryInfo: ['glutenfri', 'laktosefri'],
  },

  // Bakevarer
  {
    id: 'bread',
    name: 'Brød',
    category: 'bakevarer',
    unit: 'stk',
    dietaryInfo: ['vegetar', 'laktosefri'],
  },
  {
    id: 'rolls',
    name: 'Rundstykker (6 stk)',
    category: 'bakevarer',
    unit: 'pk',
    dietaryInfo: ['vegetar'],
  },

  // Hermetikk
  {
    id: 'tomato-sauce',
    name: 'Tomatsaus',
    category: 'hermetikk',
    unit: 'stk',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },
  {
    id: 'beans',
    name: 'Bønner i tomatsaus',
    category: 'hermetikk',
    unit: 'stk',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },

  // Drikke
  {
    id: 'water',
    name: 'Mineralvann (1.5L)',
    category: 'drikke',
    unit: 'stk',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },
  {
    id: 'juice',
    name: 'Appelsinjuice (1L)',
    category: 'drikke',
    unit: 'stk',
    dietaryInfo: ['vegan', 'glutenfri', 'laktosefri'],
  },

  // Husholdning
  {
    id: 'toilet-paper',
    name: 'Toalettpapir (8 ruller)',
    category: 'husholdning',
    unit: 'pk',
    dietaryInfo: [],
  },
  { id: 'dish-soap', name: 'Oppvaskmiddel', category: 'husholdning', unit: 'stk', dietaryInfo: [] },
];

// Prices per store (in EUR)
export const storePrices: StorePrice[] = [
  // REWE prices
  { productId: 'apples', storeId: 'rewe', price: 2.49 },
  { productId: 'bananas', storeId: 'rewe', price: 1.69 },
  { productId: 'tomatoes', storeId: 'rewe', price: 2.99 },
  { productId: 'potatoes', storeId: 'rewe', price: 1.49 },
  { productId: 'onions', storeId: 'rewe', price: 1.29 },
  { productId: 'carrots', storeId: 'rewe', price: 1.19 },
  { productId: 'milk', storeId: 'rewe', price: 1.15 },
  { productId: 'butter', storeId: 'rewe', price: 2.29 },
  { productId: 'cheese', storeId: 'rewe', price: 2.49 },
  { productId: 'yogurt', storeId: 'rewe', price: 0.79 },
  { productId: 'eggs', storeId: 'rewe', price: 2.99 },
  { productId: 'chicken', storeId: 'rewe', price: 9.99 },
  { productId: 'ground-beef', storeId: 'rewe', price: 4.49 },
  { productId: 'salmon', storeId: 'rewe', price: 19.99 },
  { productId: 'bread', storeId: 'rewe', price: 1.89 },
  { productId: 'rolls', storeId: 'rewe', price: 1.49 },
  { productId: 'tomato-sauce', storeId: 'rewe', price: 1.29 },
  { productId: 'beans', storeId: 'rewe', price: 0.99 },
  { productId: 'water', storeId: 'rewe', price: 0.49 },
  { productId: 'juice', storeId: 'rewe', price: 1.99 },
  { productId: 'toilet-paper', storeId: 'rewe', price: 3.99 },
  { productId: 'dish-soap', storeId: 'rewe', price: 1.49 },

  // Lidl prices (generally cheaper)
  { productId: 'apples', storeId: 'lidl', price: 1.99 },
  { productId: 'bananas', storeId: 'lidl', price: 1.29 },
  { productId: 'tomatoes', storeId: 'lidl', price: 2.49 },
  { productId: 'potatoes', storeId: 'lidl', price: 1.29 },
  { productId: 'onions', storeId: 'lidl', price: 0.99 },
  { productId: 'carrots', storeId: 'lidl', price: 0.99 },
  { productId: 'milk', storeId: 'lidl', price: 0.99 },
  { productId: 'butter', storeId: 'lidl', price: 1.89 },
  { productId: 'cheese', storeId: 'lidl', price: 1.99 },
  { productId: 'yogurt', storeId: 'lidl', price: 0.59 },
  { productId: 'eggs', storeId: 'lidl', price: 2.49 },
  { productId: 'chicken', storeId: 'lidl', price: 7.99 },
  { productId: 'ground-beef', storeId: 'lidl', price: 3.99 },
  { productId: 'salmon', storeId: 'lidl', price: 16.99 },
  { productId: 'bread', storeId: 'lidl', price: 1.29 },
  { productId: 'rolls', storeId: 'lidl', price: 0.99 },
  { productId: 'tomato-sauce', storeId: 'lidl', price: 0.89 },
  { productId: 'beans', storeId: 'lidl', price: 0.69 },
  { productId: 'water', storeId: 'lidl', price: 0.29 },
  { productId: 'juice', storeId: 'lidl', price: 1.49 },
  { productId: 'toilet-paper', storeId: 'lidl', price: 2.99 },
  { productId: 'dish-soap', storeId: 'lidl', price: 0.99 },

  // ALDI prices
  { productId: 'apples', storeId: 'aldi', price: 1.89 },
  { productId: 'bananas', storeId: 'aldi', price: 1.19 },
  { productId: 'tomatoes', storeId: 'aldi', price: 2.29 },
  { productId: 'potatoes', storeId: 'aldi', price: 1.19 },
  { productId: 'onions', storeId: 'aldi', price: 0.89 },
  { productId: 'carrots', storeId: 'aldi', price: 0.89 },
  { productId: 'milk', storeId: 'aldi', price: 0.95 },
  { productId: 'butter', storeId: 'aldi', price: 1.79 },
  { productId: 'cheese', storeId: 'aldi', price: 1.89 },
  { productId: 'yogurt', storeId: 'aldi', price: 0.55 },
  { productId: 'eggs', storeId: 'aldi', price: 2.29 },
  { productId: 'chicken', storeId: 'aldi', price: 7.49 },
  { productId: 'ground-beef', storeId: 'aldi', price: 3.79 },
  { productId: 'salmon', storeId: 'aldi', price: 15.99 },
  { productId: 'bread', storeId: 'aldi', price: 1.19 },
  { productId: 'rolls', storeId: 'aldi', price: 0.89 },
  { productId: 'tomato-sauce', storeId: 'aldi', price: 0.79 },
  { productId: 'beans', storeId: 'aldi', price: 0.59 },
  { productId: 'water', storeId: 'aldi', price: 0.25 },
  { productId: 'juice', storeId: 'aldi', price: 1.29 },
  { productId: 'toilet-paper', storeId: 'aldi', price: 2.79 },
  { productId: 'dish-soap', storeId: 'aldi', price: 0.89 },

  // EDEKA prices (premium)
  { productId: 'apples', storeId: 'edeka', price: 2.79 },
  { productId: 'bananas', storeId: 'edeka', price: 1.79 },
  { productId: 'tomatoes', storeId: 'edeka', price: 3.29 },
  { productId: 'potatoes', storeId: 'edeka', price: 1.69 },
  { productId: 'onions', storeId: 'edeka', price: 1.39 },
  { productId: 'carrots', storeId: 'edeka', price: 1.29 },
  { productId: 'milk', storeId: 'edeka', price: 1.25 },
  { productId: 'butter', storeId: 'edeka', price: 2.49 },
  { productId: 'cheese', storeId: 'edeka', price: 2.79 },
  { productId: 'yogurt', storeId: 'edeka', price: 0.89 },
  { productId: 'eggs', storeId: 'edeka', price: 3.29 },
  { productId: 'chicken', storeId: 'edeka', price: 10.99 },
  { productId: 'ground-beef', storeId: 'edeka', price: 4.99 },
  { productId: 'salmon', storeId: 'edeka', price: 22.99 },
  { productId: 'bread', storeId: 'edeka', price: 2.19 },
  { productId: 'rolls', storeId: 'edeka', price: 1.69 },
  { productId: 'tomato-sauce', storeId: 'edeka', price: 1.49 },
  { productId: 'beans', storeId: 'edeka', price: 1.19 },
  { productId: 'water', storeId: 'edeka', price: 0.59 },
  { productId: 'juice', storeId: 'edeka', price: 2.29 },
  { productId: 'toilet-paper', storeId: 'edeka', price: 4.49 },
  { productId: 'dish-soap', storeId: 'edeka', price: 1.69 },

  // Penny prices
  { productId: 'apples', storeId: 'penny', price: 1.99 },
  { productId: 'bananas', storeId: 'penny', price: 1.39 },
  { productId: 'tomatoes', storeId: 'penny', price: 2.59 },
  { productId: 'potatoes', storeId: 'penny', price: 1.39 },
  { productId: 'onions', storeId: 'penny', price: 1.09 },
  { productId: 'carrots', storeId: 'penny', price: 1.09 },
  { productId: 'milk', storeId: 'penny', price: 1.05 },
  { productId: 'butter', storeId: 'penny', price: 1.99 },
  { productId: 'cheese', storeId: 'penny', price: 2.19 },
  { productId: 'yogurt', storeId: 'penny', price: 0.69 },
  { productId: 'eggs', storeId: 'penny', price: 2.69 },
  { productId: 'chicken', storeId: 'penny', price: 8.49 },
  { productId: 'ground-beef', storeId: 'penny', price: 4.19 },
  { productId: 'salmon', storeId: 'penny', price: 17.99 },
  { productId: 'bread', storeId: 'penny', price: 1.49 },
  { productId: 'rolls', storeId: 'penny', price: 1.19 },
  { productId: 'tomato-sauce', storeId: 'penny', price: 0.99 },
  { productId: 'beans', storeId: 'penny', price: 0.79 },
  { productId: 'water', storeId: 'penny', price: 0.35 },
  { productId: 'juice', storeId: 'penny', price: 1.69 },
  { productId: 'toilet-paper', storeId: 'penny', price: 3.49 },
  { productId: 'dish-soap', storeId: 'penny', price: 1.19 },

  // Netto prices
  { productId: 'apples', storeId: 'netto', price: 1.89 },
  { productId: 'bananas', storeId: 'netto', price: 1.29 },
  { productId: 'tomatoes', storeId: 'netto', price: 2.49 },
  { productId: 'potatoes', storeId: 'netto', price: 1.29 },
  { productId: 'onions', storeId: 'netto', price: 0.99 },
  { productId: 'carrots', storeId: 'netto', price: 0.99 },
  { productId: 'milk', storeId: 'netto', price: 0.99 },
  { productId: 'butter', storeId: 'netto', price: 1.89 },
  { productId: 'cheese', storeId: 'netto', price: 2.09 },
  { productId: 'yogurt', storeId: 'netto', price: 0.59 },
  { productId: 'eggs', storeId: 'netto', price: 2.49 },
  { productId: 'chicken', storeId: 'netto', price: 7.99 },
  { productId: 'ground-beef', storeId: 'netto', price: 3.99 },
  { productId: 'salmon', storeId: 'netto', price: 16.49 },
  { productId: 'bread', storeId: 'netto', price: 1.29 },
  { productId: 'rolls', storeId: 'netto', price: 0.99 },
  { productId: 'tomato-sauce', storeId: 'netto', price: 0.89 },
  { productId: 'beans', storeId: 'netto', price: 0.69 },
  { productId: 'water', storeId: 'netto', price: 0.29 },
  { productId: 'juice', storeId: 'netto', price: 1.49 },
  { productId: 'toilet-paper', storeId: 'netto', price: 2.99 },
  { productId: 'dish-soap', storeId: 'netto', price: 0.99 },
];

// Current offers in Hamburg
export const offers: Offer[] = [
  {
    id: 'offer-1',
    storeId: 'lidl',
    productId: 'chicken',
    originalPrice: 7.99,
    salePrice: 5.99,
    validFrom: '2026-01-13',
    validTo: '2026-01-19',
    description: 'Ukens tilbud på kyllingfilet!',
  },
  {
    id: 'offer-2',
    storeId: 'aldi',
    productId: 'salmon',
    originalPrice: 15.99,
    salePrice: 12.99,
    validFrom: '2026-01-13',
    validTo: '2026-01-17',
    description: 'Fersk norsk laks til superpris',
  },
  {
    id: 'offer-3',
    storeId: 'rewe',
    productId: 'butter',
    originalPrice: 2.29,
    salePrice: 1.79,
    validFrom: '2026-01-10',
    validTo: '2026-01-16',
  },
  {
    id: 'offer-4',
    storeId: 'edeka',
    productId: 'eggs',
    originalPrice: 3.29,
    salePrice: 2.49,
    validFrom: '2026-01-13',
    validTo: '2026-01-20',
    description: 'Frittgående høner',
  },
  {
    id: 'offer-5',
    storeId: 'penny',
    productId: 'juice',
    originalPrice: 1.69,
    salePrice: 0.99,
    validFrom: '2026-01-13',
    validTo: '2026-01-15',
    description: 'Ferskpresset appelsinjuice',
  },
  {
    id: 'offer-6',
    storeId: 'netto',
    productId: 'toilet-paper',
    originalPrice: 2.99,
    salePrice: 1.99,
    validFrom: '2026-01-13',
    validTo: '2026-01-19',
  },
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getStoreById(id: string): Store | undefined {
  return stores.find((s) => s.id === id);
}

export function getPriceForProduct(productId: string, storeId: string): number | undefined {
  const priceEntry = storePrices.find((p) => p.productId === productId && p.storeId === storeId);
  return priceEntry?.price;
}

export function getCheapestStore(
  productId: string,
): { storeId: string; price: number } | undefined {
  const prices = storePrices
    .filter((p) => p.productId === productId)
    .sort((a, b) => a.price - b.price);

  if (prices.length === 0) return undefined;
  return { storeId: prices[0].storeId, price: prices[0].price };
}

export function getActiveOffers(): Offer[] {
  const today = new Date().toISOString().split('T')[0];
  return offers.filter((o) => o.validFrom <= today && o.validTo >= today);
}
