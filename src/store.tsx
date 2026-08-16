// ─── Agri Direct: Global State (Context + LocalStorage) ─────────────

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, User, Product, Offer, Order, AppNotification, Language, OfferStatus, OrderStatus } from './types';
import { demoUsers, demoProducts, demoOffers, demoOrders, demoNotifications, demoMarketPrices } from './demoData';

const STORAGE_KEY = 'agri-direct-state';

function getInitialState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AppState;
    }
  } catch { /* ignore parse errors */ }
  return {
    currentUser: demoUsers[0],
    users: demoUsers,
    products: demoProducts,
    offers: demoOffers,
    orders: demoOrders,
    notifications: demoNotifications,
    marketPrices: demoMarketPrices,
    language: 'en',
  };
}

// ─── Actions ────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_USER'; user: User }
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; product: Product }
  | { type: 'DELETE_PRODUCT'; id: string }
  | { type: 'TOGGLE_PRODUCT'; id: string }
  | { type: 'ADD_OFFER'; offer: Offer }
  | { type: 'UPDATE_OFFER_STATUS'; id: string; status: OfferStatus }
  | { type: 'ADD_ORDER'; order: Order }
  | { type: 'UPDATE_ORDER_STATUS'; id: string; status: OrderStatus }
  | { type: 'ADD_NOTIFICATION'; notification: AppNotification }
  | { type: 'MARK_NOTIFICATION_READ'; id: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ'; userId: string }
  | { type: 'RESET_DATA' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.user };
    case 'SET_LANGUAGE':
      return { ...state, language: action.language };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.product, ...state.products] };
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.product.id ? action.product : p) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    case 'TOGGLE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.id ? { ...p, active: !p.active } : p) };
    case 'ADD_OFFER':
      return { ...state, offers: [action.offer, ...state.offers] };
    case 'UPDATE_OFFER_STATUS':
      return { ...state, offers: state.offers.map(o => o.id === action.id ? { ...o, status: action.status } : o) };
    case 'ADD_ORDER':
      return { ...state, orders: [action.order, ...state.orders] };
    case 'UPDATE_ORDER_STATUS': {
      const now = new Date().toISOString();
      return {
        ...state,
        orders: state.orders.map(o => {
          if (o.id !== action.id) return o;
          const updates: Partial<Order> = { status: action.status };
          if (action.status === 'confirmed') updates.confirmedAt = now;
          if (action.status === 'shipped') updates.shippedAt = now;
          if (action.status === 'delivered') updates.deliveredAt = now;
          return { ...o, ...updates };
        }),
      };
    }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.notification, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return { ...state, notifications: state.notifications.map(n => n.id === action.id ? { ...n, read: true } : n) };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map(n => n.userId === action.userId ? { ...n, read: true } : n) };
    case 'RESET_DATA':
      localStorage.removeItem(STORAGE_KEY);
      return {
        currentUser: demoUsers[0],
        users: demoUsers,
        products: demoProducts,
        offers: demoOffers,
        orders: demoOrders,
        notifications: demoNotifications,
        marketPrices: demoMarketPrices,
        language: state.language,
      };
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────

interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <StoreContext value={{ state, dispatch }}>{children}</StoreContext>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
