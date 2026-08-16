// ─── Agri Direct: Orders & Delivery Tracking ───────────────────────

import { Package, CheckCircle2, Truck, PartyPopper, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { useT } from '../i18n';
import type { OrderStatus } from '../types';

const statusSteps: OrderStatus[] = ['placed', 'confirmed', 'shipped', 'delivered'];

const stepIcons: Record<OrderStatus, React.ReactNode> = {
  placed: <Package size={18} />,
  confirmed: <CheckCircle2 size={18} />,
  shipped: <Truck size={18} />,
  delivered: <PartyPopper size={18} />,
};

export default function Orders() {
  const { state, dispatch } = useStore();
  const { t } = useT();
  const uid = state.currentUser.id;
  const isFarmer = state.currentUser.role === 'farmer';

  const myOrders = state.orders.filter(o =>
    isFarmer ? o.farmerId === uid : o.buyerId === uid
  );

  const getStepIndex = (status: OrderStatus) => statusSteps.indexOf(status);

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    const currentIdx = getStepIndex(currentStatus);
    if (currentIdx < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentIdx + 1];
      dispatch({ type: 'UPDATE_ORDER_STATUS', id: orderId, status: nextStatus });

      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          notification: {
            id: `notif-${Date.now()}`,
            userId: isFarmer ? order.buyerId : order.farmerId,
            type: 'order',
            title: `Order ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`,
            message: `Order for ${order.productName} has been ${nextStatus}`,
            read: false,
            createdAt: new Date().toISOString(),
          },
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-text-primary">{t('allOrders')}</h2>

      <div className="space-y-4 stagger-children">
        {myOrders.map(order => {
          const activeStep = getStepIndex(order.status);
          return (
            <div key={order.id} className="glass-card p-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl shrink-0">
                    {state.products.find(p => p.id === order.productId)?.image || '📦'}
                  </div>
                  <div>
                    <div className="font-bold text-text-primary">{order.productName}</div>
                    <div className="text-xs text-text-muted">
                      {isFarmer ? `${t('buyer')}: ${order.buyerName}` : `${t('farmer')}: ${order.farmerName}`}
                    </div>
                    <div className="text-xs text-text-muted">
                      {order.quantity} {order.unit} · {t('orderTotal')}: <span className="font-bold text-primary-600">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Advance button (farmer only, not delivered) */}
                {isFarmer && order.status !== 'delivered' && (
                  <button
                    id={`advance-order-${order.id}`}
                    onClick={() => handleAdvanceStatus(order.id, order.status)}
                    className="btn-primary text-sm"
                  >
                    {statusSteps[activeStep + 1] && t(statusSteps[activeStep + 1])} <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, i) => {
                    const isComplete = i <= activeStep;
                    const isCurrent = i === activeStep;
                    return (
                      <div key={step} className="flex flex-col items-center flex-1 relative">
                        {/* Connector line */}
                        {i > 0 && (
                          <div
                            className={`absolute top-5 right-1/2 h-0.5 w-full -z-0 transition-colors duration-500
                              ${i <= activeStep ? 'bg-primary-500' : 'bg-border'}`}
                          />
                        )}

                        {/* Step circle */}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                            ${isComplete
                              ? 'bg-primary-500 text-white shadow-lg'
                              : 'bg-surface-dim text-text-muted border-2 border-border'
                            }
                            ${isCurrent ? 'ring-4 ring-primary-200 scale-110' : ''}`}
                          style={isCurrent ? { animation: 'pulse-glow 2s infinite' } : {}}
                        >
                          {stepIcons[step]}
                        </div>

                        {/* Label */}
                        <div className={`text-xs mt-2 font-medium text-center
                          ${isComplete ? 'text-primary-600' : 'text-text-muted'}`}>
                          {t(step)}
                        </div>

                        {/* Timestamp */}
                        {getTimestamp(order, step) && (
                          <div className="text-[10px] text-text-muted mt-0.5">
                            {formatTime(getTimestamp(order, step)!)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery address */}
              <div className="mt-4 pt-3 border-t border-border-light text-xs text-text-muted">
                📍 {t('deliveryAddress')}: {order.deliveryAddress}
              </div>
            </div>
          );
        })}
      </div>

      {myOrders.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-text-muted">{t('noOrders')}</p>
        </div>
      )}
    </div>
  );
}

function getTimestamp(order: { placedAt: string; confirmedAt?: string; shippedAt?: string; deliveredAt?: string }, step: OrderStatus): string | undefined {
  switch (step) {
    case 'placed': return order.placedAt;
    case 'confirmed': return order.confirmedAt;
    case 'shipped': return order.shippedAt;
    case 'delivered': return order.deliveredAt;
  }
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}
