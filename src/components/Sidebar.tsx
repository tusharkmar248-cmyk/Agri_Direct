// ─── Agri Direct: Sidebar Navigation ────────────────────────────────

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Tag, Truck,
  TrendingUp, Wallet, Bell, ChevronLeft, ChevronRight, Sprout,
} from 'lucide-react';
import { useStore } from '../store';
import { useT } from '../i18n';
import type { TranslationKey } from '../i18n';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: TranslationKey;
  roles: ('farmer' | 'buyer')[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'dashboard', roles: ['farmer', 'buyer'] },
  { to: '/listings', icon: <Package size={20} />, label: 'myListings', roles: ['farmer'] },
  { to: '/marketplace', icon: <ShoppingCart size={20} />, label: 'marketplace', roles: ['buyer'] },
  { to: '/offers', icon: <Tag size={20} />, label: 'offers', roles: ['farmer', 'buyer'] },
  { to: '/orders', icon: <Truck size={20} />, label: 'orders', roles: ['farmer', 'buyer'] },
  { to: '/market-prices', icon: <TrendingUp size={20} />, label: 'marketPrices', roles: ['farmer', 'buyer'] },
  { to: '/earnings', icon: <Wallet size={20} />, label: 'earnings', roles: ['farmer'] },
  { to: '/notifications', icon: <Bell size={20} />, label: 'notifications', roles: ['farmer', 'buyer'] },
];

export default function Sidebar({ collapsed, onToggle, onMobileClose }: SidebarProps) {
  const { state } = useStore();
  const { t } = useT();
  const role = state.currentUser.role;

  const filteredItems = navItems.filter(item => item.roles.includes(role));
  const unread = state.notifications.filter(n => n.userId === state.currentUser.id && !n.read).length;

  return (
    <aside
      id="sidebar"
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col
        bg-surface border-r border-border-light
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        max-lg:w-[260px]`}
      style={{ willChange: 'width' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border-light shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white shrink-0">
          <Sprout size={20} />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-text-primary whitespace-nowrap">
            {t('appName')}
          </span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {filteredItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 group relative
              ${isActive
                ? 'bg-primary-100 text-primary-700 shadow-sm'
                : 'text-text-secondary hover:bg-surface-dim hover:text-text-primary'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
          >
            <span className="shrink-0 relative">
              {item.icon}
              {item.label === 'notifications' && unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-danger-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {unread}
                </span>
              )}
            </span>
            {!collapsed && <span className="whitespace-nowrap">{t(item.label)}</span>}
            {collapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-text-primary text-surface text-xs font-medium
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {t(item.label)}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle — desktop only */}
      <button
        id="sidebar-toggle"
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center h-12 border-t border-border-light
          text-text-muted hover:text-primary-600 hover:bg-surface-dim transition-colors cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Bottom: User */}
      <div className={`border-t border-border-light p-3 ${collapsed ? 'px-2' : ''}`}>
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-surface-dim ${collapsed ? 'justify-center px-0' : ''}`}>
          <span className="text-2xl shrink-0">{state.currentUser.avatar}</span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold text-text-primary truncate">{state.currentUser.name}</div>
              <div className="text-xs text-text-muted capitalize">{t(state.currentUser.role as 'farmer' | 'buyer')}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
