// ─── Agri Direct: Marketplace (Buyer Browse) ───────────────────────

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Leaf } from 'lucide-react';
import { useStore } from '../store';
import { useT } from '../i18n';
import type { ProductCategory } from '../types';

const categories: (ProductCategory | 'all')[] = ['all', 'vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'oilseeds', 'flowers'];

type SortKey = 'newest' | 'priceLow' | 'priceHigh';

export default function Marketplace() {
  const { state } = useStore();
  const { t } = useT();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let items = state.products.filter(p => p.active);

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (category !== 'all') {
      items = items.filter(p => p.category === category);
    }

    switch (sort) {
      case 'priceLow': items = [...items].sort((a, b) => a.price - b.price); break;
      case 'priceHigh': items = [...items].sort((a, b) => b.price - a.price); break;
      case 'newest': items = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }

    return items;
  }, [state.products, search, category, sort]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            id="marketplace-search"
            className="input pl-10"
            placeholder={t('searchProducts')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary sm:w-auto"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass-card p-4 flex flex-wrap gap-3 animate-fade-in-up">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">{t('category')}</label>
            <select className="input text-sm py-2" value={category} onChange={e => setCategory(e.target.value as ProductCategory | 'all')}>
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? t('allCategories') : t(c)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">{t('sortBy')}</label>
            <select className="input text-sm py-2" value={sort} onChange={e => setSort(e.target.value as SortKey)}>
              <option value="newest">{t('newest')}</option>
              <option value="priceLow">{t('priceLowHigh')}</option>
              <option value="priceHigh">{t('priceHighLow')}</option>
            </select>
          </div>
        </div>
      )}

      {/* Category pills (always visible) */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer border-0
              ${c === category
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-surface-dim text-text-secondary hover:bg-primary-100 hover:text-primary-700'
              }`}
          >
            {c === 'all' ? t('allCategories') : t(c)}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {filtered.map(product => (
          <button
            key={product.id}
            id={`product-card-${product.id}`}
            onClick={() => navigate(`/product/${product.id}`)}
            className="glass-card p-5 text-left cursor-pointer border-0 group"
          >
            {/* Image area */}
            <div className="w-full h-32 rounded-xl bg-surface-dim flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <span className="text-6xl">{product.image}</span>
            </div>

            {/* Info */}
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-text-primary">{product.name}</h3>
              {product.organic && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-success-500 bg-success-100 px-1.5 py-0.5 rounded-full">
                  <Leaf size={10} /> {t('organic')}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-extrabold text-primary-600">₹{product.price}</span>
                <span className="text-xs text-text-muted">/{product.unit}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">{product.farmerName}</div>
                <div className="text-xs text-text-muted">{product.location}</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border-light flex justify-between items-center">
              <span className="text-xs text-text-muted">{product.quantity} {product.unit} {t('availableQty').toLowerCase()}</span>
              <span className="text-xs font-semibold text-primary-600 group-hover:text-primary-700">{t('viewDetails')} →</span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-text-muted">{t('noProducts')}</p>
        </div>
      )}
    </div>
  );
}
