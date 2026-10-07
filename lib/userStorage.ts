import { UserProfile, Farm, Crop, ExpenseRecord, IncomeRecord, UserRole, ROLE_PROFILES } from './store';

const PROFILES_KEY = 'kisansetu_user_profiles_v2';
const EMAIL_INDEX_KEY = 'kisansetu_user_email_index_v2';
const USER_FARMS_KEY = 'kisansetu_user_farms_v2';
const USER_CROPS_KEY = 'kisansetu_user_crops_v2';
const USER_EXPENSES_KEY = 'kisansetu_user_expenses_v2';
const USER_INCOMES_KEY = 'kisansetu_user_incomes_v2';
const ACTIVE_SESSION_KEY = 'kisansetu_active_session_v2';

/** Safe local storage reader */
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** Safe local storage writer */
function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write to localStorage key "${key}":`, err);
  }
}

/** Deterministically create or get unique user ID */
export function generateUserId(email: string): string {
  const cleanEmail = email.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < cleanEmail.length; i++) {
    const char = cleanEmail.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash).toString(36);
  const prefix = cleanEmail.split('@')[0].replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'user';
  return `usr_${prefix}_${positiveHash}`;
}

export interface UserDataset {
  farms: Farm[];
  crops: Crop[];
  expenses: ExpenseRecord[];
  incomes: IncomeRecord[];
}

/** Get all saved profiles map */
export function getAllProfiles(): Record<string, UserProfile> {
  return readStorage<Record<string, UserProfile>>(PROFILES_KEY, {});
}

/** Find profile by email (case-insensitive) */
export function findProfileByEmail(email: string): UserProfile | null {
  const clean = email.trim().toLowerCase();
  const emailMap = readStorage<Record<string, string>>(EMAIL_INDEX_KEY, {});
  const userId = emailMap[clean];
  if (userId) {
    const profiles = getAllProfiles();
    if (profiles[userId]) return profiles[userId];
  }
  // Fallback linear scan in case index is out of sync
  const all = getAllProfiles();
  const found = Object.values(all).find((p) => p.email?.toLowerCase() === clean);
  return found || null;
}

/** Get profile by unique user ID */
export function getUserProfile(userId: string): UserProfile | null {
  const profiles = getAllProfiles();
  return profiles[userId] || null;
}

/** Save or update a user profile */
export function saveUserProfile(profile: UserProfile): void {
  const profiles = getAllProfiles();
  profiles[profile.id] = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  writeStorage(PROFILES_KEY, profiles);

  // Update email index
  if (profile.email) {
    const emailMap = readStorage<Record<string, string>>(EMAIL_INDEX_KEY, {});
    emailMap[profile.email.trim().toLowerCase()] = profile.id;
    writeStorage(EMAIL_INDEX_KEY, emailMap);
  }
}

/** Seed realistic starter farm data isolated to a specific user */
export function seedStarterUserData(userId: string, userName: string, role: UserRole): UserDataset {
  const firstName = userName ? userName.split(' ')[0] : 'My';
  const starterFarmName = `${firstName}'s Krishi Farm`;

  const farms: Farm[] = [
    {
      id: `farm_${userId}_01`,
      name: starterFarmName,
      areaAcres: 12.0,
      soilType: 'Alluvial',
      waterSource: 'Tube Well',
      irrigationType: 'Drip System',
      coordinates: [30.9010, 75.8573],
      cropsActive: 2,
    },
  ];

  const crops: Crop[] = [
    {
      id: `crop_${userId}_01`,
      farmId: `farm_${userId}_01`,
      name: 'Wheat (Sharbati DBW-187)',
      variety: 'Karan Vandana',
      sowingDate: '2025-11-10',
      expectedHarvestDate: '2026-04-12',
      growthStage: 'Flowering',
      growthProgressPercent: 78,
      expectedYieldQuintals: 310,
      healthScore: 95,
      status: 'Healthy',
    },
    {
      id: `crop_${userId}_02`,
      farmId: `farm_${userId}_01`,
      name: 'Mustard (Pusa Bold)',
      variety: 'Pusa Jai Kisan',
      sowingDate: '2025-10-25',
      expectedHarvestDate: '2026-03-20',
      growthStage: 'Maturity',
      growthProgressPercent: 92,
      expectedYieldQuintals: 80,
      healthScore: 91,
      status: 'Ready to Harvest',
    },
  ];

  const expenses: ExpenseRecord[] = [
    {
      id: `exp_${userId}_01`,
      date: '2026-02-28',
      category: 'Fertilizer',
      description: 'IFFCO Nano Urea & Bio-Potash',
      amount: 14200,
    },
    {
      id: `exp_${userId}_02`,
      date: '2026-02-18',
      category: 'Labour',
      description: 'Field weeding & drip maintenance',
      amount: 11000,
    },
  ];

  const incomes: IncomeRecord[] = [
    {
      id: `inc_${userId}_01`,
      date: '2026-02-15',
      cropName: 'Paddy Basmati 1121',
      quantityQuintals: 95,
      ratePerQuintal: 4350,
      totalAmount: 413250,
      buyerName: 'Direct APMC Escrow Buyer',
      invoiceNo: `INV-${userId.slice(-4).toUpperCase()}-101`,
      status: 'Completed',
    },
  ];

  const dataset: UserDataset = { farms, crops, expenses, incomes };
  saveUserData(userId, dataset);
  return dataset;
}

