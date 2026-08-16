// ─── Agri Direct: Landing Page ──────────────────────────────────────

import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Users, Handshake, Truck, TrendingUp, Shield, BarChart3, Zap } from 'lucide-react';
import { useT } from '../i18n';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useT();

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white">
              <Sprout size={20} />
            </div>
            <span className="text-xl font-bold gradient-text">{t('appName')}</span>
          </div>
          <button
            id="landing-get-started"
            onClick={() => navigate('/dashboard')}
            className="btn-primary text-sm"
          >
            {t('getStarted')} <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent-200 rounded-full opacity-20 blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
            <Sprout size={16} /> SIH PS-18 — Farmer-to-Market Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6">
            {t('heroTitle').split(',')[0]}
            <span className="gradient-text block sm:inline">{t('heroTitle').includes(',') ? ', ' + t('heroTitle').split(',')[1] : ''}</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="hero-get-started"
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-base px-8 py-3"
            >
              {t('getStarted')} <ArrowRight size={18} />
            </button>
            <button
              id="hero-explore"
              onClick={() => navigate('/marketplace')}
              className="btn-secondary text-base px-8 py-3"
            >
              {t('explorePlatform')}
            </button>
          </div>
        </div>

        {/* Floating emoji decorations */}
        <div className="absolute top-40 left-[10%] text-5xl opacity-60 animate-bounce" style={{ animationDuration: '3s' }}>🌾</div>
        <div className="absolute top-60 right-[15%] text-4xl opacity-50 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🍅</div>
        <div className="absolute bottom-20 left-[20%] text-4xl opacity-40 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🥭</div>
        <div className="absolute bottom-40 right-[8%] text-5xl opacity-50 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '2s' }}>🧑‍🌾</div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <section className="py-12 bg-surface-dim border-y border-border-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-text-primary mb-8">{t('statsTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
            {[
              { value: '12,500+', label: t('statFarmers'), icon: '👨‍🌾' },
              { value: '8,200+', label: t('statBuyers'), icon: '🧑‍💼' },
              { value: '₹45 Cr+', label: t('statTransactions'), icon: '💰' },
              { value: '₹12 Cr+', label: t('statSaved'), icon: '📈' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-4">{t('howItWorks')}</h2>
          <p className="text-center text-text-secondary mb-12 max-w-xl mx-auto">Simple 4-step process to get fresh produce directly</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {[
              { step: 1, icon: <Sprout size={28} />, title: t('step1Title'), desc: t('step1Desc'), color: 'bg-primary-100 text-primary-600' },
              { step: 2, icon: <Users size={28} />, title: t('step2Title'), desc: t('step2Desc'), color: 'bg-accent-100 text-accent-600' },
              { step: 3, icon: <Handshake size={28} />, title: t('step3Title'), desc: t('step3Desc'), color: 'bg-info-100 text-info-500' },
              { step: 4, icon: <Truck size={28} />, title: t('step4Title'), desc: t('step4Desc'), color: 'bg-success-100 text-success-500' },
            ].map(item => (
              <div key={item.step} className="glass-card p-6 text-center relative">
                <div className="absolute -top-3 -left-1 w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                  {item.step}
                </div>
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Features ───────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-surface-dim">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">{t('keyFeatures')}</h2>
          <div className="grid sm:grid-cols-2 gap-6 stagger-children">
            {[
              { icon: <Shield size={24} />, title: t('feat1'), desc: t('feat1d'), gradient: 'from-primary-500 to-primary-700' },
              { icon: <Zap size={24} />, title: t('feat2'), desc: t('feat2d'), gradient: 'from-accent-500 to-accent-700' },
              { icon: <BarChart3 size={24} />, title: t('feat3'), desc: t('feat3d'), gradient: 'from-info-500 to-primary-600' },
              { icon: <TrendingUp size={24} />, title: t('feat4'), desc: t('feat4d'), gradient: 'from-success-500 to-primary-600' },
            ].map(feat => (
              <div key={feat.title} className="glass-card p-6 flex gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} text-white flex items-center justify-center shrink-0`}>
                  {feat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">{feat.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="py-8 px-4 border-t border-border-light">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sprout size={18} className="text-primary-500" />
            <span className="font-bold gradient-text">{t('appName')}</span>
          </div>
          <p className="text-sm text-text-muted">
            Smart India Hackathon — PS-18 | Farmer-to-Market Direct Selling Platform
          </p>
          <p className="text-xs text-text-muted mt-1">© 2026 Agri Direct. Built with ❤️ for Indian Farmers.</p>
        </div>
      </footer>
    </div>
  );
}
