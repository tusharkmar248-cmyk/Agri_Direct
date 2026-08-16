// ─── Agri Direct: Buyer Dashboard ───────────────────────────────────

import { useNavigate } from 'react-router-dom';
import { Tag, Truck, Wallet, Search, TrendingUp, Eye } from 'lucide-react';
import { useStore } from '../store';
import { useT } from '../i18n';

export default function BuyerDashboard() {
  const { state } = useStore();
  const { t } = useT();
  const navigate = useNavigate();
  const uid = state.currentUser.id;

  const activeOrders = state.orders.filter(o => o.buyerId === uid && o.status !== 'delivered').length;
  const pendingOffers = state.offers.filter(o => o.buyerId === uid && o.status === 'pending').length;
  const totalSpent = state.orders
    .filter(o => o.buyerId === uid)
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const recommendedProducts = state.products.filter(p => p.active).slice(0, 4);

  const statCards = [
    { label: t('activeOrders'), value: activeOrders.toString(), icon: <Truck size={22} />, color: 'bg-primary-100 text-primary-600', action: () => navigate('/orders') },
    { label: t('pendingOffers'), value: pendingOffers.toString(), icon: <Tag size={22} />, color: 'bg-accent-100 text-accent-600', action: () => navigate('/offers') },
    { label: t('totalSpent'), value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: <Wallet size={22} />, color: 'bg-info-100 text-info-500', action: () => navigate('/orders') },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="glass-card p-6 gradient-bg text-white">
        <h2 className="text-2xl font-bold mb-1">
          {t('welcome')}, {state.currentUser.name}! {state.currentUser.avatar}
        </h2>
        <p className="text-white/80 text-sm">Browse fresh produce from farmers across India and get the best deals.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
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
          <button onClick={() => navigate('/marketplace')} className="btn-primary justify-center py-3 cursor-pointer">
            <Search size={18} /> {t('browseMarket')}
          </button>
          <button onClick={() => navigate('/offers')} className="btn-secondary justify-center py-3 cursor-pointer">
            <Eye size={18} /> {t('viewOffers')}
          </button>
          <button onClick={() => navigate('/market-prices')} className="btn-secondary justify-center py-3 cursor-pointer">
            <TrendingUp size={18} /> {t('marketPrices')}
          </button>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-3">{t('recommended')}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {recommendedProducts.map(product => (
              <button
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="glass-card p-4 text-left cursor-pointer border-0"
              >
                <div className="text-4xl mb-2">{product.image}</div>
                <div className="font-semibold text-text-primary text-sm">{product.name}</div>
                <div className="text-xs text-text-muted mb-2">{product.farmerName} · {product.location}</div>
                <div className="flex items-center justify-between">
                  <span className="text-primary-600 font-bold text-sm">₹{product.price}/{product.unit}</span>
                  {product.organic && <span className="badge badge-success text-[10px]">🌿 {t('organic')}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
