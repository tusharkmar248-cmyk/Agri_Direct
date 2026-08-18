// ─── Agri Direct: Login / Register Page ─────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Phone, Mail, User, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useStore } from '../store';

type Tab = 'signin' | 'register';
type SignInStep = 'phone' | 'otp';

export default function Login() {
  const [tab, setTab] = useState<Tab>('signin');
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [step, setStep] = useState<SignInStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const navigate = useNavigate();
  const { dispatch, state } = useStore();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      const code = String(Math.floor(1000 + Math.random() * 9000));
      setSimulatedOtp(code);
      setOtp(['', '', '', '']);
      setStep('otp');
    }
  };

  const handleResendOtp = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setSimulatedOtp(code);
    setOtp(['', '', '', '']);
    (document.getElementById('otp-0') as HTMLInputElement)?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length === 4) {
      const user = state.users.find(u => u.role === 'farmer') || state.currentUser;
      dispatch({ type: 'SET_USER', user });
      navigate('/dashboard');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      (document.getElementById(`otp-${index - 1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const user = state.users.find(u => u.role === role) || state.currentUser;
    dispatch({ type: 'SET_USER', user });
    navigate('/dashboard');
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setStep('phone');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* ═══════════════════════════════════════════════════
          LEFT PANEL — Brand
      ═══════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex"
        style={{
          width: '44%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(150deg, #065f46 0%, #064e3b 50%, #022c22 100%)',
        }}
      >
        {/* Blob 1 */}
        <div style={{
          position: 'absolute', top: -100, left: -100,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(52,211,153,0.15)',
        }} />
        {/* Blob 2 */}
        <div style={{
          position: 'absolute', bottom: -80, right: -80,
          width: 380, height: 380, borderRadius: '50%',
          background: 'rgba(16,185,129,0.08)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sprout size={24} color="white" />
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
            Agri Direct
          </span>
        </div>

        {/* Tagline + Stats */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 14 }}>
              Farm Fresh,<br />
              <span style={{ color: '#6ee7b7' }}>Direct to You</span>
            </h2>
            <p style={{ color: '#a7f3d0', fontSize: 16, lineHeight: 1.7, maxWidth: 320 }}>
              Connecting farmers directly with buyers. Better prices, fresher produce, zero middlemen.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { value: '12,500+', label: 'Farmers' },
              { value: '8,200+', label: 'Buyers' },
              { value: '₹45 Cr+', label: 'Traded' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#6ee7b7', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 1, color: '#4ade80', fontSize: 12 }}>
          © 2026 Agri Direct. All rights reserved.
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          RIGHT PANEL — Form
      ═══════════════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        background: 'var(--color-surface)',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }} className="animate-fade-in-up">

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sprout size={20} color="white" />
            </div>
            <span className="gradient-text" style={{ fontSize: 20, fontWeight: 800 }}>Agri Direct</span>
          </div>

          {/* ── Heading ── */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 6 }}>
              {tab === 'signin' ? 'Welcome back 👋' : 'Create Account 🌱'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {tab === 'signin'
                ? 'Sign in with your registered mobile number'
                : 'Join thousands of farmers & buyers on Agri Direct'}
            </p>
          </div>

          {/* ── Tab switcher ── */}
          <div style={{
            display: 'flex',
            background: 'var(--color-surface-dim)',
            borderRadius: 16,
            padding: 4,
            border: '1px solid var(--color-border-light)',
            marginBottom: 28,
          }}>
            {(['signin', 'register'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 12,
                  border: tab === t ? '1px solid var(--color-border-light)' : '1px solid transparent',
                  background: tab === t ? 'var(--color-surface)' : 'transparent',
                  color: tab === t ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {t === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* ═══════════════════════════════════════
              SIGN IN
          ═══════════════════════════════════════ */}
          {tab === 'signin' && (
            <>
              {step === 'phone' ? (
                <form onSubmit={handleSendOtp}>
                  <FieldLabel label="Mobile Number *" />
                  <InputWrap icon={<Phone size={16} />}>
                    <input
                      id="signin-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="input"
                      style={{ paddingLeft: 44 }}
                      maxLength={10}
                    />
                  </InputWrap>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6, marginBottom: 24 }}>
                    We'll send a 4-digit OTP to verify your number
                  </p>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 15 }}>
                    Send OTP <ArrowRight size={17} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  {/* Mobile number row (read-only) */}
                  <FieldLabel label="Mobile Number" />
                  <div style={{ position: 'relative', marginBottom: 14 }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}>
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel" readOnly value={phone} className="input"
                      style={{ paddingLeft: 44, background: 'var(--color-surface-dim)', color: 'var(--color-text-secondary)', cursor: 'not-allowed' }}
                    />
                  </div>

                  {/* Resend button */}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '11px 0', marginBottom: 16, borderRadius: 12,
                      border: '1.5px solid var(--color-primary-300)',
                      background: 'var(--color-primary-50)', color: 'var(--color-primary-600)',
                      fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <RefreshCw size={15} /> Resend OTP Code
                  </button>

                  {/* Simulated SMS OTP display */}
                  <div style={{
                    borderRadius: 14, marginBottom: 20, padding: '16px 20px', textAlign: 'center',
                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', marginBottom: 6, textTransform: 'uppercase' }}>
                      📱 Simulated SMS OTP
                    </div>
                    <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: 12, color: 'white', lineHeight: 1 }}>
                      {simulatedOtp.split('').join(' ')}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>
                      Enter this code below (valid for 5 mins)
                    </div>
                  </div>

                  {/* 4-digit OTP boxes */}
                  <div style={{ textAlign: 'center', marginBottom: 6 }}>
                    <FieldLabel label="Enter 4-Digit OTP Code" />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 24, justifyContent: 'center' }}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        autoFocus={i === 0}
                        style={{
                          width: 48,
                          height: 48,
                          textAlign: 'center',
                          fontSize: 20,
                          fontWeight: 800,
                          borderRadius: 12,
                          border: digit
                            ? '2px solid var(--color-primary-500)'
                            : '2px solid var(--color-border)',
                          background: digit ? 'var(--color-primary-50)' : 'var(--color-surface-dim)',
                          color: digit ? 'var(--color-primary-700)' : 'var(--color-text-primary)',
                          outline: 'none',
                          transition: 'all 0.15s',
                          fontFamily: 'var(--font-sans)',
                        }}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={otp.join('').length < 4}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 15, opacity: otp.join('').length < 4 ? 0.5 : 1, cursor: otp.join('').length < 4 ? 'not-allowed' : 'pointer' }}
                  >
                    Verify & Sign In <ShieldCheck size={17} />
                  </button>
                </form>
              )}
            </>
          )}

          {/* ═══════════════════════════════════════
              REGISTER
          ═══════════════════════════════════════ */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              {/* Role */}
              <FieldLabel label="I am a *" />
              <div style={{
                display: 'flex', background: 'var(--color-surface-dim)', borderRadius: 14,
                padding: 4, border: '1px solid var(--color-border-light)', marginBottom: 20,
              }}>
                {(['farmer', 'buyer'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 10,
                      border: 'none',
                      background: role === r
                        ? r === 'farmer' ? 'var(--color-primary-500)' : 'var(--color-accent-500)'
                        : 'transparent',
                      color: role === r ? 'white' : 'var(--color-text-muted)',
                      fontWeight: 700, fontSize: 14, cursor: 'pointer',
                      transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {r === 'farmer' ? '🌾 Farmer' : '🧑‍💼 Buyer'}
                  </button>
                ))}
              </div>

              {/* Full Name */}
              <FieldLabel label="Full Name *" />
              <InputWrap icon={<User size={16} />}>
                <input id="reg-name" type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Rajesh Patil" className="input" style={{ paddingLeft: 44, marginBottom: 20 }} />
              </InputWrap>

              {/* Email */}
              <FieldLabel label="Email Address" />
              <InputWrap icon={<Mail size={16} />}>
                <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="rajesh@example.com" className="input" style={{ paddingLeft: 44, marginBottom: 20 }} />
              </InputWrap>

              {/* Mobile */}
              <FieldLabel label="Mobile Number *" />
              <InputWrap icon={<Phone size={16} />}>
                <input id="reg-phone" type="tel" required value={regPhone}
                  onChange={e => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210" className="input" style={{ paddingLeft: 44, marginBottom: 24 }} maxLength={10} />
              </InputWrap>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 15 }}>
                Register & Sign In <ArrowRight size={17} />
              </button>
            </form>
          )}

          {/* Bottom switch */}
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)', marginTop: 24 }}>
            {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchTab(tab === 'signin' ? 'register' : 'signin')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-600)', fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-sans)' }}
            >
              {tab === 'signin' ? 'Register now' : 'Sign In'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

/* ── Small helper components ── */
function FieldLabel({ label }: { label: string }) {
  return (
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
      {label}
    </label>
  );
}

function InputWrap({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', marginBottom: 0 }}>
      <div style={{
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--color-text-muted)', pointerEvents: 'none', display: 'flex', alignItems: 'center',
      }}>
        {icon}
      </div>
      {children}
    </div>
  );
}
