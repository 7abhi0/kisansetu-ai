'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sprout,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAppStore, UserRole, ROLE_PROFILES } from '@/lib/store';

/* ──────────────────────────────────────────────────────────────
   ROLE QUICK-LOGIN CARDS (demo mode only)
   Each entry has a display-only email so the user can see what
   credential they would use, but the email INPUT starts empty.
────────────────────────────────────────────────────────────── */
const DEMO_ROLES: {
  role: UserRole;
  name: string;
  title: string;
  icon: string;
  email: string;
}[] = [
  { role: 'farmer',     name: 'Sardar Gurpreet Singh',  title: 'Progressive Farmer · Punjab',     icon: '👨‍🌾', email: 'gurpreet@kisansetu.ai' },
  { role: 'buyer',      name: 'Aditi Agri Foods Ltd',   title: 'Verified Procurement Buyer',       icon: '🏢', email: 'procurement@aditiagri.in' },
  { role: 'transporter',name: 'Kisan Gati Logistics',   title: '18-Truck Reefer Fleet',            icon: '🚛', email: 'fleet@kisangati.com' },
  { role: 'expert',     name: 'Dr. Rameshwar Patil',    title: 'ICAR Senior Agri-Scientist',       icon: '🔬', email: 'dr.patil@icar.gov.in' },
  { role: 'government', name: 'Sunita Sharma IAS',      title: 'District Agri Commissioner',       icon: '🏛️', email: 'sunita.ias@agri.gov.in' },
  { role: 'admin',      name: 'KisanSetu Ops Console',  title: 'System Administrator',             icon: '⚡', email: 'admin@kisansetu.ai' },
];

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, loadActiveSession, login } = useAppStore();

  useEffect(() => {
    let authed = isAuthenticated;
    if (!authed) {
      authed = loadActiveSession();
    }
    if (authed) {
      const profile = useAppStore.getState().userProfile;
      if (profile?.profileCompleted) {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, loadActiveSession, router]);

  /* ── Tab mode ───────────────────────────────────────────── */
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  /* ── Form state — ALL start as empty strings ────────────── */
  const [email,          setEmail]         = useState('');
  const [password,       setPassword]      = useState('');
  const [name,           setName]          = useState('');
  const [phone,          setPhone]         = useState('');
  const [selectedRole,   setSelectedRole]  = useState<UserRole>('farmer');
  const [showPassword,   setShowPassword]  = useState(false);
  const [loading,        setLoading]       = useState(false);
  const [successMsg,     setSuccessMsg]    = useState('');
  const [errorMsg,       setErrorMsg]      = useState('');
  const [isDemoFill,     setIsDemoFill]    = useState(false);

  /* Keep email input ref to prevent browser autofill restoring values */
  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (emailRef.current) emailRef.current.value = '';
  }, []);

  /* ── Switch tab helper ───────────────────────────────────── */
  const switchMode = (mode: 'login' | 'register' | 'forgot') => {
    setAuthMode(mode);
    setSuccessMsg('');
    setErrorMsg('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setIsDemoFill(false);
  };

  /* ── 1-Click demo role fill (does NOT auto-login) ───────── */
  const fillDemoRole = (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setSelectedRole(role);
    setAuthMode('login');
    setSuccessMsg('');
    setErrorMsg('');
    setIsDemoFill(true);
  };

  /* ── Form submit ─────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    // Brief realistic latency
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    if (authMode === 'forgot') {
      setSuccessMsg(`Password reset link dispatched to ${email}. Check your inbox.`);
      return;
    }

    if (authMode === 'register') {
      if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        setErrorMsg('Please fill in all required fields to complete registration.');
        return;
      }
      if (selectedRole === 'expert' || selectedRole === 'government') {
        setSuccessMsg(
          `Application submitted for ${ROLE_PROFILES[selectedRole].badge}. ` +
          `An ICAR / Ministry nodal officer will verify credentials within 24 hours.`
        );
        return;
      }

      // Register new user with authentic name provided
      const result = login(email, selectedRole, name.trim(), false);
      setSuccessMsg('Registration successful! Directing to complete your farm setup…');
      setTimeout(() => {
        router.push('/onboarding');
      }, 700);
      return;
    }

    // ── Login: email is required, password is optional ──
    if (!email.trim()) {
      setErrorMsg('Please enter your email to continue.');
      return;
    }

    // Derive role from email heuristic (demo only) or selectedRole
    let role: UserRole = selectedRole || 'farmer';
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.includes('buyer') || cleanEmail.includes('procurement') || cleanEmail.includes('agri'))
      role = 'buyer';
    else if (cleanEmail.includes('truck') || cleanEmail.includes('fleet') || cleanEmail.includes('gati'))
      role = 'transporter';
    else if (cleanEmail.includes('icar') || cleanEmail.includes('dr.') || cleanEmail.includes('expert'))
      role = 'expert';
    else if (cleanEmail.includes('gov') || cleanEmail.includes('ias') || cleanEmail.includes('officer'))
      role = 'government';
    else if (cleanEmail.includes('admin') || cleanEmail.includes('ops'))
      role = 'admin';

    const isDemo = isDemoFill || DEMO_ROLES.some((d) => d.email.toLowerCase() === cleanEmail);
    const result = login(cleanEmail, role, undefined, isDemo);

    if (result.profileCompleted) {
      const activeName = useAppStore.getState().userProfile?.name;
      setSuccessMsg(`Welcome back, ${activeName}! Redirecting to your dashboard…`);
      setTimeout(() => router.push('/dashboard'), 500);
    } else {
      setSuccessMsg('Authentication successful! Setting up your personal profile…');
      setTimeout(() => router.push('/onboarding'), 500);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      {/* Ambient warm morning sunlight & meadow glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[420px] bg-amber-200/25 blur-[130px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute top-2/3 right-1/4 w-72 h-72 bg-emerald-200/25 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

        {/* ── Left: Demo Role Switcher ────────────────────────── */}
        <div className="lg:col-span-5 bg-white/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#DCE8D8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5E8] border border-[#B7DDB2] text-[#246337] text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Instant Demo Mode
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1C3A27] tracking-tight">
              1-Click Role Demo Login
            </h2>
            <p className="text-xs text-[#55735B] mt-1.5 leading-relaxed">
              Click any profile to auto-fill the email and role, then sign in manually.
            </p>

            <div className="space-y-2 mt-5">
              {DEMO_ROLES.map((item) => (
                <button
                  key={item.role}
                  id={`demo-login-${item.role}`}
                  onClick={() => fillDemoRole(item.role, item.email)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#F8FAF7] hover:bg-[#EEF6EB] border border-[#DCE8D8] hover:border-[#2E7D4F]/40 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[#1C3A27] group-hover:text-[#2E7D4F] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#6B8771]">{item.title}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#6B8771] font-semibold group-hover:text-[#2E7D4F] transition-colors">Fill</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#DCE8D8] mt-6 flex items-center gap-2 text-[11px] text-[#55735B]">
            <ShieldCheck className="w-4 h-4 text-[#2E7D4F] shrink-0" />
            <span>256-bit JWT · RBAC · Dynamic User Identity</span>
          </div>
        </div>

        {/* ── Right: Traditional Form ─────────────────────────── */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#DCE8D8] shadow-md flex flex-col justify-between">
          <div>
            {/* Tab Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F0F5EE] border border-[#DCE8D8] rounded-xl mb-6">
              {(['login', 'register', 'forgot'] as const).map((mode) => (
                <button
                  key={mode}
                  id={`tab-${mode}`}
                  type="button"
                  onClick={() => switchMode(mode)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    authMode === mode
                      ? 'bg-[#2E7D4F] text-white font-bold shadow-sm'
                      : 'text-[#55735B] hover:text-[#1C3A27] hover:bg-white/60'
                  }`}
                >
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'New Register'}
                  {mode === 'forgot' && 'Reset'}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <h1 className="text-xl font-black text-[#1C3A27] tracking-tight">
                {authMode === 'login'    && 'Sign In to Your Account'}
                {authMode === 'register' && 'Create Your AgriTech Profile'}
                {authMode === 'forgot'   && 'Reset Password'}
              </h1>
              <p className="text-xs text-[#55735B] mt-1">
                {authMode === 'login'    && 'Enter your email to load or create your personalized farmer profile.'}
                {authMode === 'register' && 'Join 140M+ Indian farmers on the intelligent living ecosystem.'}
                {authMode === 'forgot'   && 'Enter your email to receive recovery instructions.'}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-[#FDF0EE] border border-[#F5C2BC] text-[#9B2C2C] text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-[#EAF5E8] border border-[#B7DDB2] text-[#246337] text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selection (register only) */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#2B4B34] mb-1">
                    Select Your Agricultural Role
                  </label>
                  <select
                    id="auth-role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-[#FAFDF9] border border-[#D0E2CE] rounded-xl px-3 py-2.5 text-xs text-[#1C3A27] focus:outline-none focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 transition-colors"
                  >
                    <option value="farmer">👨‍🌾 Farmer (Krishi Utpadak)</option>
                    <option value="buyer">🏢 Corporate / APMC Buyer</option>
                    <option value="transporter">🚛 Logistics Transporter</option>
                    <option value="expert">🔬 ICAR / University Agri-Scientist</option>
                    <option value="government">🏛️ Government Officer</option>
                  </select>
                </div>
              )}

              {/* Full Name (register only) */}
              {authMode === 'register' && (
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-[#2B4B34] mb-1">
                    Full Name / Organisation <span className="text-[#2E7D4F]">*</span>
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kapil Panchariya"
                    autoComplete="off"
                    className="w-full bg-[#FAFDF9] border border-[#D0E2CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1C3A27] placeholder:text-[#8AA890] focus:outline-none focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 transition-colors"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="auth-email" className="block text-xs font-semibold text-[#2B4B34] mb-1">
                  Email Address <span className="text-[#2E7D4F]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8AA890] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-email"
                    ref={emailRef}
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="off"
                    className="w-full bg-[#FAFDF9] border border-[#D0E2CE] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1C3A27] placeholder:text-[#8AA890] focus:outline-none focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 transition-colors"
                  />
                </div>
              </div>

              {/* Phone (register only) */}
              {authMode === 'register' && (
                <div>
                  <label htmlFor="auth-phone" className="block text-xs font-semibold text-[#2B4B34] mb-1">
                    Mobile Number
                  </label>
                  <input
                    id="auth-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="off"
                    className="w-full bg-[#FAFDF9] border border-[#D0E2CE] rounded-xl px-3.5 py-2.5 text-xs text-[#1C3A27] placeholder:text-[#8AA890] focus:outline-none focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 transition-colors"
                  />
                </div>
              )}

              {/* Password */}
              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-password" className="text-xs font-semibold text-[#2B4B34]">
                      Password {authMode === 'login' && <span className="text-[#8AA890] font-normal">(Optional)</span>}
                    </label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-[11px] text-[#2E7D4F] font-medium hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8AA890] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required={authMode === 'register'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={authMode === 'login' ? 'Enter password (optional)' : 'Enter your password'}
                      autoComplete="new-password"
                      className="w-full bg-[#FAFDF9] border border-[#D0E2CE] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1C3A27] placeholder:text-[#8AA890] focus:outline-none focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 transition-colors"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AA890] hover:text-[#1C3A27] transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                id="auth-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#2E7D4F] hover:bg-[#256841] disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#2E7D4F]/20 hover:shadow-lg hover:shadow-[#2E7D4F]/30 transition-all mt-2 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span
                      style={{
                        display: 'inline-block',
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        animation: 'spin 0.7s linear infinite',
                      }}
                    />
                    Authenticating…
                  </span>
                ) : (
                  <>
                    <span>
                      {authMode === 'login'    && 'Continue / Login'}
                      {authMode === 'register' && 'Complete Registration'}
                      {authMode === 'forgot'   && 'Send Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <div className="pt-6 border-t border-[#DCE8D8] text-center text-xs text-[#55735B] mt-6">
            {authMode === 'login' ? (
              <span>
                No account?{' '}
                <button
                  id="switch-to-register"
                  onClick={() => switchMode('register')}
                  className="text-[#2E7D4F] font-bold hover:underline cursor-pointer"
                >
                  Register now
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  id="switch-to-login"
                  onClick={() => switchMode('login')}
                  className="text-[#2E7D4F] font-bold hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
