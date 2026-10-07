'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { 
  useAppStore, 
  UserRole, 
  ROLE_PROFILES, 
  Farm, 
  Crop, 
  ExpenseRecord, 
  IncomeRecord 
} from '@/lib/store';
import { translations } from '@/lib/i18n';
import { 
  MANDI_PRICES, 
  PRICE_FORECAST_DATA, 
  MARKETPLACE_LISTINGS, 
  FREIGHT_BOOKINGS, 
  FORUM_POSTS, 
  GOV_SCHEMES 
} from '@/lib/data';
import PriceForecastChart from '@/components/PriceForecastChart';
import LeafDiseaseScanner from '@/components/LeafDiseaseScanner';
import MandiMapViewer from '@/components/MandiMapViewer';
import KisanGptChat from '@/components/KisanGptChat';
import ProfileEditModal from '@/components/ProfileEditModal';
import { 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  DollarSign, 
  Wallet, 
  ArrowUpRight, 
  ArrowRight,
  ArrowDownRight, 
  Plus, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Truck, 
  MessageSquare, 
  ShieldCheck, 
  Fuel, 
  Sparkles, 
  Microscope, 
  Landmark, 
  Sliders, 
  Calendar,
  X,
  Send,
  Eye,
  Building2,
  Navigation,
  Activity,
  Lock
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    currentRole, 
    setRole, 
    userProfile, 
    language, 
    farms, 
    crops, 
    expenses, 
    incomes, 
    addExpense, 
    addCrop, 
    addFarm 
  } = useAppStore();

  const t = translations[language] || translations.en;

  // Active subtab for Farmer dashboard
  const [farmerTab, setFarmerTab] = useState<'overview' | 'farms' | 'forecast' | 'advisor' | 'mandi' | 'ledger'>('overview');

  // Modal states
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [selectedListingForBid, setSelectedListingForBid] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [simulatedChatMessages, setSimulatedChatMessages] = useState<string[]>([
    `Buyer: Hello ${userProfile?.name?.split(' ')[0] || 'Farmer'} ji! We need 200 Quintals of DBW-187 Sharbati wheat for our Ludhiana milling unit.`,
    'Farmer: Sat Sri Akal! Quality is Grade-A export certified with 12% moisture. Price is ₹2,580/Qtl.'
  ]);

  useEffect(() => {
    const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : 'Farmer';
    setSimulatedChatMessages([
      `Buyer: Hello ${firstName} ji! We need 200 Quintals of DBW-187 Sharbati wheat for our Ludhiana milling unit.`,
      'Farmer: Sat Sri Akal! Quality is Grade-A export certified with 12% moisture. Price is ₹2,580/Qtl.'
    ]);
  }, [userProfile?.name]);

  // Add Expense form state
  const [expCategory, setExpCategory] = useState<'Seeds' | 'Fertilizer' | 'Labour' | 'Fuel' | 'Water' | 'Electricity' | 'Pesticide' | 'Others'>('Fertilizer');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState('');

  // Add Crop form state
  const [newCropName, setNewCropName] = useState('');
  const [newCropVariety, setNewCropVariety] = useState('');
  const [newCropYield, setNewCropYield] = useState('');

  // Add Farm form state
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmAcres, setNewFarmAcres] = useState('10.0');
  const [newFarmSoil, setNewFarmSoil] = useState<'Alluvial' | 'Black Cotton' | 'Red Sandy' | 'Clayey Loam'>('Alluvial');
  const [newFarmWater, setNewFarmWater] = useState<'Tube Well' | 'Canal Irrigation' | 'Farm Pond' | 'River Drip'>('Tube Well');
  const [newFarmIrrigation, setNewFarmIrrigation] = useState<'Drip System' | 'Sprinkler' | 'Flood Furrow'>('Drip System');

  // Financial Calculations
  const totalExpenseSum = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncomeSum = incomes.reduce((sum, i) => sum + i.totalAmount, 0);
  const netFarmProfit = totalIncomeSum - totalExpenseSum;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription || !expAmount) return;

    addExpense({
      id: `exp_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: expCategory,
      description: expDescription,
      amount: Number(expAmount),
    });

    setExpDescription('');
    setExpAmount('');
    setShowAddExpenseModal(false);
  };

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName) return;

    addCrop({
      id: `crop_${Date.now()}`,
      farmId: farms[0]?.id || 'farm_01',
      name: newCropName,
      variety: newCropVariety || 'High Yield Hybrid',
      sowingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '2026-05-15',
      growthStage: 'Germination',
      growthProgressPercent: 15,
      expectedYieldQuintals: Number(newCropYield) || 120,
      healthScore: 98,
      status: 'Healthy',
    });

    setNewCropName('');
    setNewCropVariety('');
    setNewCropYield('');
    setShowAddCropModal(false);
  };

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName.trim()) return;

    addFarm({
      id: `farm_${Date.now()}`,
      name: newFarmName.trim(),
      areaAcres: Number(newFarmAcres) || 10.0,
      soilType: newFarmSoil,
      waterSource: newFarmWater,
      irrigationType: newFarmIrrigation,
      coordinates: [30.9010 + (Math.random() - 0.5) * 0.1, 75.8573 + (Math.random() - 0.5) * 0.1],
      cropsActive: 1,
    });

    setNewFarmName('');
    setNewFarmAcres('10.0');
    setShowAddFarmModal(false);
  };

  const handleSendNegotiationChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setSimulatedChatMessages(prev => [...prev, `Buyer: ${chatInput}`]);
    const inputMsg = chatInput;
    setChatInput('');

    setTimeout(() => {
      setSimulatedChatMessages(prev => [
        ...prev, 
        `Farmer: Received your counter of ₹${bidAmount || '2,550'}/Qtl for "${inputMsg}". We can close at ₹2,560 with delivery at Khanna yard tomorrow morning.`
      ]);
    }, 900);
  };

  const exportLedgerCSV = () => {
    const csvRows = [
      ['Date', 'Category', 'Description', 'Amount (INR)'],
      ...expenses.map(e => [e.date, e.category, `"${e.description}"`, e.amount]),
      [],
      ['Date', 'Crop', 'Quantity (Qtl)', 'Rate/Qtl', 'Total Amount (INR)', 'Buyer'],
      ...incomes.map(i => [i.date, i.cropName, i.quantityQuintals, i.ratePerQuintal, i.totalAmount, `"${i.buyerName}"`])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KisanSetu_Agri_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── PREMIUM FARMER IDENTITY CARD ─────────────────────────────── */}
      <div className="relative glass-panel rounded-3xl p-5 border border-[#DCE8D8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden">
        {/* Subtle nature ambient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E7F3E5]/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-40 h-32 bg-[#4CAF70]/8 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-2 right-4 text-5xl opacity-8 select-none pointer-events-none">🌾</div>

        {/* Farmer Avatar & Identity */}
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E7F3E5] to-[#D4EDD0] border border-[#DCE8D8] text-3xl flex items-center justify-center shadow-md shadow-[#183326]/8">
              {userProfile.avatar}
            </div>
            {/* Live active status */}
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF70] opacity-50"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#2E7D4F] border-2 border-white"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-[#183326] tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>{userProfile.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E7F3E5] text-[#2E7D4F] border border-[#DCE8D8] flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3 h-3" /> {userProfile.badge}
              </span>
            </div>
            <p className="text-xs text-[#607568] mt-0.5">
              📍 {userProfile.location}
              {' · '}
              <span className="capitalize font-semibold text-[#2E7D4F]">{t[currentRole] || currentRole} Console</span>
            </p>

            {/* Net Worth badge & Edit Profile */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <div 
                id="dashboard-networth-badge"
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F6EBC8] border border-[#D7A83E]/30 text-xs shadow-sm"
              >
                <Wallet className="w-3.5 h-3.5 text-[#D7A83E] shrink-0" />
                <span className="text-[10px] text-[#607568] font-semibold">Net Worth:</span>
                <span className="font-bold text-[#183326]">
                  {userProfile.netWorth || 'Not provided'}
                </span>
                <span title="100% Private" className="flex items-center">
                  <Lock className="w-2.5 h-2.5 text-[#9BB5A0] ml-0.5" />
                </span>
              </div>

              <button
                id="dashboard-edit-profile-btn"
                onClick={() => setShowProfileEditModal(true)}
                className="px-3 py-1 rounded-xl bg-white hover:bg-[#F3F8F1] border border-[#DCE8D8] hover:border-[#2E7D4F]/30 text-[11px] font-semibold text-[#607568] hover:text-[#2E7D4F] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                title="Edit personal profile and financial details"
              >
                <Sliders className="w-3 h-3 text-[#2E7D4F]" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Segmented Role Switcher */}
        <div className="relative flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto p-1.5 bg-[#F3F8F1] rounded-2xl border border-[#DCE8D8]">
          {[
            { role: 'farmer', label: 'Farmer', icon: '👨‍🌾' },
            { role: 'buyer', label: 'Buyer', icon: '🏢' },
            { role: 'transporter', label: 'Transport', icon: '🚛' },
            { role: 'expert', label: 'Scientist', icon: '🔬' },
            { role: 'government', label: 'Govt', icon: '🏛️' },
            { role: 'admin', label: 'Admin', icon: '⚡' },
          ].map((r) => (
            <button
              key={r.role}
              onClick={() => setRole(r.role as UserRole)}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                currentRole === r.role
                  ? 'bg-[#2E7D4F] text-white shadow-md shadow-[#2E7D4F]/25'
                  : 'text-[#607568] hover:text-[#183326] hover:bg-white'
              }`}
            >
              <span>{r.icon}</span>
              <span className="hidden sm:inline">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FARMER DASHBOARD                                                       */}
      {/* ========================================================================= */}
      {currentRole === 'farmer' && (
        <div className="space-y-6">

          {/* ── METRIC CARDS ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Weather Card */}
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] relative overflow-hidden group transition-all">
              <div className="absolute top-2 right-2 w-20 h-20 rounded-full bg-[#D7A83E]/10 blur-2xl animate-sunlight pointer-events-none" />
              <div className="absolute -bottom-4 right-3 text-5xl opacity-12 select-none pointer-events-none group-hover:scale-110 transition-transform">☀️</div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5 text-[#2E7D4F]">
                  <CloudSun className="w-4 h-4" /> {t.weather}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#E7F3E5] text-[#2E7D4F] text-[10px] font-bold border border-[#DCE8D8]">Spray: Optimal</span>
              </div>
              <div className="text-3xl font-black text-[#183326] font-mono mt-2 tracking-tight">24°C</div>
              <div className="text-xs text-[#607568] mt-0.5 font-medium">Ludhiana · Sunny &amp; Clear</div>
              <div className="mt-3 pt-2.5 border-t border-[#DCE8D8] grid grid-cols-3 gap-1 text-[11px] text-[#607568]">
                <div className="text-center"><div className="text-[#183326] font-bold">0%</div><div>Rain</div></div>
                <div className="text-center border-x border-[#DCE8D8]"><div className="text-[#183326] font-bold">38%</div><div>Humidity</div></div>
                <div className="text-center"><div className="text-[#183326] font-bold">11</div><div>km/h Wind</div></div>
              </div>
            </div>

            {/* Wheat Price Card */}
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] relative overflow-hidden group transition-all">
              <div className="absolute -bottom-3 right-2 text-5xl opacity-12 select-none pointer-events-none group-hover:scale-110 transition-transform">🌾</div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5 text-[#D7A83E]">
                  <TrendingUp className="w-4 h-4" /> Wheat · Khanna Mandi
                </span>
                <span className="text-[#2E7D4F] text-xs font-black bg-[#E7F3E5] px-2 py-0.5 rounded-full border border-[#DCE8D8]">+2.8% ↑</span>
              </div>
              <div className="text-3xl font-black text-[#183326] font-mono mt-2 tracking-tight">₹2,540</div>
              <div className="text-xs text-[#607568] mt-0.5 font-medium">Modal Price / Quintal</div>
              <div className="mt-3 pt-2.5 border-t border-[#DCE8D8] grid grid-cols-3 gap-1 text-[11px] text-[#607568]">
                <div className="text-center"><div className="text-[#183326] font-bold">₹2,460</div><div>Min</div></div>
                <div className="text-center border-x border-[#DCE8D8]"><div className="text-[#183326] font-bold">₹2,620</div><div>Max</div></div>
                <div className="text-center"><div className="text-[#183326] font-bold">1,850</div><div>MT Arr.</div></div>
              </div>
            </div>

            {/* Total Farm Income */}
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] relative overflow-hidden group transition-all">
              <div className="absolute -bottom-2 right-2 text-5xl opacity-12 select-none pointer-events-none group-hover:scale-110 transition-transform">💰</div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5 text-[#2E7D4F]">
                  <DollarSign className="w-4 h-4" /> {t.income}
                </span>
                <span className="text-xs text-[#607568] bg-[#F3F8F1] px-2 py-0.5 rounded-full border border-[#DCE8D8]">2 Invoices</span>
              </div>
              <div className="text-3xl font-black text-[#183326] font-mono mt-2 tracking-tight">
                ₹{totalIncomeSum.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-[#2E7D4F] mt-0.5 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24% vs Last Rabi Season
              </div>
              <div className="mt-3 pt-2.5 border-t border-[#DCE8D8] text-[11px] text-[#607568]">
                Last Sale: Basmati 1121 · ₹5.22L
              </div>
            </div>

            {/* Net Profit */}
            <div className="glass-card rounded-2xl p-5 border border-[#2E7D4F]/20 bg-gradient-to-tr from-[#E7F3E5] to-white relative overflow-hidden group transition-all">
              <div className="absolute -bottom-2 right-2 text-5xl opacity-12 select-none pointer-events-none group-hover:scale-110 transition-transform">📈</div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5 text-[#2E7D4F]">
                  <Wallet className="w-4 h-4" /> {t.netProfit}
                </span>
                <span className="text-[10px] text-[#2E7D4F] font-bold bg-[#E7F3E5] border border-[#DCE8D8] px-2 py-0.5 rounded-full">92% Margin</span>
              </div>
              <div className="text-3xl font-black text-[#2E7D4F] font-mono mt-2 tracking-tight">
                ₹{netFarmProfit.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-[#607568] mt-0.5">
                After ₹{totalExpenseSum.toLocaleString('en-IN')} expenses
              </div>
              <div className="mt-3 pt-2.5 border-t border-[#DCE8D8] text-[11px] text-[#2E7D4F] flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3 h-3 text-[#D7A83E]" /> ₹81,600 extra via AI timing
              </div>
            </div>

            {/* Personal Net Worth */}
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] relative overflow-hidden group transition-all">
              <div className="absolute -bottom-2 right-2 text-5xl opacity-12 select-none pointer-events-none group-hover:scale-110 transition-transform">💎</div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold flex items-center gap-1.5 text-[#D7A83E]">
                  <Wallet className="w-4 h-4" /> Net Worth
                </span>
                <span className="text-[10px] text-[#607568] flex items-center gap-1 bg-[#F3F8F1] px-2 py-0.5 rounded-full border border-[#DCE8D8]">
                  <Lock className="w-2.5 h-2.5 text-[#9BB5A0]" /> Private
                </span>
              </div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-2 tracking-tight">
                {userProfile.netWorth || 'Not provided'}
              </div>
              <div className="text-xs text-[#607568] mt-0.5 font-medium">
                {userProfile.netWorth && userProfile.netWorth !== 'Not provided'
                  ? 'Active financial profile'
                  : 'Undisclosed / Optional'}
              </div>
              <div className="mt-3 pt-2.5 border-t border-[#DCE8D8] flex items-center justify-between text-[11px] text-[#607568]">
                <span>Personal Capital</span>
                <button
                  id="dashboard-metric-manage-networth"
                  onClick={() => setShowProfileEditModal(true)}
                  className="text-[#2E7D4F] hover:underline font-semibold cursor-pointer"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>

          {/* ── SEGMENTED TAB NAVIGATION ──────────────────────────────── */}
          <div className="relative">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 px-1 pt-1">
              {[
                { id: 'overview', label: '🌱 Farm Overview', short: 'Overview' },
                { id: 'farms', label: '🌍 Land & Plots', short: 'Plots' },
                { id: 'forecast', label: '📈 AI Forecaster', short: 'Forecast' },
                { id: 'advisor', label: '🤖 Sell Advisor', short: 'Advisor' },
                { id: 'mandi', label: '🏪 Mandis & Freight', short: 'Mandis' },
                { id: 'ledger', label: '📒 Ledger', short: 'Ledger' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFarmerTab(tab.id as any)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    farmerTab === tab.id
                      ? 'bg-[#2E7D4F] text-white shadow-md shadow-[#2E7D4F]/25'
                      : 'text-[#607568] hover:text-[#183326] hover:bg-white bg-[#F3F8F1] border border-[#DCE8D8]'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.short}</span>
                </button>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#DCE8D8] to-transparent mt-1" />
          </div>

          {/* Tab Content: OVERVIEW & ACTIVE CROPS */}
          {farmerTab === 'overview' && (
            <div className="space-y-6">
              
              {/* ── ACTIVE CROP CARDS ──────────────────────────────────────── */}
              <div className="glass-card rounded-3xl p-6 border border-[#DCE8D8] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-40 bg-gradient-to-bl from-[#E7F3E5]/50 to-transparent rounded-3xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-[#DCE8D8]">
                  <div>
                    <h3 className="text-lg font-black text-[#183326] flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <span className="text-[#2E7D4F] animate-wind-subtle inline-block">🌿</span>
                      Active Cultivated Crops
                      <span className="text-xs font-semibold text-[#607568] ml-1">({crops.length} Plots)</span>
                    </h3>
                    <p className="text-xs text-[#607568] mt-0.5">
                      Live growth stages · vegetative health · yield estimates
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddCropModal(true)}
                    className="group relative px-4 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#2E7D4F]/20 transition-all hover:scale-105"
                  >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Add New Crop</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  {crops.map((c) => {
                    const cropIcon = c.name.toLowerCase().includes('wheat') ? '🌾'
                      : c.name.toLowerCase().includes('mustard') ? '🌼'
                      : c.name.toLowerCase().includes('basmati') || c.name.toLowerCase().includes('paddy') ? '🌾'
                      : '🌿';
                    const healthColor = c.status === 'Healthy' ? 'text-[#2E7D4F] bg-[#E7F3E5] border-[#2E7D4F]/25'
                      : c.status === 'Ready to Harvest' ? 'text-[#D7A83E] bg-[#F6EBC8] border-[#D7A83E]/30'
                      : 'text-rose-600 bg-rose-50 border-rose-200';
                    return (
                      <div
                        key={c.id}
                        className="group relative p-4 rounded-2xl bg-white border border-[#DCE8D8] hover:border-[#2E7D4F]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#183326]/8 cursor-pointer overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#E7F3E5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

                        {/* Crop Icon Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-[#E7F3E5] border border-[#DCE8D8] flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                              {cropIcon}
                            </div>
                            <div>
                              <h4 className="font-black text-[#183326] text-sm leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>{c.name.split(' (')[0]}</h4>
                              <span className="text-[10px] text-[#2E7D4F] font-semibold">{c.variety}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${healthColor}`}>
                            {c.status}
                          </span>
                        </div>

                        {/* Growth Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-[11px] text-[#607568] mb-1.5">
                            <span className="font-medium">Stage: <span className="text-[#183326] font-bold">{c.growthStage}</span></span>
                            <span className="font-bold text-[#2E7D4F]">{c.growthProgressPercent}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-[#E7F3E5] rounded-full overflow-hidden border border-[#DCE8D8]">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${c.growthProgressPercent}%`,
                                background: c.growthProgressPercent >= 90
                                  ? 'linear-gradient(90deg, #D7A83E, #f0c44a)'
                                  : 'linear-gradient(90deg, #2E7D4F, #4CAF70)',
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-[#9BB5A0] mt-0.5 px-0.5">
                            <span>Sow</span><span>Veg</span><span>Flower</span><span>Mature</span><span>Harvest</span>
                          </div>
                        </div>

                        {/* Harvest & Yield */}
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-[#F3F8F1] rounded-lg p-2 border border-[#DCE8D8]">
                            <div className="text-[#607568] mb-0.5">🗓 Harvest</div>
                            <div className="font-bold text-[#183326] text-xs">{c.expectedHarvestDate}</div>
                          </div>
                          <div className="bg-[#E7F3E5] rounded-lg p-2 border border-[#DCE8D8]">
                            <div className="text-[#607568] mb-0.5">⚖ Yield</div>
                            <div className="font-black text-[#2E7D4F] font-mono text-xs">{c.expectedYieldQuintals} Qtl</div>
                          </div>
                        </div>

                        {/* Health Score */}
                        <div className="mt-2.5 flex items-center justify-between text-[10px]">
                          <span className="text-[#607568]">Health Index</span>
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(i => (
                                <div key={i} className={`w-2 h-2 rounded-full ${i <= Math.round(c.healthScore / 20) ? 'bg-[#4CAF70]' : 'bg-[#DCE8D8]'}`} />
                              ))}
                            </div>
                            <span className="font-bold text-[#2E7D4F]">{c.healthScore}/100</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Forecast & Sell Advisor Dual Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <PriceForecastChart />
                </div>
                <div className="lg:col-span-4 flex flex-col justify-between glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D7A83E] flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Sell Advisor
                    </span>
                    <h4 className="text-lg font-bold text-[#183326]" style={{ fontFamily: 'Manrope, sans-serif' }}>Sharbati Wheat Decision</h4>
                    <p className="text-xs text-[#607568] mt-1">
                      Multi-parameter warehouse storage vs APMC surge evaluation.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F6EBC8] border border-[#D7A83E]/30 space-y-2">
                    <div className="text-[10px] font-bold text-[#D7A83E] uppercase">AI Recommendation</div>
                    <div className="text-2xl font-black text-[#183326]" style={{ fontFamily: 'Manrope, sans-serif' }}>HOLD FOR 14 DAYS</div>
                    <div className="text-xs text-[#607568]">
                      Expected Peak Price: <strong className="text-[#2E7D4F]">₹2,780/Qtl</strong> (Current: ₹2,540)
                    </div>
                    <div className="text-[11px] text-[#607568] pt-1 border-t border-[#D7A83E]/20">
                      Net gain on your 340 quintals: <strong className="text-[#2E7D4F]">+₹81,600</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#607568]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F] shrink-0" />
                      <span>Cold storage / godown rental: ₹14/qtl/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4F] shrink-0" />
                      <span>Zero distress glut in week 3 of April</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setFarmerTab('advisor')}
                    className="w-full py-2.5 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] border border-[#DCE8D8] text-[#183326] text-xs font-semibold transition-all flex items-center justify-center gap-1"
                  >
                    <span>View Complete Storage Math</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: LAND & PLOTS */}
          {farmerTab === 'farms' && (
            <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6 bg-white">
              <div className="flex items-center justify-between pb-4 border-b border-[#DCE8D8]">
                <div>
                  <h3 className="text-lg font-bold text-[#183326] flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <Layers className="w-5 h-5 text-[#2E7D4F]" /> Land Holdings & Soil Profiles
                  </h3>
                  <p className="text-xs text-[#607568]">
                    Manage multiple parcels, soil test report parameters, and micro-irrigation plumbing.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddFarmModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#2E7D4F]/20"
                >
                  <Plus className="w-4 h-4" /> Add Land Plot
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {farms.map((f) => (
                  <div key={f.id} className="p-5 rounded-2xl bg-white border border-[#DCE8D8] space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-base text-[#183326]" style={{ fontFamily: 'Manrope, sans-serif' }}>{f.name}</h4>
                        <div className="text-xs text-[#2E7D4F] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" /> GPS: {f.coordinates[0]}, {f.coordinates[1]}
                        </div>
                      </div>
                      <span className="text-base font-black text-[#183326] font-mono bg-[#E7F3E5] px-3 py-1 rounded-xl border border-[#DCE8D8]">
                        {f.areaAcres} Acres
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-[#DCE8D8]">
                      <div>
                        <span className="text-[#607568]">Soil Type:</span>
                        <div className="font-semibold text-[#183326]">{f.soilType}</div>
                      </div>
                      <div>
                        <span className="text-[#607568]">Water Source:</span>
                        <div className="font-semibold text-[#183326]">{f.waterSource}</div>
                      </div>
                      <div>
                        <span className="text-[#607568]">Irrigation Setup:</span>
                        <div className="font-semibold text-[#2E7D4F]">{f.irrigationType}</div>
                      </div>
                      <div>
                        <span className="text-[#607568]">Active Crops:</span>
                        <div className="font-semibold text-[#183326]">{f.cropsActive} Crops growing</div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href="/ai-hub#crop-recommender"
                        className="flex-1 py-2 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] border border-[#DCE8D8] text-center text-xs text-[#607568] font-semibold transition-colors"
                      >
                        Soil Health Card
                      </Link>
                      <Link
                        href="/ai-hub#smart-irrigation"
                        className="flex-1 py-2 rounded-xl bg-[#E7F3E5] hover:bg-[#D4EDD0] border border-[#DCE8D8] text-center text-xs text-[#2E7D4F] font-semibold transition-colors"
                      >
                        IoT Drip Planner
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: AI PRICE FORECASTER */}
          {farmerTab === 'forecast' && (
            <div className="space-y-6">
              <PriceForecastChart />
            </div>
          )}

          {/* Tab Content: SELL VS HOLD ADVISOR */}
          {farmerTab === 'advisor' && (
            <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6 bg-white">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">
                  Decision Intelligence Engine
                </span>
                <h3 className="text-xl font-bold text-[#183326] mt-1">
                  Sell vs Hold Economics Breakdown (Wheat DBW-187)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8]">
                  <div className="text-xs text-[#607568]">Current APMC Spot Price:</div>
                  <div className="text-2xl font-black text-[#183326] font-mono mt-1">₹2,540 / Qtl</div>
                  <div className="text-[11px] text-[#607568] mt-1">Liquid today at Khanna Yard</div>
                </div>

                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="text-xs text-[#607568]">Storage & Weight Loss Cost:</div>
                  <div className="text-2xl font-black text-rose-600 font-mono mt-1">-₹28 / Qtl</div>
                  <div className="text-[11px] text-[#607568] mt-1">14-day warehouse charge + 0.5% moisture loss</div>
                </div>

                <div className="p-4 rounded-xl bg-[#E7F3E5] border border-[#2E7D4F]/20">
                  <div className="text-xs text-[#2E7D4F] font-bold">Predicted Peak (Day 14):</div>
                  <div className="text-2xl font-black text-[#2E7D4F] font-mono mt-1">₹2,780 / Qtl</div>
                  <div className="text-[11px] text-[#2E7D4F] mt-1">Net Gain: +₹212/Qtl after all storage expenses</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F3F8F1] border border-[#DCE8D8] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#183326] text-base">Recommended Execution:</div>
                  <div className="text-xs text-[#607568] mt-0.5">
                    Hold in certified warehouse until April 14th. We will send an SMS and WhatsApp alert on the peak morning.
                  </div>
                </div>
                <button 
                  onClick={() => alert('Peak Price Alert Activated! You will receive instant SMS notifications 24 hours before the target window.')}
                  className="px-4 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold text-xs shadow-md transition-all shrink-0 ml-4"
                >
                  Activate SMS Alert
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: NEARBY MANDIS & FREIGHT */}
          {farmerTab === 'mandi' && (
            <MandiMapViewer />
          )}

          {/* Tab Content: INCOME & EXPENSE LEDGER */}
          {farmerTab === 'ledger' && (
            <div className="space-y-6">
              
              {/* Ledger Actions Bar */}
              <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                <div>
                  <h3 className="text-lg font-bold text-[#183326] flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <FileText className="w-5 h-5 text-[#2E7D4F]" /> Farm Financial Ledger
                  </h3>
                  <p className="text-xs text-[#607568]">
                    Track input expenses (seeds, fertilizer, diesel, labour) and sales income.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={exportLedgerCSV}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F3F8F1] border border-[#DCE8D8] text-[#607568] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4 text-[#2E7D4F]" />
                    <span>Export CSV / Excel</span>
                  </button>
                  <button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Expense</span>
                  </button>
                </div>
              </div>

              {/* Expenses List */}
              <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] bg-white">
                <h4 className="text-sm font-bold text-[#183326] mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Farm Input Expenses</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#607568]">
                    <thead className="border-b border-[#DCE8D8] text-[#9BB5A0] uppercase text-[10px] font-bold bg-[#F9FBF8]">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE8D8] font-mono">
                      {expenses.map((e) => (
                        <tr key={e.id} className="hover:bg-[#F9FBF8] transition-colors">
                          <td className="py-3 px-3 text-[#9BB5A0]">{e.date}</td>
                          <td className="py-3 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded-full bg-[#E7F3E5] text-[#2E7D4F] text-[10px] font-semibold border border-[#DCE8D8]">
                              {e.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-sans text-[#183326]">{e.description}</td>
                          <td className="py-3 px-3 text-right font-bold text-rose-600">
                            -₹{e.amount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Incomes List */}
              <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] bg-white">
                <h4 className="text-sm font-bold text-[#183326] mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Crop Sales Invoices</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#607568]">
                    <thead className="border-b border-[#DCE8D8] text-[#9BB5A0] uppercase text-[10px] font-bold bg-[#F9FBF8]">
                      <tr>
                        <th className="py-2.5 px-3">Invoice No</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Crop</th>
                        <th className="py-2.5 px-3">Quantity</th>
                        <th className="py-2.5 px-3">Buyer Name</th>
                        <th className="py-2.5 px-3 text-right">Total Net (₹)</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE8D8] font-mono">
                      {incomes.map((i) => (
                        <tr key={i.id} className="hover:bg-[#F9FBF8] transition-colors">
                          <td className="py-3 px-3 text-[#2E7D4F] font-bold">{i.invoiceNo}</td>
                          <td className="py-3 px-3 text-[#9BB5A0]">{i.date}</td>
                          <td className="py-3 px-3 font-sans text-[#183326]">{i.cropName}</td>
                          <td className="py-3 px-3 text-[#607568]">{i.quantityQuintals} Qtl @ ₹{i.ratePerQuintal}</td>
                          <td className="py-3 px-3 font-sans text-[#607568]">{i.buyerName}</td>
                          <td className="py-3 px-3 text-right font-bold text-[#2E7D4F]">
                            +₹{i.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-center font-sans">
                            <span className="px-2 py-0.5 rounded-full bg-[#E7F3E5] text-[#2E7D4F] text-[10px] font-bold border border-[#DCE8D8]">
                              {i.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BUYER & TRADER DASHBOARD                                              */}
      {/* ========================================================================= */}
      {currentRole === 'buyer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Active Procurement Orders:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">12 Orders</div>
              <div className="text-xs text-[#2E7D4F] mt-1">540 MT In Transit to Vashi Yard</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Escrow Balance Secured:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">₹42,50,000</div>
              <div className="text-xs text-[#607568] mt-1">e-NAM Bank Guarantee Active</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Average Savings vs Commission Agents:</div>
              <div className="text-2xl font-black text-[#2E7D4F] font-mono mt-1">6.8%</div>
              <div className="text-xs text-[#2E7D4F] mt-1">Direct farm-gate aggregation</div>
            </div>
          </div>

          {/* Marketplace Listing Board */}
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE8D8]">
              <div>
                <h3 className="text-lg font-bold text-[#183326]">Direct Farm Procurement Board</h3>
                <p className="text-xs text-[#607568]">Verified farmer stock ready for immediate dispatch.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] text-xs text-[#607568] font-semibold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Grade A / Export Only
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MARKETPLACE_LISTINGS.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-[#DCE8D8] flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#2E7D4F] uppercase tracking-wider">{item.qualityGrade}</span>
                      <h4 className="text-base font-bold text-[#183326]">{item.crop}</h4>
                      <div className="text-xs text-[#607568]">{item.farmerName} • {item.farmerLocation}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-[#2E7D4F] font-mono">₹{item.pricePerQuintal}</div>
                      <div className="text-[10px] text-[#607568]">/ Quintal Ask</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-[#F9FBF8] p-2.5 rounded-xl border border-[#DCE8D8]">
                    <div>
                      <span className="text-[#607568]">Available:</span>
                      <div className="font-semibold text-[#183326]">{item.quantityAvailableQuintals} Qtl</div>
                    </div>
                    <div>
                      <span className="text-[#607568]">Min Order:</span>
                      <div className="font-semibold text-[#183326]">{item.minOrderQuintals} Qtl</div>
                    </div>
                    <div>
                      <span className="text-[#607568]">High Bid:</span>
                      <div className="font-semibold text-[#2E7D4F] font-mono">₹{item.currentHighestBid}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedListingForBid(item);
                        setBidAmount((item.currentHighestBid + 20).toString());
                        setShowNegotiationModal(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold text-xs transition-colors"
                    >
                      Make Counter Offer
                    </button>
                    <button 
                      onClick={() => alert(`Purchase Order created for ${item.crop}! Redirecting to e-NAM Escrow checkout.`)}
                      className="py-2 px-3 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] text-[#183326] font-semibold text-xs transition-colors border border-[#DCE8D8]"
                    >
                      Buy Spot Lot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TRANSPORTER DASHBOARD                                                 */}
      {/* ========================================================================= */}
      {currentRole === 'transporter' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Active Trucks in Transit:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">8 / 18</div>
              <div className="text-xs text-[#2E7D4F] mt-1">All GPS Telemetry Normal</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">This Month Freight Gross:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">₹8,40,000</div>
              <div className="text-xs text-[#2E7D4F] mt-1">+14.2% Fleet Utilization</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Diesel Cost Efficiency:</div>
              <div className="text-2xl font-black text-[#2E7D4F] font-mono mt-1">4.2 km/L</div>
              <div className="text-xs text-[#607568] mt-1">Optimized via Kisan Gati Engine</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Available Return Loads:</div>
              <div className="text-2xl font-black text-[#D7A83E] font-mono mt-1">5 Loads</div>
              <div className="text-xs text-[#607568] mt-1">Zero empty deadhead miles</div>
            </div>
          </div>

          {/* Freight Load Board */}
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-4 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <div>
                <h3 className="text-lg font-bold text-[#183326] flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#2E7D4F]" /> Agri-Freight Booking Board
                </h3>
                <p className="text-xs text-[#607568]">Open mandi transport orders ready for truck allocation.</p>
              </div>
            </div>

            <div className="space-y-3">
              {FREIGHT_BOOKINGS.map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-[#F9FBF8] border border-[#DCE8D8] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#183326]">{b.fromMandi}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#2E7D4F]" />
                      <span className="text-xs font-bold text-[#2E7D4F]">{b.toLocation}</span>
                      <span className="text-[10px] text-[#607568] font-mono">({b.distanceKm} km)</span>
                    </div>
                    <div className="text-xs text-[#607568] mt-1">
                      {b.crop} • {b.truckType} • Pickup: {b.pickupDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-black text-[#2E7D4F] font-mono">₹{b.rateOffer.toLocaleString()}</div>
                      <div className="text-[10px] text-[#607568]">Fuel: ~{b.fuelEstimateLiters}L | Toll: ₹{b.tollEstimate}</div>
                    </div>
                    <button 
                      onClick={() => alert(`Load ${b.id} accepted! Driver dispatch dispatched to driver app.`)}
                      className="px-4 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
                    >
                      Accept Load
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AGRICULTURE EXPERT / SCIENTIST DASHBOARD                              */}
      {/* ========================================================================= */}
      {currentRole === 'expert' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Pending Field Questions:</div>
              <div className="text-2xl font-black text-[#D7A83E] font-mono mt-1">14 Pending</div>
              <div className="text-xs text-[#607568] mt-1">Punjab & Haryana wheat belt queries</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Foliage Scans Verified:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">320 Scans</div>
              <div className="text-xs text-[#2E7D4F] mt-1">99.2% Agreement with AI Vision</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Upcoming Video Consultations:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">4 Scheduled</div>
              <div className="text-xs text-[#2E7D4F] mt-1">Next: Today at 04:00 PM with FPO Sangrur</div>
            </div>
          </div>

          {/* Expert Triage Queue */}
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-4 bg-white">
            <h3 className="text-lg font-bold text-[#183326] flex items-center gap-2">
              <Microscope className="w-5 h-5 text-[#2E7D4F]" /> Farmer Diagnostic Triage Queue
            </h3>
            
            <div className="space-y-4">
              {FORUM_POSTS.map((post) => (
                <div key={post.id} className="p-4 rounded-xl bg-[#F9FBF8] border border-[#DCE8D8] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#2E7D4F] uppercase">{post.cropTag} • {post.state}</span>
                      <h4 className="text-sm font-bold text-[#183326] mt-0.5">{post.title}</h4>
                      <p className="text-xs text-[#607568] mt-1">{post.content}</p>
                    </div>
                  </div>

                  {post.expertAnswer ? (
                    <div className="p-3 rounded-xl bg-[#E7F3E5] border border-[#DCE8D8] text-xs space-y-1">
                      <div className="font-bold text-[#2E7D4F]">Your Verified ICAR Advisory:</div>
                      <div className="text-[#607568]">{post.expertAnswer.answer}</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-1">
                      <input 
                        type="text" 
                        placeholder="Type expert advisory diagnosis & pesticide dosage..." 
                        className="flex-1 bg-white border border-[#DCE8D8] rounded-xl px-3 py-2 text-xs text-[#183326]" 
                      />
                      <button 
                        onClick={() => alert('Official ICAR Advisory posted to farmer!')}
                        className="px-4 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold text-xs"
                      >
                        Publish Advisory
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. GOVERNMENT OFFICER DASHBOARD                                          */}
      {/* ========================================================================= */}
      {currentRole === 'government' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">District Kharif/Rabi Output:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">1.48M MT</div>
              <div className="text-xs text-[#2E7D4F] mt-1">+3.2% vs State Target</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">PM-KISAN DBT Disbursed:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">98.4%</div>
              <div className="text-xs text-[#2E7D4F] mt-1">Aadhaar Seeding 100% complete</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">MSP Compliance Index:</div>
              <div className="text-2xl font-black text-[#2E7D4F] font-mono mt-1">100% Compliant</div>
              <div className="text-xs text-[#607568] mt-1">Zero illegal sub-MSP APMC trades</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Crop Insurance Claims Settled:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">₹14.2 Cr</div>
              <div className="text-xs text-[#2E7D4F] mt-1">Avg turnaround: 9 days</div>
            </div>
          </div>

          {/* District Scheme Management */}
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-4 bg-white">
            <h3 className="text-lg font-bold text-[#183326] flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#2E7D4F]" /> Centrally Sponsored Agricultural Schemes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GOV_SCHEMES.map((sch) => (
                <div key={sch.id} className="p-4 rounded-xl bg-[#F9FBF8] border border-[#DCE8D8] space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-[#183326] text-sm">{sch.name}</h4>
                    <span className="text-[10px] font-bold bg-[#E7F3E5] text-[#2E7D4F] px-2 py-0.5 rounded-full">
                      {sch.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#2E7D4F] font-semibold">{sch.benefit}</div>
                  <div className="text-[11px] text-[#607568]">Eligibility: {sch.eligibility}</div>
                  <div className="pt-2 border-t border-[#DCE8D8] flex justify-between text-[11px] text-[#607568]">
                    <span>Beneficiaries: <strong>{sch.appliedCount}</strong></span>
                    <span>Total: <strong>{sch.disbursedTotal}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SYSTEM ADMIN PANEL                                                    */}
      {/* ========================================================================= */}
      {currentRole === 'admin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Platform Registered Users:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">452,190</div>
              <div className="text-xs text-[#2E7D4F] mt-1">+1,240 joined today</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Live Agmarknet Mandis:</div>
              <div className="text-2xl font-black text-[#183326] font-mono mt-1">1,248 Mandis</div>
              <div className="text-xs text-[#2E7D4F] mt-1">Streaming latency: 42ms</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">AI Model Inference Health:</div>
              <div className="text-2xl font-black text-[#2E7D4F] font-mono mt-1">99.98% OK</div>
              <div className="text-xs text-[#607568] mt-1">Zero model drift detected</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-[#DCE8D8] bg-white">
              <div className="text-xs text-[#607568]">Pending KYC Approvals:</div>
              <div className="text-2xl font-black text-[#D7A83E] font-mono mt-1">6 Verification</div>
              <div className="text-xs text-[#607568] mt-1">Agri Scientists & Officers</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-4 bg-white">
            <h3 className="text-lg font-bold text-[#183326] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2E7D4F]" /> Pending Role Approvals (RBAC Verification)
            </h3>

            <div className="space-y-2">
              {[
                { name: 'Dr. Suresh Verma', role: 'Agri Scientist (ICAR Karnal)', doc: 'ICAR Employee ID #44910', date: '10 mins ago' },
                { name: 'Rajeev Mehra (IAS)', role: 'Nodal Officer (Rajasthan Agri)', doc: 'Ministry Deputation Order #991', date: '1 hour ago' },
                { name: 'Punjab Agro Cold Chains Ltd', role: 'Corporate Buyer', doc: 'GSTIN 03AAACP8912K1Z9', date: '3 hours ago' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F9FBF8] border border-[#DCE8D8] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#183326]">{item.name}</div>
                    <div className="text-[#607568]">{item.role} • <span className="text-[#2E7D4F]">{item.doc}</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => alert(`Verified & Approved access for ${item.name}!`)}
                      className="px-3 py-1.5 rounded-lg bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold"
                    >
                      Approve
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-[#DCE8D8] text-[#607568]">
                      Review Docs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD EXPENSE                                                        */}
      {/* ========================================================================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-[#183326]/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-[#DCE8D8] space-y-4 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <h3 className="font-bold text-[#183326] text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>Record Farm Input Expense</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-[#607568] hover:text-[#183326]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#607568] font-semibold mb-1">Expense Category:</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value as any)}
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] focus:outline-none focus:border-[#4CAF70]"
                >
                  <option value="Fertilizer">Fertilizer (Urea / DAP / Potash)</option>
                  <option value="Seeds">Certified Seeds / Hybrids</option>
                  <option value="Labour">Labour & Weeding Wages</option>
                  <option value="Fuel">Fuel (Tractor Diesel)</option>
                  <option value="Pesticide">Pesticides & Bio-sprays</option>
                  <option value="Electricity">Electricity / Tube-well Bill</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Description / Vendor:</label>
                <input
                  type="text"
                  required
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  placeholder="e.g. 10 bags DAP fertilizer from IFFCO cooperative"
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] placeholder:text-[#9BB5A0] focus:outline-none focus:border-[#4CAF70]"
                />
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Total Amount (₹):</label>
                <input
                  type="number"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder="e.g. 13500"
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] font-mono placeholder:text-[#9BB5A0] focus:outline-none focus:border-[#4CAF70]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold transition-colors"
                >
                  Save to Ledger
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CROP                                                           */}
      {/* ========================================================================= */}
      {showAddCropModal && (
        <div className="fixed inset-0 z-50 bg-[#183326]/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-[#DCE8D8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <h3 className="font-bold text-[#183326] text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>Add New Sown Crop</h3>
              <button onClick={() => setShowAddCropModal(false)} className="text-[#607568] hover:text-[#183326]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#607568] font-semibold mb-1">Crop Name:</label>
                <input
                  type="text"
                  required
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  placeholder="e.g. Mustard / Paddy / Cotton"
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] placeholder:text-[#9BB5A0] focus:outline-none focus:border-[#4CAF70]"
                />
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Seed Variety:</label>
                <input
                  type="text"
                  value={newCropVariety}
                  onChange={(e) => setNewCropVariety(e.target.value)}
                  placeholder="e.g. Pusa Bold / DBW-303"
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] placeholder:text-[#9BB5A0] focus:outline-none focus:border-[#4CAF70]"
                />
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Expected Yield (Quintals):</label>
                <input
                  type="number"
                  value={newCropYield}
                  onChange={(e) => setNewCropYield(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] font-mono placeholder:text-[#9BB5A0] focus:outline-none focus:border-[#4CAF70]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold transition-colors"
                >
                  Register Crop
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCropModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] border border-[#DCE8D8] text-[#607568] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD FARM / PLOT                                                    */}
      {/* ========================================================================= */}
      {showAddFarmModal && (
        <div className="fixed inset-0 z-50 bg-[#183326]/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-[#DCE8D8] space-y-4 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <h3 className="font-bold text-[#183326] text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>Add New Land Plot</h3>
              <button onClick={() => setShowAddFarmModal(false)} className="text-[#607568] hover:text-[#183326]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFarm} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#607568] font-semibold mb-1">Plot / Farm Name:</label>
                <input
                  type="text"
                  required
                  value={newFarmName}
                  onChange={(e) => setNewFarmName(e.target.value)}
                  placeholder="e.g. North Canal Plot"
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] placeholder:text-[#9BB5A0] focus:outline-none focus:border-[#4CAF70]"
                />
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Area (Acres):</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newFarmAcres}
                  onChange={(e) => setNewFarmAcres(e.target.value)}
                  placeholder="10.0"
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] font-mono placeholder:text-[#9BB5A0] focus:outline-none focus:border-[#4CAF70]"
                />
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Soil Type:</label>
                <select
                  value={newFarmSoil}
                  onChange={(e) => setNewFarmSoil(e.target.value as any)}
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] focus:outline-none focus:border-[#4CAF70]"
                >
                  <option value="Alluvial">Alluvial (Fertile Loam)</option>
                  <option value="Black Cotton">Black Cotton (Clayey)</option>
                  <option value="Red Sandy">Red Sandy</option>
                  <option value="Clayey Loam">Clayey Loam</option>
                </select>
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Water Source:</label>
                <select
                  value={newFarmWater}
                  onChange={(e) => setNewFarmWater(e.target.value as any)}
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] focus:outline-none focus:border-[#4CAF70]"
                >
                  <option value="Tube Well">Tube Well (Groundwater)</option>
                  <option value="Canal Irrigation">Canal Irrigation</option>
                  <option value="Farm Pond">Farm Pond (Rainwater Harvest)</option>
                  <option value="River Drip">River Drip</option>
                </select>
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Irrigation System:</label>
                <select
                  value={newFarmIrrigation}
                  onChange={(e) => setNewFarmIrrigation(e.target.value as any)}
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] focus:outline-none focus:border-[#4CAF70]"
                >
                  <option value="Drip System">Drip System (Precision IoT)</option>
                  <option value="Sprinkler">Sprinkler</option>
                  <option value="Flood Furrow">Flood Furrow</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold transition-colors"
                >
                  Add Land Plot
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFarmModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] border border-[#DCE8D8] text-[#607568] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BUYER NEGOTIATION & CHAT                                           */}
      {/* ========================================================================= */}
      {showNegotiationModal && selectedListingForBid && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-lg w-full p-6 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-white text-base">Direct Negotiation & Live Chat</h3>
                <span className="text-xs text-emerald-400">{selectedListingForBid.crop} • {selectedListingForBid.farmerName}</span>
              </div>
              <button onClick={() => setShowNegotiationModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Box */}
            <div className="h-44 overflow-y-auto bg-black/40 p-3 rounded-xl border border-white/10 space-y-2 text-xs">
              {simulatedChatMessages.map((msg, i) => (
                <div key={i} className={`p-2 rounded-lg ${msg.startsWith('Buyer:') ? 'bg-emerald-950/60 text-emerald-300 ml-4' : 'bg-white/10 text-slate-200 mr-4'}`}>
                  {msg}
                </div>
              ))}
            </div>

            {/* Counter Offer Row */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-300 whitespace-nowrap">Counter Offer (₹/Qtl):</label>
              <input 
                type="number" 
                value={bidAmount} 
                onChange={(e) => setBidAmount(e.target.value)} 
                className="w-28 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold" 
              />
              <span className="text-[10px] text-slate-400">Ask: ₹{selectedListingForBid.pricePerQuintal}</span>
            </div>

            {/* Send Chat input */}
            <form onSubmit={handleSendNegotiationChat} className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to farmer (e.g. Can you deliver 100 Qtl by Friday?)..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
      />

    </div>
    </AuthGuard>
  );
}
