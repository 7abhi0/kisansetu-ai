export interface MandiPrice {
  id: string;
  commodity: string;
  mandi: string;
  state: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  change: number; // percentage
  arrivalQuantityTons: number;
  updatedAt: string;
  distanceKm: number;
  transportCostPerQtl: number;
  netRealization: number;
  rating: number;
}

export interface DiseaseInfo {
  id: string;
  crop: string;
  name: string;
  scientificName: string;
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Nutrient Deficiency';
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  symptoms: string[];
  chemicalTreatment: string;
  organicTreatment: string;
  preventiveMeasures: string;
}

export interface MarketplaceListing {
  id: string;
  farmerName: string;
  farmerLocation: string;
  crop: string;
  variety: string;
  quantityAvailableQuintals: number;
  minOrderQuintals: number;
  pricePerQuintal: number;
  harvestDate: string;
  qualityGrade: 'A+ Export Grade' | 'Grade A Premium' | 'Grade B Standard';
  isOrganicCertified: boolean;
  bidsCount: number;
  currentHighestBid: number;
  imageUrl: string;
}

export interface FreightBooking {
  id: string;
  fromMandi: string;
  toLocation: string;
  distanceKm: number;
  crop: string;
  weightTons: number;
  pickupDate: string;
  rateOffer: number;
  status: 'Open for Bidding' | 'Assigned' | 'In Transit' | 'Delivered';
  truckType: '14 Wheeler (25T)' | 'Tata 407 (3.5T)' | 'Reefer AC (15T)' | 'Tata Ace (1T)';
  fuelEstimateLiters: number;
  tollEstimate: number;
}

export interface ForumPost {
  id: string;
  author: string;
  role: string;
  state: string;
  timeAgo: string;
  title: string;
  content: string;
  cropTag: string;
  upvotes: number;
  repliesCount: number;
  expertAnswered: boolean;
  expertAnswer?: {
    expertName: string;
    designation: string;
    answer: string;
    date: string;
  };
}

