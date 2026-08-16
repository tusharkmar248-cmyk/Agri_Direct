// ─── Agri Direct: Market Prices Dashboard ──────────────────────────

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useStore } from '../store';
import { useT } from '../i18n';

export default function MarketPrices() {
  const { state } = useStore();
  const { t, language } = useT();
  const [selected, setSelected] = useState(0);

  const prices = state.marketPrices;
  const selectedCommodity = prices[selected];

  const getName = (mp: typeof prices[0]) => {
    if (language === 'hi') return mp.commodityHi;
    if (language === 'mr') return mp.commodityMr;
    return mp.commodity;
  };

  const chartData = selectedCommodity?.priceHistory.map((price, i) => ({
    day: `Day ${i + 1}`,
    price,
  })) ?? [];

  const trendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} className="text-success-500" />;
      case 'down': return <TrendingDown size={14} className="text-danger-500" />;
      default: return <Minus size={14} className="text-text-muted" />;
    }
  };

  const trendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-success-500';
      case 'down': return 'text-danger-500';
      default: return 'text-text-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">{t('commodityPrices')}</h2>
        <span className="text-xs text-text-muted">Updated: {new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Price Table */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left p-4 font-semibold text-text-secondary">{t('commodity')}</th>
                    <th className="text-right p-4 font-semibold text-text-secondary">{t('minPrice')}</th>
                    <th className="text-right p-4 font-semibold text-text-secondary">{t('maxPrice')}</th>
                    <th className="text-right p-4 font-semibold text-text-secondary">{t('avgPrice')}</th>
                    <th className="text-center p-4 font-semibold text-text-secondary">{t('mandi')}</th>
                    <th className="text-center p-4 font-semibold text-text-secondary">{t('trend')}</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((mp, i) => (
                    <tr
                      key={mp.commodity}
                      onClick={() => setSelected(i)}
                      className={`border-b border-border-light cursor-pointer transition-colors
                        ${i === selected ? 'bg-primary-50' : 'hover:bg-surface-dim'}`}
                    >
                      <td className="p-4 font-medium text-text-primary">{getName(mp)}</td>
                      <td className="p-4 text-right text-text-secondary">₹{mp.minPrice}</td>
                      <td className="p-4 text-right text-text-secondary">₹{mp.maxPrice}</td>
                      <td className="p-4 text-right font-bold text-primary-600">₹{mp.avgPrice}</td>
                      <td className="p-4 text-center text-text-muted">{mp.mandi}</td>
                      <td className="p-4">
                        <div className={`flex items-center justify-center gap-1 font-semibold text-xs ${trendColor(mp.trend)}`}>
                          {trendIcon(mp.trend)}
                          {t(mp.trend as 'up' | 'down' | 'stable')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Price Chart */}
        <div className="space-y-4">
          {selectedCommodity && (
            <>
              <div className="glass-card p-5">
                <h3 className="font-bold text-text-primary mb-1">{getName(selectedCommodity)}</h3>
                <div className="text-3xl font-extrabold text-primary-600 mb-1">₹{selectedCommodity.avgPrice}<span className="text-sm font-normal text-text-muted">/{selectedCommodity.unit}</span></div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor(selectedCommodity.trend)}`}>
                  {trendIcon(selectedCommodity.trend)}
                  {t(selectedCommodity.trend as 'up' | 'down' | 'stable')}
                </div>
              </div>

              <div className="glass-card p-5">
                <h3 className="font-bold text-text-primary mb-4">{t('priceTrends')}</h3>
                <div style={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e0" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#7c9a79" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#7c9a79" />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255,255,255,0.95)',
                          border: '1px solid #e2e8e0',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                      <Area type="monotone" dataKey="price" stroke="#059669" strokeWidth={2} fill="url(#priceGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Price range bar */}
              <div className="glass-card p-5">
                <div className="flex justify-between text-xs text-text-muted mb-2">
                  <span>₹{selectedCommodity.minPrice}</span>
                  <span>₹{selectedCommodity.maxPrice}</span>
                </div>
                <div className="h-3 bg-surface-dim rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all"
                    style={{
                      width: `${((selectedCommodity.avgPrice - selectedCommodity.minPrice) / (selectedCommodity.maxPrice - selectedCommodity.minPrice)) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-center text-xs text-text-muted mt-2">
                  {t('avgPrice')}: <span className="font-bold text-primary-600">₹{selectedCommodity.avgPrice}/{selectedCommodity.unit}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
