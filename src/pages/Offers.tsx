// ─── Agri Direct: Offers Management ────────────────────────────────

import { useState } from 'react';
import { Check, X, Clock, CheckCircle2, XCircle, MessageSquare } from 'lucide-react';
import { useStore } from '../store';
import { useT } from '../i18n';
import type { OfferStatus, Order } from '../types';

export default function Offers() {
  const { state, dispatch } = useStore();
  const { t } = useT();
  const uid = state.currentUser.id;
  const isFarmer = state.currentUser.role === 'farmer';

  const [tab, setTab] = useState<'received' | 'sent'>(isFarmer ? 'received' : 'sent');

  const receivedOffers = state.offers.filter(o => o.farmerId === uid);
  const sentOffers = state.offers.filter(o => o.buyerId === uid);
  const currentOffers = tab === 'received' ? receivedOffers : sentOffers;

  const handleAccept = (offerId: string) => {
    const offer = state.offers.find(o => o.id === offerId);
    if (!offer) return;

    const order: Order = {
      id: `order-${Date.now()}`,
      productId: offer.productId,
      productName: offer.productName,
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      farmerId: offer.farmerId,
      farmerName: offer.farmerName,
      quantity: offer.quantity,
      unit: offer.unit,
      totalPrice: offer.offeredPrice * offer.quantity,
      status: 'placed',
      deliveryAddress: 'To be confirmed',
      placedAt: new Date().toISOString(),
    };

    try {
      dispatch({ type: 'ACCEPT_OFFER', offerId, order });

      dispatch({
        type: 'ADD_NOTIFICATION',
        notification: {
          id: `notif-${Date.now()}`,
          userId: offer.buyerId,
          type: 'offer',
          title: 'Offer Accepted!',
          message: `${state.currentUser.name} accepted your offer for ${offer.productName}`,
          read: false,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }

  };

  const handleReject = (offerId: string) => {
    const offer = state.offers.find(o => o.id === offerId);
    dispatch({ type: 'UPDATE_OFFER_STATUS', id: offerId, status: 'rejected' });
    if (offer) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        notification: {
          id: `notif-${Date.now()}`,
          userId: offer.buyerId,
          type: 'offer',
          title: 'Offer Rejected',
          message: `${state.currentUser.name} rejected your offer for ${offer.productName}`,
          read: false,
          createdAt: new Date().toISOString(),
        },
      });
    }
  };

  const statusIcon = (status: OfferStatus) => {
    switch (status) {
      case 'pending': return <Clock size={14} className="text-warning-500" />;
      case 'accepted': return <CheckCircle2 size={14} className="text-success-500" />;
      case 'rejected': return <XCircle size={14} className="text-danger-500" />;
      case 'countered': return <MessageSquare size={14} className="text-info-500" />;
    }
  };

  const statusBadge = (status: OfferStatus) => {
    const map: Record<OfferStatus, string> = {
      pending: 'badge-warning',
      accepted: 'badge-success',
      rejected: 'badge-danger',
      countered: 'badge-info',
    };
    return map[status];
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {isFarmer && (
          <button
            onClick={() => setTab('received')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border-0
              ${tab === 'received' ? 'bg-primary-500 text-white shadow-md' : 'bg-surface-dim text-text-secondary hover:bg-primary-100'}`}
          >
            {t('receivedOffers')} ({receivedOffers.length})
          </button>
        )}
        <button
          onClick={() => setTab('sent')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border-0
            ${tab === 'sent' ? 'bg-primary-500 text-white shadow-md' : 'bg-surface-dim text-text-secondary hover:bg-primary-100'}`}
        >
          {t('sentOffers')} ({sentOffers.length})
        </button>
        {!isFarmer && (
          <button
            onClick={() => setTab('received')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border-0
              ${tab === 'received' ? 'bg-primary-500 text-white shadow-md' : 'bg-surface-dim text-text-secondary hover:bg-primary-100'}`}
          >
            {t('receivedOffers')} ({receivedOffers.length})
          </button>
        )}
      </div>

      {/* Offer Cards */}
      <div className="space-y-3 stagger-children">
        {currentOffers.map(offer => (
          <div key={offer.id} className="glass-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left: Product & counterparty info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl shrink-0">
                  {state.products.find(p => p.id === offer.productId)?.image || '📦'}
                </div>
                <div>
                  <div className="font-bold text-text-primary">{offer.productName}</div>
                  <div className="text-xs text-text-muted">
                    {tab === 'received'
                      ? `From: ${offer.buyerName}`
                      : `To: ${offer.farmerName}`}
                  </div>
                  {offer.message && (
                    <div className="text-xs text-text-secondary mt-1 italic">"{offer.message}"</div>
                  )}
                </div>
              </div>

              {/* Middle: Price info */}
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-xs text-text-muted">{t('originalPriceLabel')}</div>
                  <div className="font-semibold text-text-primary">₹{offer.originalPrice}/{offer.unit}</div>
                </div>
                <div className="text-xl text-text-muted">→</div>
                <div className="text-center">
                  <div className="text-xs text-text-muted">{t('offeredPrice')}</div>
                  <div className="font-bold text-primary-600">₹{offer.offeredPrice}/{offer.unit}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-text-muted">{t('quantity')}</div>
                  <div className="font-semibold text-text-primary">{offer.quantity} {offer.unit}</div>
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="flex items-center gap-3">
                <span className={`badge ${statusBadge(offer.status)}`}>
                  {statusIcon(offer.status)}
                  {t(offer.status)}
                </span>

                {tab === 'received' && offer.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      id={`accept-offer-${offer.id}`}
                      onClick={() => handleAccept(offer.id)}
                      className="p-2 rounded-xl bg-success-100 text-success-500 hover:bg-success-500 hover:text-white transition-colors cursor-pointer border-0"
                      title={t('accept')}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      id={`reject-offer-${offer.id}`}
                      onClick={() => handleReject(offer.id)}
                      className="p-2 rounded-xl bg-danger-100 text-danger-500 hover:bg-danger-500 hover:text-white transition-colors cursor-pointer border-0"
                      title={t('reject')}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentOffers.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-text-muted">{t('noOffers')}</p>
        </div>
      )}
    </div>
  );
}
