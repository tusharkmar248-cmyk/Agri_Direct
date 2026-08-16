// ─── Agri Direct: Product Detail + Smart Price + Make Offer ─────────

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Star, Leaf, TrendingUp, Send, Zap } from 'lucide-react';
import { useStore } from '../store';
import { useT } from '../i18n';
import type { Offer } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const { t } = useT();

  const product = state.products.find(p => p.id === id);
  const farmer = state.users.find(u => u.id === product?.farmerId);

  const [offerPrice, setOfferPrice] = useState('');
  const [offerQty, setOfferQty] = useState('');
  const [offerMsg, setOfferMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!product) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="text-5xl mb-3">❌</div>
        <p className="text-text-muted">Product not found</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-4">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  // Smart price recommendation: market average ± variance
  const marketMatch = state.marketPrices.find(m => m.commodity === product.name);
  const recommendedPrice = marketMatch
    ? Math.round(marketMatch.avgPrice * 0.95)
    : Math.round(product.price * 0.9);
  const marketAvg = marketMatch?.avgPrice ?? product.price;

  const handleSubmitOffer = () => {
    if (!offerPrice || !offerQty) return;

    const offer: Offer = {
      id: `offer-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      buyerId: state.currentUser.id,
      buyerName: state.currentUser.name,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      offeredPrice: Number(offerPrice),
      originalPrice: product.price,
      quantity: Number(offerQty),
      unit: product.unit,
      status: 'pending',
      message: offerMsg,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_OFFER', offer });
    dispatch({
      type: 'ADD_NOTIFICATION',
      notification: {
        id: `notif-${Date.now()}`,
        userId: product.farmerId,
        type: 'offer',
        title: 'New Offer Received',
        message: `${state.currentUser.name} offered ₹${offerPrice}/${product.unit} for your ${product.name}`,
        read: false,
        createdAt: new Date().toISOString(),
      },
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn-secondary text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Product Info ─────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Hero card */}
          <div className="glass-card overflow-hidden">
            <div className="h-48 sm:h-64 bg-gradient-to-br from-primary-100 to-accent-50 flex items-center justify-center">
              <span className="text-[120px] sm:text-[160px] drop-shadow-lg">{product.image}</span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-extrabold text-text-primary">{product.name}</h1>
                  <span className="badge badge-primary text-xs mt-1">{t(product.category)}</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-primary-600">₹{product.price}</div>
                  <div className="text-sm text-text-muted">{t('perUnit')} {product.unit}</div>
                </div>
              </div>

              {product.organic && (
                <span className="badge badge-success text-xs mb-3 inline-flex">
                  <Leaf size={12} /> {t('organic')}
                </span>
              )}

              <p className="text-text-secondary text-sm leading-relaxed mt-3">{product.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-border-light">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary-500" />
                  <div>
                    <div className="text-xs text-text-muted">{t('location')}</div>
                    <div className="text-sm font-medium text-text-primary">{product.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-accent-500" />
                  <div>
                    <div className="text-xs text-text-muted">{t('harvestedOn')}</div>
                    <div className="text-sm font-medium text-text-primary">{product.harvestDate}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted">{t('availableQty')}</div>
                  <div className="text-sm font-bold text-text-primary">{product.quantity} {product.unit}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Price Recommendation */}
          <div className="glass-card p-5 border-l-4 border-accent-400">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-accent-500" />
              <h3 className="font-bold text-text-primary">{t('smartRecommendation')}</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-xl bg-surface-dim">
                <div className="text-xs text-text-muted mb-1">{t('price')}</div>
                <div className="text-lg font-bold text-text-primary">₹{product.price}</div>
                <div className="text-xs text-text-muted">{t('perUnit')} {product.unit}</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-primary-50">
                <div className="text-xs text-text-muted mb-1">{t('marketAvg')}</div>
                <div className="text-lg font-bold text-primary-600">₹{marketAvg}</div>
                <div className="text-xs text-text-muted">{t('perUnit')} {product.unit}</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-accent-50">
                <div className="text-xs text-text-muted mb-1">{t('recommendedPrice')}</div>
                <div className="text-lg font-bold text-accent-600">₹{recommendedPrice}</div>
                <div className="text-xs text-text-muted">{t('perUnit')} {product.unit}</div>
              </div>
            </div>
            {marketMatch && (
              <div className="flex items-center gap-1 mt-3 text-xs text-text-muted">
                <TrendingUp size={12} />
                Based on {marketMatch.mandi} mandi data · Trend: {marketMatch.trend === 'up' ? '📈 Rising' : marketMatch.trend === 'down' ? '📉 Falling' : '➡️ Stable'}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Farmer Info + Offer Form ────────── */}
        <div className="space-y-4">
          {/* Farmer card */}
          {farmer && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-text-primary mb-3">{t('farmerInfo')}</h3>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{farmer.avatar}</span>
                <div>
                  <div className="font-semibold text-text-primary">{farmer.name}</div>
                  <div className="text-xs text-text-muted">{farmer.location}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Rating</span>
                  <span className="flex items-center gap-1 text-accent-500 font-semibold">
                    <Star size={14} /> {farmer.rating}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Phone</span>
                  <span className="text-text-primary">{farmer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Member since</span>
                  <span className="text-text-primary">{farmer.joinedDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* Make Offer */}
          {state.currentUser.role === 'buyer' && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-text-primary mb-3">{t('makeOffer')}</h3>
              {submitted ? (
                <div className="text-center py-6 animate-fade-in-up">
                  <div className="text-5xl mb-2">🎉</div>
                  <div className="font-bold text-primary-600 mb-1">Offer Submitted!</div>
                  <p className="text-sm text-text-muted">The farmer will review your offer.</p>
                  <button onClick={() => navigate('/offers')} className="btn-primary mt-4 text-sm">
                    {t('viewOffers')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">{t('offerPrice')} (₹/{product.unit})</label>
                    <input
                      id="offer-price-input"
                      className="input"
                      type="number"
                      value={offerPrice}
                      onChange={e => setOfferPrice(e.target.value)}
                      placeholder={`Recommended: ₹${recommendedPrice}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">{t('quantity')} ({product.unit})</label>
                    <input
                      id="offer-qty-input"
                      className="input"
                      type="number"
                      value={offerQty}
                      onChange={e => setOfferQty(e.target.value)}
                      placeholder={`Max: ${product.quantity}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">{t('offerMessage')}</label>
                    <textarea
                      className="input"
                      value={offerMsg}
                      onChange={e => setOfferMsg(e.target.value)}
                      rows={2}
                      placeholder="Any special requirements..."
                    />
                  </div>
                  <button
                    id="submit-offer-btn"
                    onClick={handleSubmitOffer}
                    className="btn-primary w-full justify-center"
                    disabled={!offerPrice || !offerQty}
                  >
                    <Send size={16} /> {t('submitOffer')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
