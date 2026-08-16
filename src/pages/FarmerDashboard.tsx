// ─── Agri Direct: Farmer Dashboard ──────────────────────────────────

import { useNavigate } from 'react-router-dom';
import { Package, Tag, Wallet, Truck, Plus, Eye, TrendingUp } from 'lucide-react';
import { useStore } from '../store';
import { useT } from '../i18n';

export default function FarmerDashboard() {
  const { state } = useStore();
  const { t } = useT();
  const navigate = useNavigate();
  const uid = state.currentUser.id;

  const activeListings = state.products.filter(p => p.farmerId === uid && p.active).length;
  const pendingOffers = state.offers.filter(o => o.farmerId === uid && o.status === 'pending').length;
  const totalEarnings = state.orders
    .filter(o => o.farmerId === uid && o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const recentOrders = state.orders.filter(o => o.farmerId === uid).slice(0, 5);

  const statCards = [
    { label: t('activeListings'), value: activeListings.toString(), icon: <Package size={22} />, color: 'bg-primary-100 text-primary-600', action: () => navigate('/listings') },
    { label: t('pendingOffers'), value: pendingOffers.toString(), icon: <Tag size={22} />, color: 'bg-accent-100 text-accent-600', action: () => navigate('/offers') },
    { label: t('totalEarnings'), value: `₹${totalEarnings.toLocaleString('en-IN')}`, icon: <Wallet size={22} />, color: 'bg-success-100 text-success-500', action: () => navigate('/earnings') },
    { label: t('recentOrders'), value: recentOrders.length.toString(), icon: <Truck size={22} />, color: 'bg-info-100 text-info-500', action: () => navigate('/orders') },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="glass-card p-6 gradient-bg text-white">
        <h2 className="text-2xl font-bold mb-1">
          {t('welcome')}, {state.currentUser.name}! {state.currentUser.avatar}
        </h2>
        <p className="text-white/80 text-sm">
          {state.currentUser.role === 'farmer' ? 'Manage your produce, track offers, and grow your earnings.' : 'Browse fresh produce and connect with farmers.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {statCards.map(card => (
          <button
            key={card.label}
            onClick={card.action}
            className="glass-card p-5 text-left cursor-pointer border-0 w-full"
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <div className="text-2xl font-extrabold text-text-primary">{card.value}</div>
            <div className="text-sm text-text-secondary mt-0.5">{card.label}</div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-3">{t('quickActions')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => navigate('/listings')} className="btn-primary justify-center py-3 cursor-pointer">
            <Plus size={18} /> {t('addListing')}
          </button>
          <button onClick={() => navigate('/offers')} className="btn-secondary justify-center py-3 cursor-pointer">
            <Eye size={18} /> {t('viewOffers')}
          </button>
          <button onClick={() => navigate('/market-prices')} className="btn-secondary justify-center py-3 cursor-pointer">
            <TrendingUp size={18} /> {t('marketPrices')}
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-3">{t('recentOrders')}</h3>
          <div className="space-y-2 stagger-children">
            {recentOrders.map(order => (
              <div key={order.id} className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getOrderEmoji(order.status)}</div>
                  <div>
                    <div className="font-semibold text-text-primary text-sm">{order.productName}</div>
                    <div className="text-xs text-text-muted">{order.buyerName} · {order.quantity} {order.unit}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-text-primary text-sm">₹{order.totalPrice.toLocaleString('en-IN')}</div>
                  <span className={`badge badge-${getStatusBadge(order.status)} text-[11px]`}>
                    {t(order.status as 'placed' | 'confirmed' | 'shipped' | 'delivered')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getOrderEmoji(status: string) {
  switch (status) {
    case 'placed': return '📋';
    case 'confirmed': return '✅';
    case 'shipped': return '🚚';
    case 'delivered': return '🎉';
    default: return '📦';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'placed': return 'info';
    case 'confirmed': return 'warning';
    case 'shipped': return 'primary';
    case 'delivered': return 'success';
    default: return 'info';
  }
}
