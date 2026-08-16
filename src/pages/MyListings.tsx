// ─── Agri Direct: My Listings (Farmer Crop Management) ──────────────

import { useState } from 'react';
import { Plus, Edit3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useStore } from '../store';
import { useT } from '../i18n';
import type { Product, ProductCategory, ProductUnit } from '../types';
import { cropEmoji } from '../demoData';

const categories: ProductCategory[] = ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'oilseeds', 'flowers'];
const units: ProductUnit[] = ['kg', 'quintal', 'ton', 'dozen', 'litre', 'piece'];

export default function MyListings() {
  const { state, dispatch } = useStore();
  const { t } = useT();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const myProducts = state.products.filter(p => p.farmerId === state.currentUser.id);

  const [form, setForm] = useState({
    name: '', category: 'vegetables' as ProductCategory, price: '', unit: 'kg' as ProductUnit,
    quantity: '', location: state.currentUser.location, description: '', harvestDate: '', organic: false,
  });

  const resetForm = () => {
    setForm({ name: '', category: 'vegetables', price: '', unit: 'kg', quantity: '', location: state.currentUser.location, description: '', harvestDate: '', organic: false });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name, category: p.category, price: p.price.toString(), unit: p.unit,
      quantity: p.quantity.toString(), location: p.location, description: p.description,
      harvestDate: p.harvestDate, organic: p.organic,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.quantity) return;

    const product: Product = {
      id: editId || `prod-${Date.now()}`,
      farmerId: state.currentUser.id,
      farmerName: state.currentUser.name,
      name: form.name,
      nameHi: form.name,
      nameMr: form.name,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      unit: form.unit,
      quantity: Number(form.quantity),
      location: form.location,
      harvestDate: form.harvestDate,
      image: cropEmoji[form.name] || '🌱',
      organic: form.organic,
      active: true,
      createdAt: editId ? state.products.find(p => p.id === editId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    };

    if (editId) {
      dispatch({ type: 'UPDATE_PRODUCT', product });
    } else {
      dispatch({ type: 'ADD_PRODUCT', product });
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">{t('myListings')}</h2>
        <button
          id="add-listing-btn"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn-primary"
        >
          <Plus size={18} /> {t('createListing')}
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="glass-card p-6 animate-fade-in-up">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            {editId ? t('editListing') : t('createListing')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('productName')}</label>
              <input
                className="input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tomato, Wheat..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('category')}</label>
              <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ProductCategory })}>
                {categories.map(c => <option key={c} value={c}>{t(c)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('price')} (₹)</label>
              <input className="input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('unit')}</label>
              <select className="input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value as ProductUnit })}>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('quantity')}</label>
              <input className="input" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('location')}</label>
              <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('harvestDate')}</label>
              <input className="input" type="date" value={form.harvestDate} onChange={e => setForm({ ...form, harvestDate: e.target.value })} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.organic} onChange={e => setForm({ ...form, organic: e.target.checked })} className="w-4 h-4 accent-primary-500" />
                <span className="text-sm font-medium text-text-secondary">🌿 {t('organic')}</span>
              </label>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-text-secondary mb-1">{t('description')}</label>
              <textarea className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="btn-primary">{t('save')}</button>
            <button onClick={resetForm} className="btn-secondary">{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {myProducts.map(product => (
          <div key={product.id} className={`glass-card p-5 ${!product.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{product.image}</span>
                <div>
                  <div className="font-bold text-text-primary">{product.name}</div>
                  <div className="text-xs text-text-muted">{t(product.category)}</div>
                </div>
              </div>
              <span className={`badge ${product.active ? 'badge-success' : 'badge-danger'} text-[11px]`}>
                {product.active ? t('active') : t('inactive')}
              </span>
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t('price')}</span>
                <span className="font-bold text-primary-600">₹{product.price}/{product.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t('quantity')}</span>
                <span className="text-text-primary">{product.quantity} {product.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t('location')}</span>
                <span className="text-text-primary">{product.location}</span>
              </div>
            </div>
            {product.organic && (
              <span className="badge badge-success text-[11px] mb-3">🌿 {t('organic')}</span>
            )}
            <div className="flex gap-2 pt-3 border-t border-border-light">
              <button onClick={() => handleEdit(product)} className="btn-secondary text-xs py-1.5 px-3 flex-1">
                <Edit3 size={14} /> {t('edit')}
              </button>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_PRODUCT', id: product.id })}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                {product.active ? <ToggleRight size={14} className="text-success-500" /> : <ToggleLeft size={14} />}
              </button>
              <button
                onClick={() => dispatch({ type: 'DELETE_PRODUCT', id: product.id })}
                className="btn-danger text-xs py-1.5 px-3"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {myProducts.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-3">🌱</div>
          <p className="text-text-muted">{t('noProducts')}</p>
        </div>
      )}
    </div>
  );
}