export const MANDI_PRICES: MandiPrice[] = [
  {
    id: 'm1',
    commodity: 'Wheat (Sharbati DBW-187)',
    mandi: 'Khanna Grain Market',
    state: 'Punjab',
    modalPrice: 2540,
    minPrice: 2460,
    maxPrice: 2620,
    unit: '₹ / Quintal',
    change: +2.8,
    arrivalQuantityTons: 1850,
    updatedAt: '12 mins ago',
    distanceKm: 18,
    transportCostPerQtl: 35,
    netRealization: 2505,
    rating: 4.8,
  },
  {
    id: 'm2',
    commodity: 'Basmati Rice (Pusa 1121)',
    mandi: 'Karnal Anaj Mandi',
    state: 'Haryana',
    modalPrice: 4420,
    minPrice: 4200,
    maxPrice: 4680,
    unit: '₹ / Quintal',
    change: +1.4,
    arrivalQuantityTons: 920,
    updatedAt: '25 mins ago',
    distanceKm: 85,
    transportCostPerQtl: 85,
    netRealization: 4335,
    rating: 4.9,
  },
  {
    id: 'm3',
    commodity: 'Mustard Seed (Pusa Bold)',
    mandi: 'Alwar Krishi Upaj Mandi',
    state: 'Rajasthan',
    modalPrice: 5680,
    minPrice: 5450,
    maxPrice: 5890,
    unit: '₹ / Quintal',
    change: -0.6,
    arrivalQuantityTons: 640,
    updatedAt: '35 mins ago',
    distanceKm: 210,
    transportCostPerQtl: 140,
    netRealization: 5540,
    rating: 4.6,
  },
  {
    id: 'm4',
    commodity: 'Red Onion (Nashik Special)',
    mandi: 'Lasalgaon APMC',
    state: 'Maharashtra',
    modalPrice: 2150,
    minPrice: 1950,
    maxPrice: 2380,
    unit: '₹ / Quintal',
    change: +6.2,
    arrivalQuantityTons: 3200,
    updatedAt: '5 mins ago',
    distanceKm: 42,
    transportCostPerQtl: 40,
    netRealization: 2110,
    rating: 4.9,
  },
  {
    id: 'm5',
    commodity: 'Cotton (Shankar-6)',
    mandi: 'Rajkot APMC',
    state: 'Gujarat',
    modalPrice: 7350,
    minPrice: 7100,
    maxPrice: 7600,
    unit: '₹ / Quintal',
    change: +1.1,
    arrivalQuantityTons: 1100,
    updatedAt: '18 mins ago',
    distanceKm: 95,
    transportCostPerQtl: 75,
    netRealization: 7275,
    rating: 4.7,
  },
  {
    id: 'm6',
    commodity: 'Dry Red Chilli (Teja)',
    mandi: 'Guntur Mirchi Yard',
    state: 'Andhra Pradesh',
    modalPrice: 18900,
    minPrice: 17800,
    maxPrice: 20200,
    unit: '₹ / Quintal',
    change: +3.5,
    arrivalQuantityTons: 780,
    updatedAt: '8 mins ago',
    distanceKm: 32,
    transportCostPerQtl: 50,
    netRealization: 18850,
    rating: 5.0,
  },
  {
    id: 'm7',
    commodity: 'Soybean (JS-335)',
    mandi: 'Indore Mandi',
    state: 'Madhya Pradesh',
    modalPrice: 4720,
    minPrice: 4500,
    maxPrice: 4910,
    unit: '₹ / Quintal',
    change: -1.2,
    arrivalQuantityTons: 1450,
    updatedAt: '40 mins ago',
    distanceKm: 60,
    transportCostPerQtl: 55,
    netRealization: 4665,
    rating: 4.5,
  },
  {
    id: 'm8',
    commodity: 'Tomato (Hybrid Desi)',
    mandi: 'Azadpur Mandi',
    state: 'New Delhi',
    modalPrice: 1650,
    minPrice: 1400,
    maxPrice: 1900,
    unit: '₹ / Quintal',
    change: +8.4,
    arrivalQuantityTons: 4100,
    updatedAt: '10 mins ago',
    distanceKm: 120,
    transportCostPerQtl: 90,
    netRealization: 1560,
    rating: 4.8,
  }
];

export const PRICE_FORECAST_DATA = {
  crop: 'Wheat (Sharbati DBW-187)',
  currentPrice: 2540,
  recommendation: 'HOLD',
  recommendedHoldDays: 14,
  expectedPeakPrice: 2780,
  expectedProfitGainPerQtl: 240,
  confidence: 94.2,
  reason: 'Strong export demand from MENA region, reduced unseasonal crop arrivals in Central India, and high flour mill restocking demand.',
  points: [
    { day: 'Today', price: 2540, low: 2530, high: 2550 },
    { day: '+3 Days', price: 2595, low: 2560, high: 2630 },
    { day: '+7 Days', price: 2660, low: 2610, high: 2710 },
    { day: '+14 Days', price: 2780, low: 2720, high: 2840 },
    { day: '+21 Days', price: 2750, low: 2680, high: 2820 },
    { day: '+30 Days', price: 2710, low: 2630, high: 2790 },
  ]
};

