'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sprout, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  UserCheck, 
  ChevronDown, 
  Sparkles, 
  Activity,
  ShoppingCart,
  Users,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Settings,
  Wallet,
  Lock
} from 'lucide-react';
import { useAppStore, UserRole, ROLE_PROFILES } from '@/lib/store';
import { SUPPORTED_LANGUAGES, SupportedLanguage, translations } from '@/lib/i18n';
import ProfileEditModal from './ProfileEditModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    isAuthenticated,
    logout,
    currentRole, 
    setRole, 
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    userProfile, 
    notifications, 
    markNotificationRead 
  } = useAppStore();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((window.scrollY || window.pageYOffset) > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[language] || translations.en;
  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: { role: UserRole; title: string; icon: string; desc: string }[] = [
    { role: 'farmer',      title: t.farmer,      icon: '👨‍🌾', desc: 'Crop manager, AI price predictor, sell advisor' },
    { role: 'buyer',       title: t.buyer,       icon: '🏢', desc: 'Crop procurement, live negotiation & bids' },
    { role: 'transporter', title: t.transporter, icon: '🚛', desc: 'Freight booking, GPS routing & fuel calculator' },
    { role: 'expert',      title: t.expert,      icon: '🔬', desc: 'Disease diagnosis, farmer Q&A & advisory' },
    { role: 'government',  title: t.government,  icon: '🏛️', desc: 'District yield analytics & subsidy monitoring' },
    { role: 'admin',       title: t.admin,       icon: '⚡', desc: 'System management, APMC feeds & AI model health' },
  ];

  const handleSignOut = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/auth');
  };

  const navLinkClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center gap-1.5 ${
      active
        ? 'text-[#2E7D4F] bg-[#E7F3E5] font-semibold'
        : 'text-[#607568] hover:text-[#2E7D4F] hover:bg-[#F3F8F1]'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-[#DCE8D8] shadow-sm shadow-[#183326]/5'
            : 'bg-white/72 backdrop-blur-md border-b border-[#DCE8D8]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-[#2E7D4F]/20 via-[#4CAF70]/15 to-[#D7A83E]/15 blur-sm group-hover:blur-md transition-all" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2E7D4F] via-[#3a9460] to-[#4CAF70] p-0.5 shadow-md shadow-[#2E7D4F]/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-[#2E7D4F] group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D7A83E]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-[#183326] flex items-center gap-1.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                KisanSetu{' '}
                <span className="text-[#2E7D4F] text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E7F3E5] border border-[#DCE8D8]">
                  AI
                </span>
              </span>
              <span className="text-[10px] text-[#607568] font-semibold tracking-wide">
                Living AgriTech Ecosystem
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link href="/"           className={navLinkClass(pathname === '/')}>Home</Link>
            <Link href="/dashboard"  className={navLinkClass(pathname?.startsWith('/dashboard'))}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/ai-hub"     className={navLinkClass(pathname?.startsWith('/ai-hub'))}>
              <Sparkles className="w-4 h-4 text-[#2E7D4F]" /> AI Modules (12)
            </Link>
            <Link href="/marketplace" className={navLinkClass(pathname === '/marketplace')}>
              <ShoppingCart className="w-4 h-4" /> Marketplace
            </Link>
            <Link href="/community"  className={navLinkClass(pathname === '/community')}>
              <Users className="w-4 h-4" /> Krishi Manch
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">

            {/* Quick Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E7F3E5] border border-[#DCE8D8] text-[#2E7D4F] hover:bg-[#D4EDD0] transition-all shadow-sm"
                title="Click to switch role preview"
              >
                <span className="text-sm">{ROLE_PROFILES[currentRole]?.avatar || '👨‍🌾'}</span>
                <span className="hidden sm:inline capitalize">{t[currentRole] || currentRole}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isRoleOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 border border-[#DCE8D8]"
                  onMouseLeave={() => setIsRoleOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#DCE8D8] text-xs font-semibold text-[#607568]">
                    Select User Role Dashboard
                  </div>
                  <div className="py-1 space-y-0.5">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => { setRole(r.role); setIsRoleOpen(false); }}
                        className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                          currentRole === r.role
                            ? 'bg-[#E7F3E5] text-[#2E7D4F] border border-[#DCE8D8] font-semibold'
                            : 'text-[#607568] hover:bg-[#F3F8F1] hover:text-[#183326]'
                        }`}
                      >
                        <span className="text-lg">{r.icon}</span>
                        <div>
                          <div className="font-semibold">{r.title}</div>
                          <div className="text-[10px] text-[#9BB5A0]">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 rounded-lg text-[#607568] hover:bg-[#F3F8F1] border border-transparent hover:border-[#DCE8D8] transition-colors flex items-center gap-1"
                title="Select Language"
              >
                <Globe className="w-4 h-4 text-[#2E7D4F]" />
                <span className="text-xs font-semibold uppercase">{language}</span>
              </button>

              {isLangOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl glass-panel p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 border border-[#DCE8D8]"
                  onMouseLeave={() => setIsLangOpen(false)}
                >
                  <div className="px-2 py-1 text-[11px] font-semibold text-[#607568] border-b border-[#DCE8D8]">
                    Select Indian Language
                  </div>
                  <div className="py-1 grid grid-cols-1 gap-0.5">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }}
                        className={`w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          language === lang.code
                            ? 'bg-[#E7F3E5] text-[#2E7D4F] font-semibold'
                            : 'text-[#607568] hover:bg-[#F3F8F1]'
                        }`}
                      >
                        <span>{lang.nativeName}</span>
                        <span className="text-[10px] text-[#9BB5A0]">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#607568] hover:bg-[#F3F8F1] border border-transparent hover:border-[#DCE8D8] transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#D7A83E]" />
              ) : (
                <Moon className="w-4 h-4 text-[#607568]" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg text-[#607568] hover:bg-[#F3F8F1] border border-transparent hover:border-[#DCE8D8] transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-[#2E7D4F]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2E7D4F]" />
                )}
              </button>

              {isNotifOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 border border-[#DCE8D8]"
                  onMouseLeave={() => setIsNotifOpen(false)}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#DCE8D8]">
                    <span className="text-xs font-bold text-[#183326]">{t.notifications}</span>
                    <span className="text-[10px] bg-[#E7F3E5] text-[#2E7D4F] px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  </div>
                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                          n.read ? 'opacity-60 bg-[#F3F8F1]' : 'bg-[#E7F3E5] border border-[#DCE8D8]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-[#183326]">
                          <span>{n.title}</span>
                          <span className="text-[9px] text-[#607568]">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#607568] mt-1 line-clamp-2">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="navbar-user-profile-button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E7F3E5] hover:bg-[#D4EDD0] border border-[#DCE8D8] text-[#183326] transition-all shadow-sm cursor-pointer"
                  title="Your Profile & Settings"
                >
                  <span className="text-sm">{userProfile.avatar || '👨‍🌾'}</span>
                  <span className="text-xs font-bold truncate max-w-[110px] sm:max-w-[150px] text-[#183326]">
                    {userProfile.name || 'Farmer'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#2E7D4F]" />
                </button>

                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 border border-[#DCE8D8]"
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    {/* User Card */}
                    <div className="p-2.5 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#E7F3E5] border border-[#DCE8D8] flex items-center justify-center text-xl">
                          {userProfile.avatar || '👨‍🌾'}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-black text-[#183326] truncate flex items-center gap-1">
                            {userProfile.name}
                            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D4F] shrink-0" />
                          </div>
                          <div className="text-[10px] text-[#607568] truncate">{userProfile.email}</div>
                          <div className="text-[10px] text-[#2E7D4F] font-semibold capitalize mt-0.5">
                            {t[currentRole] || currentRole} Console
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Net Worth */}
                    <div className="px-3 py-2 rounded-xl bg-[#E7F3E5] border border-[#DCE8D8] flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#607568]">
                        <Wallet className="w-3.5 h-3.5 text-[#2E7D4F]" />
                        <span>Net Worth</span>
                        <Lock className="w-2.5 h-2.5 text-[#9BB5A0]" />
                      </div>
                      <span className="text-xs font-bold text-[#2E7D4F]">
                        {userProfile.netWorth || 'Not provided'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-0.5">
                      <button
                        id="navbar-edit-profile-btn"
                        onClick={() => { setIsProfileOpen(false); setIsEditProfileOpen(true); }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#183326] hover:bg-[#F3F8F1] flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#2E7D4F]" />
                        <span>Edit Profile &amp; Settings</span>
                      </button>
                      <button
                        id="navbar-signout-btn"
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer border-t border-[#DCE8D8] pt-2 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                id="navbar-signin-link"
                href="/auth"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2E7D4F] text-white hover:bg-[#256642] transition-colors shadow-md shadow-[#2E7D4F]/20"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </>
  );
}
