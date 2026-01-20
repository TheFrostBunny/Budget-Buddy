import { NavLink, useLocation } from 'react-router-dom';
import { Home, User, ShoppingCart, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, labelKey: 'nav.home' },
  { to: '/shopping-list', icon: ShoppingCart, labelKey: 'nav.shoppingList' },
  { to: '/stores', icon: Store, labelKey: 'nav.stores' },
  { to: '/profile', icon: User, labelKey: 'nav.profile' },
];

export function BottomNav() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t bg-card">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, labelKey }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5]')} />
              <span>{t(labelKey)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