export const LEAF_DISEASES_DB: Record<string, DiseaseInfo> = {
  wheat_rust: {
    id: 'dis_01',
    crop: 'Wheat',
    name: 'Yellow / Stripe Rust (Puccinia striiformis)',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    pathogenType: 'Fungal',
    confidence: 97.6,
    severity: 'Moderate',
    symptoms: [
      'Bright yellow elongated pustules forming linear stripes along leaf veins',
      'Yellow chlorotic powder rubbing off on fingers',
      'Premature leaf senescence causing 25-40% yield drop'
    ],
    chemicalTreatment: 'Propiconazole 25% EC (Tilt) @ 1 ml/Litre of water OR Tebuconazole 25.9% EC @ 1.2 ml/Litre. Spray immediately in calm weather.',
    organicTreatment: 'Bio-fungicide Trichoderma viride @ 5g/Litre + 5% Panchagavya spray at 10-day intervals. Cow urine (10%) fermented with neem leaves.',
    preventiveMeasures: 'Plant rust-resistant varieties like DBW-187, DBW-303, PBW-725. Avoid excessive urea application.'
  },
  tomato_blight: {
    id: 'dis_02',
    crop: 'Tomato',
    name: 'Early Blight (Alternaria solani)',
    scientificName: 'Alternaria solani',
    pathogenType: 'Fungal',
    confidence: 95.8,
    severity: 'Severe',
    symptoms: [
      'Dark brown to black concentric target-board spots on older leaves',
      'Stem cankers with dark sunken rings',
      'Yellow chlorotic halos surrounding necrotic lesions'
    ],
    chemicalTreatment: 'Mancozeb 75% WP @ 2.5 g/Litre or Chlorothalonil 75% WP @ 2 g/Litre. If severe, alternate with Azoxystrobin + Difenoconazole @ 1 ml/L.',
    organicTreatment: 'Copper Hydroxide organic suspension or spray Bacillus subtilis @ 4g/L. Drench soil with Jeevamrit.',
    preventiveMeasures: 'Prune lower foliage touching soil. Use drip irrigation instead of overhead sprinklers. Ensure crop rotation.'
  },
  cotton_curl: {
    id: 'dis_03',
    crop: 'Cotton',
    name: 'Cotton Leaf Curl Virus (CLCuV)',
    scientificName: 'Begomovirus (Whitefly vector)',
    pathogenType: 'Viral',
    confidence: 93.4,
    severity: 'Severe',
    symptoms: [
      'Upward and downward curling of leaf margins',
      'Thickening and enation (leaf-like outgrowths) on underside of veins',
      'Severe stunting of plant and boll dropping'
    ],
    chemicalTreatment: 'No chemical cures virus directly; control Whitefly vector using Diafenthiuron 50% WP @ 1.2 g/L or Spiromesifen 22.9% SC @ 1 ml/L.',
    organicTreatment: 'Yellow sticky traps @ 20 traps/acre. Spray 5% Neem Seed Kernel Extract (NSKE) or Agniastra every 7 days.',
    preventiveMeasures: 'Eradicate weed hosts (Kangi buti / Abutilon indicum). Grow tolerant Bt cotton hybrids.'
  },
  healthy_leaf: {
    id: 'dis_04',
    crop: 'Paddy / Wheat / Corn',
    name: 'Healthy Crop Foliage - No Pathogens Detected',
    scientificName: 'Chlorophyll Optimal Index',
    pathogenType: 'Nutrient Deficiency',
    confidence: 99.1,
    severity: 'Mild',
    symptoms: [
      'Vibrant deep green foliage with uniform chlorophyll distribution',
      'Intact turgor pressure and cell wall integrity',
      'No fungal pustules, bacterial ooze, or viral mosaics visible'
    ],
    chemicalTreatment: 'Maintain standard foliar nutrition. No curative fungicide required.',
    organicTreatment: 'Apply compost tea or Jeevamrit as preventive immune booster every 15 days.',
    preventiveMeasures: 'Continue micro-irrigation scheduling and scout fields twice a week.'
  }
};

