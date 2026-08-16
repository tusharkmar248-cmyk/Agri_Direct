// ─── Agri Direct: App Layout Shell ──────────────────────────────────

import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ArrowLeftRight, RotateCcw, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import { useStore } from '../store';
import { useT } from '../i18n';
import type { Language } from '../types';

const langLabels: Record<Language, string> = { en: 'EN', hi: 'हिं', mr: 'मर' };
const langNames: Record<Language, string> = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' };

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const { state, dispatch } = useStore();
  const { t, language, setLanguage } = useT();
  const location = useLocation();
  const navigate = useNavigate();

  const unread = state.notifications.filter(n => n.userId === state.currentUser.id && !n.read).length;

  // Derive current page title from path
  const pathToTitle: Record<string, string> = {
    '/dashboard': t('dashboard'),
    '/listings': t('myListings'),
    '/marketplace': t('marketplace'),
    '/offers': t('offers'),
    '/orders': t('orders'),
    '/market-prices': t('marketPrices'),
    '/earnings': t('earnings'),
    '/notifications': t('notifications'),
  };
  const pageTitle = pathToTitle[location.pathname] || t('dashboard');

  const handleSwitchRole = () => {
    const otherRole = state.currentUser.role === 'farmer' ? 'buyer' : 'farmer';
    const otherUser = state.users.find(u => u.role === otherRole);
    if (otherUser) {
      dispatch({ type: 'SET_USER', user: otherUser });
      navigate('/dashboard');
    }
  };

  const handleResetData = () => {
    dispatch({ type: 'RESET_DATA' });
  };




  // Sidebar width values
  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-surface-dim" style={{ overflowX: 'hidden' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless opened */}
      <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onMobileClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Inject responsive margin via style tag — fixes sidebar overlap reliably */}
      <style>{`
        @media (min-width: 1024px) {
          #main-content-area {
            margin-left: ${sidebarWidth}px !important;
          }
        }
        @media (max-width: 1023px) {
          #main-content-area {
            margin-left: 0 !important;
          }
        }
      `}</style>

      {/* Main content area */}
      <div id="main-content-area" style={{ transition: 'margin-left 0.3s ease', minHeight: '100vh' }}>
        {/* Top navbar */}
        <header className="sticky top-0 z-20 h-16 bg-surface/80 backdrop-blur-lg border-b border-border-light flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-surface-dim text-text-secondary transition-colors cursor-pointer"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-bold text-text-primary">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset demo data */}
            <button
              id="reset-data-btn"
              onClick={handleResetData}
              className="p-2 rounded-xl hover:bg-surface-dim text-text-muted hover:text-accent-600 transition-colors cursor-pointer"
              title="Reset demo data"
            >
              <RotateCcw size={18} />
            </button>

            {/* Language switcher */}
            <div className="relative">
              <button
                id="language-switcher"
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-dim
                  text-text-secondary hover:text-primary-600 transition-colors text-sm font-medium cursor-pointer"
              >
                <Globe size={16} />
                <span>{langLabels[language]}</span>
              </button>
              {langDropdown && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-surface rounded-xl shadow-xl border border-border-light overflow-hidden z-50 animate-fade-in-up">
                  {(['en', 'hi', 'mr'] as Language[]).map(l => (
                    <button
                      key={l}
                      onClick={() => { setLanguage(l); dispatch({ type: 'SET_LANGUAGE', language: l }); setLangDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer
                        ${l === language ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-text-secondary hover:bg-surface-dim'}`}
                    >
                      {langNames[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role switcher */}
            <button
              id="role-switch-btn"
              onClick={handleSwitchRole}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                bg-accent-100 text-accent-700 hover:bg-accent-200
                transition-colors text-sm font-semibold cursor-pointer"
              title={t('switchRole')}
            >
              <ArrowLeftRight size={14} />
              <span className="hidden sm:inline">{state.currentUser.role === 'farmer' ? t('buyer') : t('farmer')}</span>
            </button>

            {/* Notification bell */}
            <button
              id="notif-bell"
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-xl hover:bg-surface-dim text-text-secondary hover:text-primary-600 transition-colors cursor-pointer"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-danger-500 text-white text-[10px] flex items-center justify-center font-bold"
                  style={{ animation: 'pulse-glow 2s infinite' }}>
                  {unread}
                </span>
              )}
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-border-light">
              <span className="text-2xl">{state.currentUser.avatar}</span>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-text-primary leading-tight">{state.currentUser.name}</div>
                <div className="text-xs text-text-muted capitalize">{t(state.currentUser.role as 'farmer' | 'buyer')}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
