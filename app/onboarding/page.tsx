'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, UserRole } from '@/lib/store';
import {
  Sprout,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Wallet,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Landmark,
  User,
  ChevronRight,
  Info
} from 'lucide-react';

const NET_WORTH_RANGES = [
  { id: 'below_1l', label: 'Below ₹1 Lakh', desc: 'Micro or marginal farmer' },
  { id: '1_5l', label: '₹1–5 Lakh', desc: 'Smallholder farming enterprise' },
  { id: '5_10l', label: '₹5–10 Lakh', desc: 'Medium operational holding' },
  { id: '10_25l', label: '₹10–25 Lakh', desc: 'Progressive commercial holding' },
  { id: '25_50l', label: '₹25–50 Lakh', desc: 'High-yield mechanized farm' },
  { id: '50l_1cr', label: '₹50 Lakh–₹1 Crore', desc: 'Agri-business & large holding' },
  { id: 'above_1cr', label: 'Above ₹1 Crore', desc: 'Enterprise / Corporate agriculture' },
  { id: 'prefer_not', label: 'Prefer not to say', desc: 'Keep financial metrics private' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    userProfile,
    currentRole,
    completeOnboarding,
    loadActiveSession,
  } = useAppStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [nameError, setNameError] = useState('');
  const [selectedRange, setSelectedRange] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If not authenticated in memory, try restoring active session from storage
    if (!isAuthenticated) {
      const restored = loadActiveSession();
      if (!restored) {
        router.replace('/auth');
        return;
      }
    }
  }, [isAuthenticated, loadActiveSession, router]);

  // Pre-fill name if userProfile already has one from registration
  useEffect(() => {
    if (userProfile?.name && userProfile.name.trim().toLowerCase() !== 'guest') {
      setFullName(userProfile.name);
    }
  }, [userProfile]);

  // Step 1: Name validation & proceed
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    const trimmed = fullName.trim();

    if (!trimmed) {
      setNameError('Please enter your full name to set up your personal farmer profile.');
      return;
    }
    if (trimmed.toLowerCase() === 'guest') {
      setNameError('Please enter your actual name instead of "Guest".');
      return;
    }
    if (trimmed.length < 2) {
      setNameError('Name must be at least 2 characters long.');
      return;
    }

    setStep(2);
  };

  // Step 2: Net Worth save & continue
  const handleNetWorthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAndFinish(false);
  };

  // Skip Net Worth
  const handleSkipNetWorth = () => {
    saveAndFinish(true);
  };

  const saveAndFinish = (skipped: boolean) => {
    setIsSubmitting(true);

    let finalNetWorth = 'Not provided';
    let rangeLabel: string | undefined = undefined;
    let amountVal: number | undefined = undefined;

    if (!skipped) {
      if (customAmount.trim()) {
        const cleanDigits = customAmount.replace(/[^0-9]/g, '');
        if (cleanDigits) {
          amountVal = Number(cleanDigits);
          if (amountVal >= 10000000) {
            finalNetWorth = `₹${(amountVal / 10000000).toFixed(2).replace(/\.00$/, '')} Crore`;
          } else if (amountVal >= 100000) {
            finalNetWorth = `₹${(amountVal / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
          } else {
            finalNetWorth = `₹${amountVal.toLocaleString('en-IN')}`;
          }
        }
      } else if (selectedRange) {
        const matched = NET_WORTH_RANGES.find((r) => r.id === selectedRange);
        if (matched) {
          rangeLabel = matched.label;
          finalNetWorth = matched.id === 'prefer_not' ? 'Not provided' : matched.label;
        }
      }
    }

    completeOnboarding(fullName.trim(), finalNetWorth, rangeLabel, amountVal);
    setIsSubmitting(false);
    setStep(3);
  };

  const handleEnterDashboard = () => {
    router.push('/dashboard');
  };

  if (!mounted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF5E8] border border-[#B7DDB2] flex items-center justify-center text-2xl animate-bounce">
            🌱
          </div>
          <span className="text-xs text-[#2E7D4F] font-semibold tracking-wide">
            Loading KisanSetu AI...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Ambient warm meadow glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-amber-200/25 blur-[130px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-200/25 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[#2E7D4F] mb-2">
            <span className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5" /> Farmer Profile Setup
            </span>
            <span className="text-[#6B8771]">Step {step} of 3</span>
          </div>
          <div className="h-1.5 w-full bg-[#DCE8D8] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2E7D4F] to-[#4CAF70] transition-all duration-500 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* ── STEP 1: NAME HANDLING ─────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#DCE8D8] shadow-xl shadow-[#1C3A27]/5 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EAF5E8] border border-[#B7DDB2] text-3xl mb-1 shadow-sm">
                🌱
              </div>
              <div className="text-[11px] uppercase tracking-widest text-[#2E7D4F] font-bold">
                KisanSetu AI
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C3A27] tracking-tight">
                Welcome, Farmer 👋
              </h1>
              <p className="text-xs sm:text-sm text-[#55735B] max-w-md mx-auto leading-relaxed">
                Let&apos;s personalize your KisanSetu experience and set up your authentic farm profile.
              </p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#2B4B34] mb-2">
                  What should we call you? <span className="text-[#2E7D4F]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8AA890]">
                    <User className="w-4 h-4 text-[#2E7D4F]" />
                  </div>
                  <input
                    id="onboarding-fullname-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="Enter your full name (e.g. Kapil Panchariya)"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-[#FAFDF9] border border-[#D0E2CE] focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 rounded-xl text-[#1C3A27] text-sm placeholder:text-[#8AA890] transition-all outline-none"
                  />
                </div>
                {nameError && (
                  <div className="flex items-center gap-1.5 text-[#9B2C2C] text-xs mt-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{nameError}</span>
                  </div>
                )}
                <p className="text-[11px] text-[#6B8771] mt-2">
                  This will be displayed across your Farmer Console, mandi trading desk, and farm ledger.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="onboarding-continue-name-btn"
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#2E7D4F] hover:bg-[#256841] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#2E7D4F]/20 hover:shadow-lg hover:shadow-[#2E7D4F]/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 2: SENSITIVE NET WORTH ONBOARDING ─────────────────── */}
        {step === 2 && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#DCE8D8] shadow-xl shadow-[#1C3A27]/5 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FEF6E4] border border-[#F5DC9A] text-3xl mb-1 shadow-sm">
                🌾
              </div>
              <div className="text-[11px] uppercase tracking-widest text-[#B47818] font-bold">
                Financial Snapshot
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C3A27] tracking-tight">
                Tell us a little about your financial profile
              </h2>
              <p className="text-xs sm:text-sm text-[#55735B] max-w-md mx-auto leading-relaxed">
                What is your approximate net worth?
              </p>
            </div>

            {/* Privacy Transparency Notice */}
            <div className="p-3.5 rounded-2xl bg-[#EAF5E8] border border-[#B7DDB2] flex items-start gap-3 text-left">
              <Lock className="w-4 h-4 text-[#2E7D4F] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#325239] leading-relaxed">
                <strong className="text-[#1C3A27] font-semibold">100% Private Financial Data:</strong>{' '}
                Your net worth helps KisanSetu AI personalize financial insights, profitability analysis, and farming recommendations. You can skip this step or update it anytime in profile settings.
              </div>
            </div>

            <form onSubmit={handleNetWorthSubmit} className="space-y-5">
              {/* Range Radio Choices */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#2B4B34]">
                  Select an approximate range:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {NET_WORTH_RANGES.map((range) => {
                    const isSelected = selectedRange === range.id;
                    return (
                      <button
                        key={range.id}
                        type="button"
                        id={`onboarding-range-${range.id}`}
                        onClick={() => {
                          setSelectedRange(range.id);
                          setCustomAmount('');
                        }}
                        className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#EAF5E8] border-2 border-[#2E7D4F] text-[#1C3A27] shadow-xs'
                            : 'bg-[#F8FAF7] border-[#DCE8D8] text-[#1C3A27] hover:bg-[#EEF6EB] hover:border-[#2E7D4F]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C3A27]">{range.label}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#2E7D4F] bg-[#2E7D4F]'
                                : 'border-[#A5BFA9]'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6B8771] mt-1">{range.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Or custom exact amount */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-[#2B4B34] mb-1.5">
                  Or enter specific amount (optional):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2E7D4F] font-bold">
                    ₹
                  </div>
                  <input
                    id="onboarding-custom-networth-input"
                    type="text"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (e.target.value) setSelectedRange('');
                    }}
                    placeholder="e.g. 12,50,000"
                    className="w-full pl-8 pr-4 py-2.5 bg-[#FAFDF9] border border-[#D0E2CE] focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 rounded-xl text-[#1C3A27] text-xs placeholder:text-[#8AA890] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="onboarding-save-networth-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#2E7D4F] hover:bg-[#256841] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#2E7D4F]/20 transition-all cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Save &amp; Continue</span>
                </button>

                <button
                  id="onboarding-skip-networth-btn"
                  type="button"
                  onClick={handleSkipNetWorth}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#F0F5EE] hover:bg-[#E4EDE1] border border-[#DCE8D8] text-[#3E5C46] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  Skip for now
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3: CELEBRATION & LAUNCH ──────────────────────────── */}
        {step === 3 && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#DCE8D8] shadow-xl shadow-[#1C3A27]/5 space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#EAF5E8] border border-[#B7DDB2] text-4xl mb-1 shadow-sm animate-pulse">
              🌱
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C3A27] tracking-tight">
                Your KisanSetu farm is ready 🌱
              </h2>
              <p className="text-xs sm:text-sm text-[#55735B]">
                Welcome to your AI-powered smart agriculture ecosystem.
              </p>
            </div>

            {/* Personalized Profile Card Preview */}
            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DCE8D8] text-left space-y-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2E7D4F] to-[#4CAF70] flex items-center justify-center text-2xl shadow-sm text-white">
                  {userProfile.avatar || '👨‍🌾'}
                </div>
                <div>
                  <div className="text-base font-black text-[#1C3A27] flex items-center gap-1.5">
                    {userProfile.name}
                    <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
                  </div>
                  <div className="text-xs text-[#2E7D4F] font-semibold capitalize">
                    {currentRole} Console
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#DCE8D8] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#6B8771] block">Registered Email</span>
                  <span className="font-semibold text-[#1C3A27] truncate block">
                    {userProfile.email}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B8771] block">Net Worth Profile</span>
                  <span className="font-bold text-[#2E7D4F] truncate block">
                    {userProfile.netWorth || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            <button
              id="onboarding-enter-dashboard-btn"
              onClick={handleEnterDashboard}
              className="w-full py-3.5 px-6 rounded-xl bg-[#2E7D4F] hover:bg-[#256841] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2E7D4F]/25 hover:scale-[1.01] transition-all cursor-pointer"
            >
              <span>Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