export const MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'list_101',
    farmerName: 'Balwinder Singh Dhillon',
    farmerLocation: 'Sangrur, Punjab',
    crop: 'Sharbati Wheat (Grade A)',
    variety: 'DBW-187 Certified Organic',
    quantityAvailableQuintals: 450,
    minOrderQuintals: 50,
    pricePerQuintal: 2580,
    harvestDate: 'April 2026',
    qualityGrade: 'A+ Export Grade',
    isOrganicCertified: true,
    bidsCount: 7,
    currentHighestBid: 2610,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'list_102',
    farmerName: 'Dattatray Shinde',
    farmerLocation: 'Niphad, Nashik, Maharashtra',
    crop: 'Garwa Red Onion',
    variety: 'Nashik Gulabi (Long Shelf Life)',
    quantityAvailableQuintals: 800,
    minOrderQuintals: 100,
    pricePerQuintal: 2180,
    harvestDate: 'March 2026',
    qualityGrade: 'Grade A Premium',
    isOrganicCertified: false,
    bidsCount: 14,
    currentHighestBid: 2240,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'list_103',
    farmerName: 'Venkat Reddy',
    farmerLocation: 'Guntur, Andhra Pradesh',
    crop: 'Teja Dry Red Chilli',
    variety: 'Hot Teja SHU 75000',
    quantityAvailableQuintals: 120,
    minOrderQuintals: 20,
    pricePerQuintal: 19400,
    harvestDate: 'February 2026',
    qualityGrade: 'A+ Export Grade',
    isOrganicCertified: true,
    bidsCount: 9,
    currentHighestBid: 19850,
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'list_104',
    farmerName: 'Hardik Patel',
    farmerLocation: 'Surendranagar, Gujarat',
    crop: 'Shankar-6 Raw Cotton',
    variety: 'Long Staple 29mm',
    quantityAvailableQuintals: 350,
    minOrderQuintals: 50,
    pricePerQuintal: 7450,
    harvestDate: 'January 2026',
    qualityGrade: 'Grade A Premium',
    isOrganicCertified: false,
    bidsCount: 5,
    currentHighestBid: 7520,
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80',
  }
];

export const FREIGHT_BOOKINGS: FreightBooking[] = [
  {
    id: 'fb_901',
    fromMandi: 'Khanna Mandi, Punjab',
    toLocation: 'Vashi APMC, Mumbai',
    distanceKm: 1480,
    crop: 'Sharbati Wheat (25 MT)',
    weightTons: 25,
    pickupDate: 'Tomorrow, 08:00 AM',
    rateOffer: 82000,
    status: 'Open for Bidding',
    truckType: '14 Wheeler (25T)',
    fuelEstimateLiters: 410,
    tollEstimate: 6400,
  },
  {
    id: 'fb_902',
    fromMandi: 'Lasalgaon Mandi, Nashik',
    toLocation: 'Azadpur Mandi, Delhi',
    distanceKm: 1180,
    crop: 'Nashik Red Onion (15 MT)',
    weightTons: 15,
    pickupDate: 'Today, 06:00 PM',
    rateOffer: 54000,
    status: 'Assigned',
    truckType: 'Reefer AC (15T)',
    fuelEstimateLiters: 320,
    tollEstimate: 5100,
  },
  {
    id: 'fb_903',
    fromMandi: 'Guntur Chilli Market',
    toLocation: 'JNPT Port Mumbai (Export Load)',
    distanceKm: 980,
    crop: 'Guntur Dry Chilli (12 MT)',
    weightTons: 12,
    pickupDate: 'In 2 Days',
    rateOffer: 46000,
    status: 'Open for Bidding',
    truckType: 'Tata 407 (3.5T)',
    fuelEstimateLiters: 260,
    tollEstimate: 4200,
  }
];

