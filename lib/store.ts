import { create } from 'zustand';
import { SupportedLanguage } from './i18n';
import {
  findProfileByEmail,
  getUserProfile,
  saveUserProfile,
  getUserData,
  saveUserData,
  seedStarterUserData,
  generateUserId,
  getActiveSession,
  setActiveSession,
  clearActiveSession,
  appendUserExpense,
  appendUserIncome,
  appendUserCrop,
  appendUserFarm,
  updateUserFarm,
} from './userStorage';

export type UserRole = 'farmer' | 'buyer' | 'transporter' | 'expert' | 'government' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location: string;
  state: string;
  avatar: string;
  verified: boolean;
  role: UserRole;
  badge?: string;
  netWorth?: string;
  netWorthRange?: string;
  netWorthAmount?: number;
  profileCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Farm {
  id: string;
  name: string;
  areaAcres: number;
  soilType: 'Alluvial' | 'Black Cotton' | 'Red Sandy' | 'Clayey Loam';
  waterSource: 'Tube Well' | 'Canal Irrigation' | 'Farm Pond' | 'River Drip';
  irrigationType: 'Drip System' | 'Sprinkler' | 'Flood Furrow';
  coordinates: [number, number];
  cropsActive: number;
}

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  sowingDate: string;
  expectedHarvestDate: string;
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Maturity' | 'Harvest Ready';
  growthProgressPercent: number;
  expectedYieldQuintals: number;
  healthScore: number;
  status: 'Healthy' | 'Needs Water' | 'Pest Alert' | 'Ready to Harvest';
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: 'Seeds' | 'Fertilizer' | 'Labour' | 'Fuel' | 'Water' | 'Electricity' | 'Pesticide' | 'Others';
  description: string;
  amount: number;
  receiptUrl?: string;
}

export interface IncomeRecord {
  id: string;
  date: string;
  cropName: string;
  quantityQuintals: number;
  ratePerQuintal: number;
  totalAmount: number;
  buyerName: string;
  invoiceNo: string;
  status: 'Completed' | 'Pending Escrow';
}

export interface NotificationItem {
  id: string;
  type: 'weather' | 'price' | 'disease' | 'order' | 'scheme';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const ROLE_PROFILES: Record<UserRole, UserProfile> = {
  farmer: {
    id: 'usr_demo_farmer_gurpreet',
    email: 'gurpreet@kisansetu.ai',
    name: 'Sardar Gurpreet Singh',
    phone: '+91 98765 43210',
    location: 'Ludhiana, Punjab',
    state: 'Punjab',
    avatar: '👨‍🌾',
    verified: true,
    role: 'farmer',
    badge: 'Progressive Kisan',
    netWorth: '₹10–25 Lakh',
    profileCompleted: true,
  },
  buyer: {
    id: 'usr_demo_buyer_aditi',
    email: 'procurement@aditiagri.in',
    name: 'Aditi Agri Foods Pvt Ltd',
    phone: '+91 91234 56789',
    location: 'Navi Mumbai APMC, Maharashtra',
    state: 'Maharashtra',
    avatar: '🏢',
    verified: true,
    role: 'buyer',
    badge: 'Verified Corporate Buyer',
    netWorth: 'Above ₹1 Crore',
    profileCompleted: true,
  },
  transporter: {
    id: 'usr_demo_trans_balwan',
    email: 'fleet@kisangati.com',
    name: 'Kisan Gati Logistics (Balwan Express)',
    phone: '+91 99887 76655',
    location: 'Indore, Madhya Pradesh',
    state: 'Madhya Pradesh',
    avatar: '🚛',
    verified: true,
    role: 'transporter',
    badge: '18 Reefer Fleet Owner',
    netWorth: '₹50 Lakh–₹1 Crore',
    profileCompleted: true,
  },
  expert: {
    id: 'usr_demo_expert_patil',
    email: 'dr.patil@icar.gov.in',
    name: 'Dr. Rameshwar Patil (Ph.D. Agronomy)',
    phone: '+91 94220 11223',
    location: 'Pune Krishi Vigyan Kendra',
    state: 'Maharashtra',
    avatar: '🔬',
    verified: true,
    role: 'expert',
    badge: 'ICAR Senior Scientist',
    netWorth: '₹25–50 Lakh',
    profileCompleted: true,
  },
  government: {
    id: 'usr_demo_gov_sharma',
    email: 'sunita.ias@agri.gov.in',
    name: 'Sunita Sharma (IAS, Agri Commissioner)',
    phone: '+91 98110 33445',
    location: 'Krishi Bhawan, New Delhi',
    state: 'Delhi',
    avatar: '🏛️',
    verified: true,
    role: 'government',
    badge: 'District Magistrate & Nodal Officer',
    netWorth: '₹50 Lakh–₹1 Crore',
    profileCompleted: true,
  },
  admin: {
    id: 'usr_demo_admin_ops',
    email: 'admin@kisansetu.ai',
    name: 'KisanSetu Ops Console',
    phone: '+91 80000 11222',
    location: 'Bengaluru Tech HQ',
    state: 'Karnataka',
    avatar: '⚡',
    verified: true,
    role: 'admin',
    badge: 'Super Administrator',
    netWorth: 'Above ₹1 Crore',
    profileCompleted: true,
  },
};

export const createDefaultProfile = (id: string, email: string, role: UserRole, name = ''): UserProfile => ({
  id,
  email,
  name,
  phone: '',
  location: 'Ludhiana, Punjab',
  state: 'Punjab',
  avatar: role === 'farmer' ? '👨‍🌾' : role === 'buyer' ? '🏢' : role === 'transporter' ? '🚛' : role === 'expert' ? '🔬' : role === 'government' ? '🏛️' : '⚡',
  verified: true,
  role,
  badge: role === 'farmer' ? 'Progressive Kisan' : role === 'buyer' ? 'Verified Buyer' : role === 'transporter' ? 'Fleet Partner' : role === 'expert' ? 'Agri Scientist' : role === 'government' ? 'Nodal Officer' : 'Administrator',
  netWorth: '',
  profileCompleted: false,
  createdAt: new Date().toISOString(),
});

interface AppState {
  // ── Session ──────────────────────────────────────────────
  isAuthenticated: boolean;
  sessionEmail: string;
  sessionUserId: string;