/** Get all farm/ledger data isolated to this user */
export function getUserData(userId: string): UserDataset {
  const allFarms = readStorage<Record<string, Farm[]>>(USER_FARMS_KEY, {});
  const allCrops = readStorage<Record<string, Crop[]>>(USER_CROPS_KEY, {});
  const allExpenses = readStorage<Record<string, ExpenseRecord[]>>(USER_EXPENSES_KEY, {});
  const allIncomes = readStorage<Record<string, IncomeRecord[]>>(USER_INCOMES_KEY, {});

  const farms = allFarms[userId] || [];
  const crops = allCrops[userId] || [];
  const expenses = allExpenses[userId] || [];
  const incomes = allIncomes[userId] || [];

  return { farms, crops, expenses, incomes };
}

/** Save all farm/ledger data isolated to this user */
export function saveUserData(userId: string, data: UserDataset): void {
  const allFarms = readStorage<Record<string, Farm[]>>(USER_FARMS_KEY, {});
  const allCrops = readStorage<Record<string, Crop[]>>(USER_CROPS_KEY, {});
  const allExpenses = readStorage<Record<string, ExpenseRecord[]>>(USER_EXPENSES_KEY, {});
  const allIncomes = readStorage<Record<string, IncomeRecord[]>>(USER_INCOMES_KEY, {});

  allFarms[userId] = data.farms;
  allCrops[userId] = data.crops;
  allExpenses[userId] = data.expenses;
  allIncomes[userId] = data.incomes;

  writeStorage(USER_FARMS_KEY, allFarms);
  writeStorage(USER_CROPS_KEY, allCrops);
  writeStorage(USER_EXPENSES_KEY, allExpenses);
  writeStorage(USER_INCOMES_KEY, allIncomes);
}

/** Append expense for specific user */
export function appendUserExpense(userId: string, expense: ExpenseRecord): void {
  const data = getUserData(userId);
  data.expenses.unshift(expense);
  saveUserData(userId, data);
}

/** Append income for specific user */
export function appendUserIncome(userId: string, income: IncomeRecord): void {
  const data = getUserData(userId);
  data.incomes.unshift(income);
  saveUserData(userId, data);
}

/** Append crop for specific user */
export function appendUserCrop(userId: string, crop: Crop): void {
  const data = getUserData(userId);
  data.crops.push(crop);
  saveUserData(userId, data);
}

/** Append farm for specific user */
export function appendUserFarm(userId: string, farm: Farm): void {
  const data = getUserData(userId);
  data.farms.push(farm);
  saveUserData(userId, data);
}

/** Update existing farm for specific user */
export function updateUserFarm(userId: string, farmId: string, updates: Partial<Farm>): void {
  const data = getUserData(userId);
  data.farms = data.farms.map(f => f.id === farmId ? { ...f, ...updates } : f);
  saveUserData(userId, data);
}

/** Active session management */
export function getActiveSession(): { userId: string; email: string } | null {
  return readStorage<{ userId: string; email: string } | null>(ACTIVE_SESSION_KEY, null);
}

export function setActiveSession(userId: string, email: string): void {
  writeStorage(ACTIVE_SESSION_KEY, { userId, email });
}

export function clearActiveSession(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
      sessionStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch {
      // ignore
    }
  }
}
