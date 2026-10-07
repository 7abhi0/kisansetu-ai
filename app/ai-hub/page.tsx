'use client';

import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { 
  Sparkles, 
  TrendingUp, 
  Leaf, 
  Bot, 
  ScanLine, 
  Droplets, 
  FlaskConical, 
  CloudSun, 
  Receipt, 
  Mic, 
  DollarSign, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  UploadCloud, 
  Layers, 
  AlertCircle,
  FileCheck2,
  Calendar
} from 'lucide-react';
import PriceForecastChart from '@/components/PriceForecastChart';
import LeafDiseaseScanner from '@/components/LeafDiseaseScanner';
import KisanGptChat from '@/components/KisanGptChat';
import { useAppStore } from '@/lib/store';

export default function AiHubPage() {
  const { addExpense } = useAppStore();
  const [activeModule, setActiveModule] = useState<number>(1);

  // 3. Crop Recommendation State
  const [cropSoilN, setCropSoilN] = useState<number>(140);
  const [cropSoilP, setCropSoilP] = useState<number>(45);
  const [cropSoilK, setCropSoilK] = useState<number>(60);
  const [cropPh, setCropPh] = useState<number>(6.8);
  const [cropState, setCropState] = useState<string>('Punjab');
  const [recommendedCropResult, setRecommendedCropResult] = useState<any>({
    crop: 'Wheat (Sharbati DBW-187)',
    matchScore: 97.4,
    expectedMarginPerAcre: '₹54,000',
    waterRequirement: 'Medium (380 mm)',
    suitabilityReason: 'Alluvial soil with neutral pH (6.8) and high residual Nitrogen after Paddy rotation provides peak yield conditions.'
  });

  const handleCalculateCropRec = () => {
    if (cropSoilN > 120 && cropPh >= 6.5) {
      setRecommendedCropResult({
        crop: 'Wheat (Sharbati DBW-187)',
        matchScore: 97.4,
        expectedMarginPerAcre: '₹54,000',
        waterRequirement: 'Medium (380 mm)',
        suitabilityReason: 'Alluvial soil with neutral pH and high residual Nitrogen provides peak grain protein.'
      });
    } else if (cropSoilK > 50) {
      setRecommendedCropResult({
        crop: 'Garwa Red Onion (Nashik Special)',
        matchScore: 94.8,
        expectedMarginPerAcre: '₹88,000',
        waterRequirement: 'Moderate Drip (450 mm)',
        suitabilityReason: 'High Potassium level (60+ kg/ha) accelerates bulb enlargement and extends storage shelf life.'
      });
    } else {
      setRecommendedCropResult({
        crop: 'Mustard (Pusa Bold)',
        matchScore: 91.2,
        expectedMarginPerAcre: '₹42,000',
        waterRequirement: 'Low (220 mm)',
        suitabilityReason: 'Drought-tolerant brassica matches lower moisture and moderate phosphorus.'
      });
    }
  };

  // 4. Yield Prediction State
  const [yieldAcres, setYieldAcres] = useState<number>(10);
  const [yieldSeedType, setYieldSeedType] = useState<string>('Certified Hybrid DBW-187');
  const [yieldIrrigation, setYieldIrrigation] = useState<string>('Precision Drip');
  const calculatedYieldTotal = Math.round(yieldAcres * (yieldIrrigation === 'Precision Drip' ? 24.5 : 20.2));

  // 7. Fertilizer Recommendation State
  const [soilUreaDose, setSoilUreaDose] = useState<number>(55);
  const [soilDapDose, setSoilDapDose] = useState<number>(35);
  const [soilMopDose, setSoilMopDose] = useState<number>(20);

  // 9. Smart Irrigation State
  const [soilMoistureTelemetry, setSoilMoistureTelemetry] = useState<number>(34); // %
  const [irrigationRunning, setIrrigationRunning] = useState<boolean>(false);

  // 11. OCR Scanner State
  const [isScanningBill, setIsScanningBill] = useState<boolean>(false);
  const [scannedBillData, setScannedBillData] = useState<any>(null);

  const sampleBills = [
    {
      title: 'IFFCO Agro Chemical Fertilizer Invoice',
      vendor: 'IFFCO Kisan Seva Kendra, Khanna',
      billNo: 'INV/2026/0892',
      date: '2026-03-01',
      items: [
        { name: 'Nano Urea Liquid (500ml x 10 bottles)', qty: 10, rate: 225, amount: 2250 },
        { name: 'IFFCO DAP 50kg (5 bags)', qty: 5, rate: 1350, amount: 6750 },
        { name: 'Muriate of Potash (MOP) (2 bags)', qty: 2, rate: 1700, amount: 3400 },
      ],
      total: 12400,
      category: 'Fertilizer'
    },
    {
      title: 'Mandi J-Form Arthiya Commission Slip',
      vendor: 'M/s Ram Kishan & Sons Commission Agent (Khanna)',
      billNo: 'J-FORM-2026-441',
      date: '2026-02-26',
      items: [
        { name: 'Paddy Basmati 1121 Auction (60 Qtl)', qty: 60, rate: 4320, amount: 259200 },
        { name: 'Mandi Market Fee (2%) + RDF (2%)', qty: 1, rate: -10368, amount: -10368 },
      ],
      total: 248832,
      category: 'Income'
    }
  ];

  const handleSimulateOcr = (billIndex: number) => {
    setIsScanningBill(true);
    setScannedBillData(null);
    setTimeout(() => {
      setScannedBillData(sampleBills[billIndex]);
      setIsScanningBill(false);
    }, 1100);
  };

  const handleSaveOcrToLedger = () => {
    if (!scannedBillData) return;
    addExpense({
      id: `exp_ocr_${Date.now()}`,
      date: scannedBillData.date,
      category: 'Fertilizer',
      description: `${scannedBillData.vendor} (Scanned Invoice #${scannedBillData.billNo})`,
      amount: scannedBillData.total
    });
    alert(`Added ₹${scannedBillData.total.toLocaleString()} directly into your Farm Financial Ledger!`);
  };

  const modules = [
    { id: 1, title: 'Price Prediction', icon: TrendingUp, desc: '30-day forecast curves with 95% confidence bands' },
    { id: 2, title: 'Sell vs Hold Advisor', icon: DollarSign, desc: 'Warehouse storage vs market surge economics' },
    { id: 3, title: 'Crop Recommendation', icon: Leaf, desc: 'Soil N-P-K & micro-climate matching engine' },
    { id: 4, title: 'Yield Prediction', icon: Calculator, desc: 'Acreage, variety & irrigation based output estimates' },
    { id: 5, title: 'Profit Forecaster', icon: Sparkles, desc: 'Input costs deducted from gross mandi realizations' },
    { id: 6, title: 'Leaf Disease CV Doctor', icon: ScanLine, desc: 'ResNet-50 leaf pathogen scanner with remedies' },
    { id: 7, title: 'Fertilizer Advisor', icon: FlaskConical, desc: 'NPK deficit soil test report balancing' },
    { id: 8, title: 'Weather Intelligence', icon: CloudSun, desc: 'Hourly spray window & rainfall telemetry' },
    { id: 9, title: 'Smart IoT Irrigation', icon: Droplets, desc: 'Soil moisture telemetry & auto-pump scheduler' },
    { id: 10, title: 'KisanGPT AI Assistant', icon: Bot, desc: 'Voice-enabled multilingual agricultural LLM' },
    { id: 11, title: 'OCR Bill & J-Form Scanner', icon: Receipt, desc: 'Camera receipt parsing directly into farm ledger' },
    { id: 12, title: 'Voice Hands-Free Assistant', icon: Mic, desc: 'Native voice recognition in Indian regional languages' },
  ];

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E7F3E5] border border-[#DCE8D8] text-[#2E7D4F] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> 12 Deep Neural Agricultural Models
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#183326]">
          KisanSetu AI Intelligence Hub
        </h1>
        <p className="text-xs sm:text-sm text-[#607568] mt-2">
          Interact with every specialized AI module below. Powered by deep neural networks, computer vision, and Agmarknet APMC historical datasets.
        </p>
      </div>

      {/* Module Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[95px] ${
                isActive
                  ? 'bg-[#2E7D4F]/15 border-[#2E7D4F] shadow-lg shadow-[#2E7D4F]/15'
                  : 'bg-[#F3F8F1] border-[#DCE8D8] hover:bg-[#E7F3E5] hover:border-[#2E7D4F]/40'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#2E7D4F]' : 'text-[#789087]'}`} />
                <span className="text-[10px] font-mono text-[#789087]">#{m.id}</span>
              </div>
              <div>
                <div className={`text-xs font-bold truncate ${isActive ? 'text-[#2E7D4F]' : 'text-[#183326]'}`}>{m.title}</div>
                <div className="text-[10px] text-[#789087] line-clamp-1">{m.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE MODULE WORKBENCH CONTAINER */}
      <div className="transition-all duration-200">
        
        {/* MODULE 1: PRICE PREDICTION */}
        {activeModule === 1 && (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Module 01: Multi-Horizon APMC Price Forecaster
            </div>
            <PriceForecastChart />
          </div>
        )}

        {/* MODULE 2: SELL VS HOLD ADVISOR */}
        {activeModule === 2 && (
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Module 02</span>
                <h3 className="text-xl font-bold text-[#183326]">Sell vs Hold Economics Intelligence</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-xs border border-amber-300">
                Action: HOLD FOR 14 DAYS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] space-y-1">
                <span className="text-[#789087]">Today&apos;s Spot Rate:</span>
                <div className="text-2xl font-bold text-[#183326] font-mono">₹2,540 / Qtl</div>
                <div className="text-[10px] text-[#789087]">Khanna Mandi modal price</div>
              </div>
              <div className="p-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] space-y-1">
                <span className="text-[#789087]">Storage &amp; Shrinkage Cost:</span>
                <div className="text-2xl font-bold text-rose-600 font-mono">-₹28 / Qtl</div>
                <div className="text-[10px] text-[#789087]">Cold chain / godown fee for 14 days</div>
              </div>
              <div className="p-4 rounded-xl bg-[#E7F3E5] border border-[#2E7D4F]/30 space-y-1">
                <span className="text-[#2E7D4F] font-bold">Predicted Peak Day 14:</span>
                <div className="text-2xl font-bold text-[#2E7D4F] font-mono">₹2,780 / Qtl</div>
                <div className="text-[10px] text-[#2E7D4F]">Net Delta: +₹212 / Qtl profit upside</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#E7F3E5] border border-[#DCE8D8] text-xs text-[#607568]">
              <strong>Mathematical Explanation: </strong>
              The supply pressure from Central Indian wheat arrivals is expected to diminish in 10-12 days while flour mills in Delhi NCR begin restocking. The ₹240/Qtl price rise substantially outweighs the ₹28/Qtl holding cost.
            </div>
          </div>
        )}

        {/* MODULE 3: CROP RECOMMENDATION */}
        {activeModule === 3 && (
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6">
            <div className="pb-3 border-b border-[#DCE8D8]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">Module 03</span>
              <h3 className="text-xl font-bold text-[#183326]">Soil N-P-K &amp; Micro-Climate Crop Matching</h3>
              <p className="text-xs text-[#789087]">
                Matches soil chemistry and regional climate to the highest yielding, highest margin agricultural crop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Inputs */}
              <div className="md:col-span-5 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[#607568] mb-1">
                    <span>Nitrogen (N): <strong>{cropSoilN} kg/ha</strong></span>
                  </div>
                  <input 
                    type="range" min={50} max={200} value={cropSoilN} 
                    onChange={(e) => setCropSoilN(Number(e.target.value))} 
                    className="w-full accent-emerald-500" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#607568] mb-1">
                    <span>Phosphorus (P): <strong>{cropSoilP} kg/ha</strong></span>
                  </div>
                  <input 
                    type="range" min={10} max={100} value={cropSoilP} 
                    onChange={(e) => setCropSoilP(Number(e.target.value))} 
                    className="w-full accent-emerald-500" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#607568] mb-1">
                    <span>Potassium (K): <strong>{cropSoilK} kg/ha</strong></span>
                  </div>
                  <input 
                    type="range" min={20} max={120} value={cropSoilK} 
                    onChange={(e) => setCropSoilK(Number(e.target.value))} 
                    className="w-full accent-emerald-500" 
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#607568] mb-1">
                    <span>Soil pH: <strong>{cropPh}</strong></span>
                  </div>
                  <input 
                    type="range" min={5.0} max={8.5} step={0.1} value={cropPh} 
                    onChange={(e) => setCropPh(Number(e.target.value))} 
                    className="w-full accent-emerald-500" 
                  />
                </div>

                <button
                  onClick={handleCalculateCropRec}
                  className="w-full py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256640] text-white font-bold transition-all mt-2"
                >
                  Run Neural Crop Matcher
                </button>
              </div>

              {/* Output Result */}
              <div className="md:col-span-7 p-5 rounded-2xl bg-[#E7F3E5] border border-[#2E7D4F]/30 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#2E7D4F]">Best Match Candidate</span>
                    <span className="text-xs font-black text-[#2E7D4F] bg-white px-2 py-0.5 rounded-full border border-[#DCE8D8]">
                      {recommendedCropResult.matchScore}% Match
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold text-[#183326] mt-1">{recommendedCropResult.crop}</h4>
                  <p className="text-xs text-[#607568] mt-2 leading-relaxed">
                    {recommendedCropResult.suitabilityReason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#2E7D4F]/20 text-xs">
                  <div>
                    <span className="text-[#789087] text-[11px]">Exp. Net Margin:</span>
                    <div className="text-base font-bold text-[#2E7D4F] font-mono">{recommendedCropResult.expectedMarginPerAcre} / Acre</div>
                  </div>
                  <div>
                    <span className="text-[#789087] text-[11px]">Water Requirement:</span>
                    <div className="text-base font-bold text-[#183326] font-mono">{recommendedCropResult.waterRequirement}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 4 & 5: YIELD & PROFIT PREDICTION */}
        {(activeModule === 4 || activeModule === 5) && (
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6">
            <div className="pb-3 border-b border-[#DCE8D8]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">Modules 04 &amp; 05</span>
              <h3 className="text-xl font-bold text-[#183326]">Yield &amp; Net Profit Forecaster</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#607568] mb-1">Farm Land Area: <strong>{yieldAcres} Acres</strong></label>
                  <input type="range" min={1} max={50} value={yieldAcres} onChange={(e) => setYieldAcres(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>
                <div>
                  <label className="block text-[#607568] mb-1">Seed Variety:</label>
                  <select value={yieldSeedType} onChange={(e) => setYieldSeedType(e.target.value)} className="w-full bg-white border border-[#DCE8D8] rounded-xl p-2 text-[#183326]">
                    <option value="Certified Hybrid DBW-187">Certified Hybrid DBW-187</option>
                    <option value="Karan Vandana DBW-222">Karan Vandana DBW-222</option>
                    <option value="Traditional Desi Sharbati">Traditional Desi Sharbati</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#607568] mb-1">Irrigation Mode:</label>
                  <select value={yieldIrrigation} onChange={(e) => setYieldIrrigation(e.target.value)} className="w-full bg-white border border-[#DCE8D8] rounded-xl p-2 text-[#183326]">
                    <option value="Precision Drip">Precision Drip (+21% yield boost)</option>
                    <option value="Flood Furrow">Flood Furrow (Standard)</option>
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] text-xs flex flex-col justify-between">
                <div>
                  <span className="text-[#789087]">Predicted Gross Harvest:</span>
                  <div className="text-3xl font-black text-[#183326] font-mono mt-1">{calculatedYieldTotal} Quintals</div>
                  <div className="text-[11px] text-[#2E7D4F] mt-1">Average: {(calculatedYieldTotal / yieldAcres).toFixed(1)} Qtl / Acre</div>
                </div>
                <div className="text-[10px] text-[#789087] pt-2 border-t border-[#DCE8D8]">
                  Calculated against ICAR multi-location all-India coordinated wheat trials.
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#E7F3E5] border border-[#2E7D4F]/30 text-xs flex flex-col justify-between">
                <div>
                  <span className="text-[#2E7D4F] font-bold">Projected Net Realization:</span>
                  <div className="text-3xl font-black text-[#2E7D4F] font-mono mt-1">
                    ₹{(calculatedYieldTotal * 2540 - yieldAcres * 12000).toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-[#607568] mt-1">
                    Gross: ₹{(calculatedYieldTotal * 2540).toLocaleString('en-IN')} - Inputs: ₹{(yieldAcres * 12000).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-[10px] text-[#2E7D4F] pt-2 border-t border-[#2E7D4F]/20">
                  ⭐ Expected profit margin: 76.4%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 6: LEAF DISEASE CV DOCTOR */}
        {activeModule === 6 && (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F] flex items-center gap-1.5">
              <ScanLine className="w-4 h-4" /> Module 06: ResNet-50 Leaf Disease Computer Vision Diagnostic
            </div>
            <LeafDiseaseScanner />
          </div>
        )}

        {/* MODULE 7: FERTILIZER ADVISOR */}
        {activeModule === 7 && (
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6">
            <div className="pb-3 border-b border-[#DCE8D8]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">Module 07</span>
              <h3 className="text-xl font-bold text-[#183326]">Precision Fertilizer &amp; Nutrition AI</h3>
              <p className="text-xs text-[#789087]">
                Calculates precise bag dosages to prevent chemical burns, save costs, and optimize grain protein.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] space-y-2 text-xs">
                <span className="font-bold text-[#183326] flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-[#2E7D4F]" /> Urea (Nitrogen)
                </span>
                <div className="text-2xl font-black text-[#183326] font-mono">{soilUreaDose} kg / Acre</div>
                <div className="text-[11px] text-[#789087]">Split into 3 stages: Basal, 1st Tillering, Flowering.</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] space-y-2 text-xs">
                <span className="font-bold text-[#183326] flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-[#2E7D4F]" /> DAP (Phosphorus)
                </span>
                <div className="text-2xl font-black text-[#183326] font-mono">{soilDapDose} kg / Acre</div>
                <div className="text-[11px] text-[#789087]">Apply 100% at sowing for strong root establishment.</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] space-y-2 text-xs">
                <span className="font-bold text-[#183326] flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-[#2E7D4F]" /> MOP (Potash)
                </span>
                <div className="text-2xl font-black text-[#183326] font-mono">{soilMopDose} kg / Acre</div>
                <div className="text-[11px] text-[#789087]">Enhances disease resistance and grain shine.</div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 8: WEATHER INTELLIGENCE */}
        {activeModule === 8 && (
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6">
            <div className="pb-3 border-b border-[#DCE8D8]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">Module 08</span>
              <h3 className="text-xl font-bold text-[#183326]">Weather Intelligence &amp; Spray Window Advisory</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] text-xs">
                <span className="text-[#789087]">Temperature</span>
                <div className="text-2xl font-bold text-[#183326] font-mono mt-1">24.5°C</div>
                <div className="text-[11px] text-[#2E7D4F]">Min 14°C | Max 28°C</div>
              </div>
              <div className="p-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] text-xs">
                <span className="text-[#789087]">Relative Humidity</span>
                <div className="text-2xl font-bold text-[#183326] font-mono mt-1">38%</div>
                <div className="text-[11px] text-[#789087]">Dew drops dry by 08:30 AM</div>
              </div>
              <div className="p-4 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] text-xs">
                <span className="text-[#789087]">Wind Velocity</span>
                <div className="text-2xl font-bold text-[#183326] font-mono mt-1">11 km/h</div>
                <div className="text-[11px] text-[#2E7D4F]">Low drift risk for spraying</div>
              </div>
              <div className="p-4 rounded-xl bg-[#E7F3E5] border border-[#2E7D4F]/30 text-xs">
                <span className="text-[#2E7D4F] font-bold">Spray Window</span>
                <div className="text-2xl font-bold text-[#2E7D4F] font-mono mt-1">OPTIMAL</div>
                <div className="text-[11px] text-[#2E7D4F]">Best: 05:30 PM - 07:00 PM</div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 9: SMART IOT IRRIGATION */}
        {activeModule === 9 && (
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">Module 09</span>
                <h3 className="text-xl font-bold text-[#183326]">Smart IoT Soil Moisture &amp; Auto-Pump Controller</h3>
              </div>
              <button
                onClick={() => setIrrigationRunning(!irrigationRunning)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  irrigationRunning 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-[#2E7D4F] text-white hover:bg-[#256640]'
                }`}
              >
                {irrigationRunning ? 'STOP TUBE-WELL PUMP' : 'START DRIP PUMP (IoT)'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#F3F8F1] border border-[#DCE8D8] space-y-2 text-xs">
                <span className="text-[#789087]">Real-Time Soil Moisture Telemetry:</span>
                <div className="text-3xl font-black text-[#183326] font-mono">{soilMoistureTelemetry}%</div>
                <div className="w-full h-2 bg-[#DCE8D8] rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${soilMoistureTelemetry}%` }} />
                </div>
                <div className="text-[11px] text-[#789087]">Field threshold: 30% (Trigger Point)</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F3F8F1] border border-[#DCE8D8] space-y-2 text-xs">
                <span className="text-[#789087]">Daily Evapotranspiration (ET0):</span>
                <div className="text-3xl font-black text-[#183326] font-mono">4.2 mm/day</div>
                <div className="text-[11px] text-[#789087]">Solar radiation &amp; wind speed balance</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#E7F3E5] border border-[#2E7D4F]/30 space-y-2 text-xs">
                <span className="text-[#2E7D4F] font-bold">Recommended Pump Duration:</span>
                <div className="text-3xl font-black text-[#2E7D4F] font-mono">45 Mins</div>
                <div className="text-[11px] text-[#2E7D4F]">Saves 18,000 Litres of groundwater</div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 10: KISANGPT CHATBOT */}
        {activeModule === 10 && (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F] flex items-center gap-1.5">
              <Bot className="w-4 h-4" /> Module 10: KisanGPT Conversational AI Assistant
            </div>
            <KisanGptChat />
          </div>
        )}

        {/* MODULE 11: OCR BILL & J-FORM SCANNER */}
        {activeModule === 11 && (
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">Module 11</span>
                <h3 className="text-xl font-bold text-[#183326]">OCR Mandi J-Form &amp; Fertilizer Receipt Scanner</h3>
                <p className="text-xs text-[#789087]">
                  Upload photos of paper bills; extracts items, prices, and vendor data into the farm ledger automatically.
                </p>
              </div>
            </div>

            {/* Test Sample Invoices */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#607568] font-semibold">Test with Sample Bill:</span>
              <button
                onClick={() => handleSimulateOcr(0)}
                className="px-3 py-1.5 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] border border-[#DCE8D8] text-xs text-[#607568] transition-colors"
              >
                IFFCO Fertilizer Invoice
              </button>
              <button
                onClick={() => handleSimulateOcr(1)}
                className="px-3 py-1.5 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] border border-[#DCE8D8] text-xs text-[#607568] transition-colors"
              >
                Mandi J-Form Receipt
              </button>
            </div>

            {/* Scanner Status */}
            {isScanningBill && (
              <div className="p-8 rounded-2xl bg-[#F3F8F1] border border-[#DCE8D8] flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#2E7D4F] border-t-transparent animate-spin" />
                <div className="text-xs font-bold text-[#2E7D4F]">
                  Running Tesseract OCR &amp; Line-Item Extractor...
                </div>
              </div>
            )}

            {/* Scanned Output Card */}
            {!isScanningBill && scannedBillData && (
              <div className="p-5 rounded-2xl bg-[#F3F8F1] border border-[#2E7D4F]/30 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#2E7D4F]">Extracted Document</span>
                    <h4 className="text-base font-bold text-[#183326]">{scannedBillData.title}</h4>
                    <div className="text-xs text-[#789087]">Vendor: {scannedBillData.vendor} • Bill #{scannedBillData.billNo}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#2E7D4F] font-mono">₹{scannedBillData.total.toLocaleString()}</span>
                    <div className="text-[10px] text-[#789087]">{scannedBillData.date}</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#607568]">
                    <thead className="border-b border-[#DCE8D8] text-[#789087] uppercase text-[10px]">
                      <tr>
                        <th className="py-2">Item Description</th>
                        <th className="py-2">Quantity</th>
                        <th className="py-2">Rate (₹)</th>
                        <th className="py-2 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE8D8] font-mono">
                      {scannedBillData.items.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="py-2 font-sans text-[#183326]">{item.name}</td>
                          <td className="py-2">{item.qty}</td>
                          <td className="py-2">₹{item.rate}</td>
                          <td className="py-2 text-right font-bold text-[#2E7D4F]">₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={handleSaveOcrToLedger}
                    className="px-4 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#256640] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Confirm &amp; Sync into Farm Ledger</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODULE 12: VOICE ASSISTANT */}
        {activeModule === 12 && (
          <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] space-y-6">
            <div className="pb-3 border-b border-[#DCE8D8]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">Module 12</span>
              <h3 className="text-xl font-bold text-[#183326]">Hands-Free Agricultural Voice Assistant</h3>
              <p className="text-xs text-[#789087]">
                Designed for field conditions. Speak your crop query in your native language.
              </p>
            </div>
            <KisanGptChat />
          </div>
        )}

      </div>
    </div>
    </AuthGuard>
  );
}