  // ── Profile & Role ────────────────────────────────────────
  currentRole: UserRole;
  userProfile: UserProfile;
  language: SupportedLanguage;
  theme: 'dark' | 'light';

  // ── Farm Data (user-isolated) ─────────────────────────────
  farms: Farm[];
  crops: Crop[];
  expenses: ExpenseRecord[];
  incomes: IncomeRecord[];
  notifications: NotificationItem[];

  // ── Actions ───────────────────────────────────────────────
  login: (
    email: string,
    role: UserRole,
    providerName?: string,
    isDemo?: boolean
  ) => { profileExists: boolean; profileCompleted: boolean; userId: string };
  logout: () => void;
  loadActiveSession: () => boolean;
  completeOnboarding: (
    name: string,
    netWorth?: string,
    netWorthRange?: string,
    netWorthAmount?: number
  ) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setRole: (role: UserRole) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  addFarm: (farm: Farm) => void;
  updateFarm: (farmId: string, updates: Partial<Farm>) => void;
  addCrop: (crop: Crop) => void;
  addExpense: (expense: ExpenseRecord) => void;
  addIncome: (income: IncomeRecord) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const DEMO_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif_1', type: 'price', title: 'Wheat Price Surge (+₹140/Qtl)', message: 'Azadpur & Khanna Mandi rates up to ₹2,580. AI predicts peak in 8 days.', timestamp: '15 mins ago', read: false },
  { id: 'notif_2', type: 'weather', title: 'Western Disturbance Rain Advisory', message: 'Isolated showers expected across Punjab & Haryana in 48 hours. Delay pesticide spray.', timestamp: '1 hour ago', read: false },
  { id: 'notif_3', type: 'order', title: 'Direct Procure Offer Received', message: 'ITC e-Choupal offered ₹2,620/Qtl for 200 Qtl Sharbati Wheat. View offer.', timestamp: '3 hours ago', read: false },
  { id: 'notif_4', type: 'scheme', title: 'PM-KISAN 17th Installment Credited', message: '₹2,000 DBT credited to verified account under DBTL-AGRI.', timestamp: 'Yesterday', read: true },
];

/** Zero state before login */
const ZERO_STATE = {
  isAuthenticated: false,
  sessionEmail: '',
  sessionUserId: '',
  currentRole: 'farmer' as UserRole,
  userProfile: createDefaultProfile('', '', 'farmer', ''),
  language: 'en' as SupportedLanguage,
  theme: 'light' as const,
  farms: [] as Farm[],
  crops: [] as Crop[],
  expenses: [] as ExpenseRecord[],
  incomes: [] as IncomeRecord[],
  notifications: [] as NotificationItem[],
};

export const useAppStore = create<AppState>((set, get) => ({
  ...ZERO_STATE,

  login: (email, role, providerName, isDemo = false) => {
    const cleanEmail = email.trim().toLowerCase();
    let profile = findProfileByEmail(cleanEmail);
    const userId = profile?.id || generateUserId(cleanEmail);

    if (isDemo && !profile) {
      profile = {
        ...ROLE_PROFILES[role],
        id: userId,
        email: cleanEmail,
        profileCompleted: true,
      };
      saveUserProfile(profile);
      seedStarterUserData(userId, profile.name, role);
    } else if (!profile) {
      profile = createDefaultProfile(userId, cleanEmail, role, providerName || '');
      saveUserProfile(profile);
    } else if (providerName && (!profile.name || profile.name.trim().toLowerCase() === 'guest')) {
      profile.name = providerName;
      saveUserProfile(profile);
    }

    setActiveSession(userId, cleanEmail);

    let userData = getUserData(userId);
    const isCompleted = Boolean(
      profile.profileCompleted &&
      profile.name &&
      profile.name.trim().toLowerCase() !== 'guest'
    );

    if (userData.farms.length === 0 && isCompleted) {
      userData = seedStarterUserData(userId, profile.name || 'My Farm', profile.role || role);
    }

    set({
      isAuthenticated: true,
      sessionEmail: cleanEmail,
      sessionUserId: userId,
      currentRole: profile.role || role,
      userProfile: profile,
      farms: userData.farms,
      crops: userData.crops,
      expenses: userData.expenses,
      incomes: userData.incomes,
      notifications: DEMO_NOTIFICATIONS,
    });

    return {
      profileExists: Boolean(profile),
      profileCompleted: isCompleted,
      userId,
    };
  },

  logout: () => {
    clearActiveSession();
    set({ ...ZERO_STATE });
  },

  loadActiveSession: () => {
    const session = getActiveSession();
    if (!session?.userId) return false;
    const profile = getUserProfile(session.userId) || findProfileByEmail(session.email);
    if (!profile) return false;

    let userData = getUserData(profile.id);
    const isCompleted = Boolean(
      profile.profileCompleted &&
      profile.name &&
      profile.name.trim().toLowerCase() !== 'guest'
    );

    if (userData.farms.length === 0 && isCompleted) {
      userData = seedStarterUserData(profile.id, profile.name || 'My Farm', profile.role);
    }

    set({
      isAuthenticated: true,
      sessionEmail: profile.email,
      sessionUserId: profile.id,
      currentRole: profile.role,
      userProfile: profile,
      farms: userData.farms,
      crops: userData.crops,
      expenses: userData.expenses,
      incomes: userData.incomes,
      notifications: DEMO_NOTIFICATIONS,
    });
    return true;
  },

  completeOnboarding: (name, netWorth, netWorthRange, netWorthAmount) => {
    const state = get();
    const cleanEmail = state.sessionEmail || state.userProfile.email || 'user@kisansetu.ai';
    const userId = state.sessionUserId || state.userProfile.id || generateUserId(cleanEmail);
    const cleanName = name.trim();
    const cleanNetWorth = netWorth ? netWorth.trim() : 'Not provided';

    const updatedProfile: UserProfile = {
      ...state.userProfile,
      id: userId,
      email: cleanEmail,
      name: cleanName,
      netWorth: cleanNetWorth,
      netWorthRange: netWorthRange || cleanNetWorth,
      netWorthAmount,
      profileCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    saveUserProfile(updatedProfile);
    setActiveSession(userId, cleanEmail);

    let userData = getUserData(userId);
    if (userData.farms.length === 0) {
      userData = seedStarterUserData(userId, cleanName, updatedProfile.role);
    }

    set({
      userProfile: updatedProfile,
      sessionUserId: userId,
      farms: userData.farms,
      crops: userData.crops,
      expenses: userData.expenses,
      incomes: userData.incomes,
    });
  },

  updateUserProfile: (updates) => {
    set((state) => {
      const updated: UserProfile = {
        ...state.userProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveUserProfile(updated);
      return { userProfile: updated };
    });
  },

  setRole: (role) => {
    set((state) => {
      // Maintain user's authentic identity while switching console role
      const updatedProfile: UserProfile = {
        ...state.userProfile,
        role,
        badge: role === 'farmer' ? 'Progressive Kisan' : role === 'buyer' ? 'Verified Buyer' : role === 'transporter' ? 'Fleet Partner' : role === 'expert' ? 'Agri Scientist' : role === 'government' ? 'Nodal Officer' : 'Administrator',
      };
      saveUserProfile(updatedProfile);
      return {
        currentRole: role,
        userProfile: updatedProfile,
      };
    });
  },

  setLanguage: (lang) => set({ language: lang }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
    return { theme: nextTheme };
  }),

  addFarm: (farm) => {
    set((state) => {
      const userId = state.sessionUserId || state.userProfile.id;
      if (userId) appendUserFarm(userId, farm);
      return { farms: [...state.farms, farm] };
    });
  },

  updateFarm: (farmId, updates) => {
    set((state) => {
      const userId = state.sessionUserId || state.userProfile.id;
      if (userId) updateUserFarm(userId, farmId, updates);
      return {
        farms: state.farms.map((f) => (f.id === farmId ? { ...f, ...updates } : f)),
      };
    });
  },

  addCrop: (crop) => {
    set((state) => {
      const userId = state.sessionUserId || state.userProfile.id;
      if (userId) appendUserCrop(userId, crop);
      return { crops: [...state.crops, crop] };
    });
  },

  addExpense: (expense) => {
    set((state) => {
      const userId = state.sessionUserId || state.userProfile.id;
      if (userId) appendUserExpense(userId, expense);
      return { expenses: [expense, ...state.expenses] };
    });
  },

  addIncome: (income) => {
    set((state) => {
      const userId = state.sessionUserId || state.userProfile.id;
      if (userId) appendUserIncome(userId, income);
      return { incomes: [income, ...state.incomes] };
    });
  },

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
  })),

  clearAllNotifications: () => set({ notifications: [] }),
}));
