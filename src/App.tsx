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

function DashboardRouter() {
  const { state } = useStore();
  return state.currentUser.role === 'farmer' ? <FarmerDashboard /> : <BuyerDashboard />;
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
          <Route path="/listings" element={<MyListings />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/earnings" element={<Earnings />} />
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