export const FORUM_POSTS: ForumPost[] = [
  {
    id: 'post_1',
    author: 'Harpreet Singh Sandhu',
    role: 'Wheat Farmer (Punjab)',
    state: 'Ferozepur, Punjab',
    timeAgo: '2 hours ago',
    title: 'Yellow rust appearing in patches on DBW-187 - What is the emergency treatment?',
    content: 'Noticed small yellow powdery stripes on lower leaves in my 5-acre wheat plot after yesterday’s fog and temperature fluctuation. Should I spray Tilt immediately or wait for sunny weather?',
    cropTag: 'Wheat',
    upvotes: 38,
    repliesCount: 6,
    expertAnswered: true,
    expertAnswer: {
      expertName: 'Dr. Rameshwar Patil (Ph.D. Agronomy)',
      designation: 'Senior ICAR Krishi Vigyan Kendra Scientist',
      answer: 'Sardar ji, spray Propiconazole 25% EC (Tilt) @ 1ml per litre water without delay today itself once the morning dew evaporates. Ensure 200 Litres water per acre for thorough leaf coverage.',
      date: '1 hour ago',
    }
  },
  {
    id: 'post_2',
    author: 'Santosh Jadhav',
    role: 'Onion Grower',
    state: 'Ahmednagar, Maharashtra',
    timeAgo: '5 hours ago',
    title: 'Will onion prices touch ₹30/kg in April? Sell advisor vs storage chawl dilemma.',
    content: 'My Rabi onion harvest has yielded 350 quintals. Lasalgaon rate is currently ₹21.50. Is it worthwhile storing in ventilated kanda chawl for 60 days considering 15% weight loss?',
    cropTag: 'Onion',
    upvotes: 54,
    repliesCount: 12,
    expertAnswered: true,
    expertAnswer: {
      expertName: 'Sunil Kumar (Commodity Analyst)',
      designation: 'NCDEX Agri Head',
      answer: 'KisanSetu AI multi-horizon forecast projects Lasalgaon modal prices to cross ₹28.50 by late April due to delayed southern sowing. Net gain after 12% dehydration loss is positive by ~₹340/quintal.',
      date: '3 hours ago',
    }
  },
  {
    id: 'post_3',
    author: 'Venkatesh Babu',
    role: 'Chilli Farmer',
    state: 'Warangal, Telangana',
    timeAgo: '1 day ago',
    title: 'Black Thrips control using bio-pesticides in flowering stage.',
    content: 'Has anyone tried Spinetoram combined with organic neem oil? Want to protect export quality standards without MRL pesticide residue flags.',
    cropTag: 'Chilli',
    upvotes: 42,
    repliesCount: 8,
    expertAnswered: false,
  }
];

export const GOV_SCHEMES = [
  {
    id: 'sch_1',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    benefit: '₹6,000 / year in 3 equal DBT installments',
    status: 'Active',
    eligibility: 'All landholding farmer families across India',
    deadline: 'Ongoing Open Registration',
    appliedCount: '11.8 Crore Farmers',
    disbursedTotal: '₹2.81 Lakh Crore',
  },
  {
    id: 'sch_2',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    benefit: 'Comprehensive crop loss insurance @ 1.5% - 2% premium',
    status: 'Open for Rabi 2025-26',
    eligibility: 'All farmers growing notified crops in notified areas',
    deadline: '31 March 2026',
    appliedCount: '3.4 Crore Farmers',
    disbursedTotal: '₹1.5 Lakh Crore Claims Paid',
  },
  {
    id: 'sch_3',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    benefit: 'Up to 50% - 80% subsidy on Tractors, Laser Levellers & Drones',
    status: 'Active',
    eligibility: 'Small & marginal farmers, FPOs, Women SHGs',
    deadline: '15 April 2026',
    appliedCount: '8.2 Lakh Equipment Distributed',
    disbursedTotal: '₹6,400 Crore',
  },
  {
    id: 'sch_4',
    name: 'Soil Health Card & Nano Fertilizer Subsidy',
    benefit: 'Free GPS soil micro-nutrient testing + 20% discount on Nano Urea',
    status: 'Active',
    eligibility: 'All registered farmers via KisanSetu AI Soil Scan',
    deadline: 'Year Round',
    appliedCount: '23 Crore Cards Issued',
    disbursedTotal: '100% Centrally Sponsored',
  }
];
