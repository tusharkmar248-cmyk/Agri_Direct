// ─── Agri Direct: Farmer Earnings ───────────────────────────────────

import { Wallet, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStore } from '../store';
import { useT } from '../i18n';

const COLORS = ['#059669', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function Earnings() {
  const { state } = useStore();
  const { t } = useT();
  const uid = state.currentUser.id;

  const deliveredOrders = state.orders.filter(o => o.farmerId === uid && o.status === 'delivered');
  const allFarmerOrders = state.orders.filter(o => o.farmerId === uid);

  const totalRevenue = allFarmerOrders.reduce((s, o) => s + o.totalPrice, 0);
  const deliveredRevenue = deliveredOrders.reduce((s, o) => s + o.totalPrice, 0);

  // Monthly breakdown (simulated)
  const monthlyData = [
    { month: 'Mar', revenue: 12000 },
    { month: 'Apr', revenue: 18500 },
    { month: 'May', revenue: 22000 },
    { month: 'Jun', revenue: 28000 },
    { month: 'Jul', revenue: 35000 },
    { month: 'Aug', revenue: totalRevenue || 45000 },
  ];

  // Crop-wise breakdown
  const cropMap = new Map<string, number>();
  allFarmerOrders.forEach(o => {
    cropMap.set(o.productName, (cropMap.get(o.productName) || 0) + o.totalPrice);
  });
  const cropData = Array.from(cropMap.entries()).map(([name, value]) => ({ name, value }));
  if (cropData.length === 0) {
    cropData.push({ name: 'Onion', value: 6000 }, { name: 'Potato', value: 12500 }, { name: 'Grapes', value: 8000 });
  }

  // Payout history (simulated)
  const payouts = [
    { date: '2026-08-10', amount: 6000, status: 'Paid' },
    { date: '2026-07-28', amount: 12500, status: 'Paid' },
    { date: '2026-07-15', amount: 8000, status: 'Paid' },
    { date: '2026-08-14', amount: deliveredRevenue || 15000, status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <div className="text-sm text-text-muted">{t('totalRevenue')}</div>
          </div>
          <div className="text-2xl font-extrabold text-text-primary">₹{(totalRevenue || 45000).toLocaleString('en-IN')}</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div className="text-sm text-text-muted">{t('thisMonth')}</div>
          </div>
          <div className="text-2xl font-extrabold text-text-primary">₹{(totalRevenue || 45000).toLocaleString('en-IN')}</div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-info-100 text-info-500 flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div className="text-sm text-text-muted">{t('lastMonth')}</div>
          </div>
          <div className="text-2xl font-extrabold text-text-primary">₹35,000</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-text-primary mb-4">{t('revenueChart')}</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8e0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#7c9a79" />
                <YAxis tick={{ fontSize: 11 }} stroke="#7c9a79" />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8e0', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Breakdown */}
        <div className="glass-card p-5">
          <h3 className="font-bold text-text-primary mb-4">{t('cropBreakdown')}</h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={cropData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {cropData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-border-light">
          <h3 className="font-bold text-text-primary">{t('payoutHistory')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left p-4 font-semibold text-text-secondary">{t('date')}</th>
                <th className="text-right p-4 font-semibold text-text-secondary">{t('amount')}</th>
                <th className="text-center p-4 font-semibold text-text-secondary">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p, i) => (
                <tr key={i} className="border-b border-border-light hover:bg-surface-dim">
                  <td className="p-4 text-text-primary">{p.date}</td>
                  <td className="p-4 text-right font-bold text-primary-600">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-center">
                    <span className={`badge ${p.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
