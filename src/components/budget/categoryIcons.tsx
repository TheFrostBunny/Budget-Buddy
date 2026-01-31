import { Utensils, Bus, Film, HeartPulse, ShoppingBag, Home, MoreHorizontal } from 'lucide-react';

export const categoryIcons: Record<string, JSX.Element> = {
  'Mat': <Utensils className="inline-block mr-1 h-4 w-4 align-text-bottom" />,
  'Transport': <Bus className="inline-block mr-1 h-4 w-4 align-text-bottom" />,
  'Underholdning': <Film className="inline-block mr-1 h-4 w-4 align-text-bottom" />,
  'Helse': <HeartPulse className="inline-block mr-1 h-4 w-4 align-text-bottom" />,
  'Shopping': <ShoppingBag className="inline-block mr-1 h-4 w-4 align-text-bottom" />,
  'Bolig': <Home className="inline-block mr-1 h-4 w-4 align-text-bottom" />,
  'Annet': <MoreHorizontal className="inline-block mr-1 h-4 w-4 align-text-bottom" />,
};
