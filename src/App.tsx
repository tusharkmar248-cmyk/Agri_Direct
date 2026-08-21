// ─── Agri Direct: App Router ────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import { I18nProvider, useLanguageState } from './i18n';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import MyListings from './pages/MyListings';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Offers from './pages/Offers';
import Orders from './pages/Orders';
import MarketPrices from './pages/MarketPrices';
import Earnings from './pages/Earnings';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import type { UserRole } from './types';

function DashboardRouter() {
  const { state } = useStore();
  return state.currentUser.role === 'farmer' ? <FarmerDashboard /> : <BuyerDashboard />;
}

/** Route guard — redirects to /dashboard if user's role doesn't match */
function RoleGuard({ allowedRole, children }: { allowedRole: UserRole; children: React.ReactNode }) {
  const { state } = useStore();
  if (state.currentUser.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { state } = useStore();
  const [language, setLanguage] = useLanguageState(state.language);

  return (
    <I18nProvider language={language} setLanguage={setLanguage}>
      <Routes>
        {/* Landing page and Login (no sidebar) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* App shell with sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/listings" element={<RoleGuard allowedRole="farmer"><MyListings /></RoleGuard>} />
          <Route path="/marketplace" element={<RoleGuard allowedRole="buyer"><Marketplace /></RoleGuard>} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/earnings" element={<RoleGuard allowedRole="farmer"><Earnings /></RoleGuard>} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </I18nProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </BrowserRouter>
  );
}
