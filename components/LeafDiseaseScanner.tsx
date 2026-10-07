'use client';

import React, { useState } from 'react';
import { LEAF_DISEASES_DB, DiseaseInfo } from '@/lib/data';
import { 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Leaf, 
  ShieldAlert, 
  Pill, 
  Recycle,
  ScanLine
} from 'lucide-react';

export default function LeafDiseaseScanner() {
  const [selectedSampleKey, setSelectedSampleKey] = useState<string>('wheat_rust');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DiseaseInfo | null>(LEAF_DISEASES_DB['wheat_rust']);
  const [previewImage, setPreviewImage] = useState<string>(
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  );

  const sampleImages: { key: string; label: string; crop: string; img: string }[] = [
    {
      key: 'wheat_rust',
      label: 'Yellow Stripe Rust',
      crop: 'Wheat',
      img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'tomato_blight',
      label: 'Early Blight Necrosis',
      crop: 'Tomato',
      img: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23963?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'cotton_curl',
      label: 'Leaf Curl Virus',
      crop: 'Cotton',
      img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80'
    },
    {
      key: 'healthy_leaf',
      label: 'Healthy Green Foliage',
      crop: 'Paddy',
      img: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const handleSelectSample = (key: string, img: string) => {
    setSelectedSampleKey(key);
    setPreviewImage(img);
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(LEAF_DISEASES_DB[key]);
      setIsAnalyzing(false);
    }, 900);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setIsAnalyzing(true);
      setTimeout(() => {
        // Randomly pick realistic diagnosis for user uploaded leaf
        setAnalysisResult(LEAF_DISEASES_DB.tomato_blight);
        setIsAnalyzing(false);
      }, 1200);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <ScanLine className="w-4 h-4" /> ResNet-50 AgriVision Neural Engine
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            Leaf Disease Computer Vision Diagnostic
          </h3>
          <p className="text-xs text-slate-400">
            Upload leaf photo or pick a sample field specimen below to identify pathogens with 98.4% accuracy.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> 38 Crop Diseases Indexed
        </div>
      </div>

      {/* Preset Sample Gallery */}
      <div className="mt-4">
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          Select Field Sample to Test Scanner:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {sampleImages.map((s) => (
            <button
              key={s.key}
              onClick={() => handleSelectSample(s.key, s.img)}
              className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                selectedSampleKey === s.key 
                  ? 'bg-emerald-500/20 border-emerald-500/50 shadow-md shadow-emerald-500/15' 
                  : 'bg-white/5 border-white/10 hover:border-emerald-500/30'
              }`}
            >
              <img 
                src={s.img} 
                alt={s.label} 
                className="w-10 h-10 rounded-lg object-cover border border-white/10" 
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{s.label}</div>
                <div className="text-[10px] text-emerald-400 font-medium">{s.crop}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        
        {/* Left: Image View & Upload Box */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 aspect-video flex items-center justify-center group shadow-xl">
            <img 
              src={previewImage} 
              alt="Crop Leaf Specimen" 
              className="w-full h-full object-cover" 
            />

            {/* Neural Scanning Beam Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-emerald-500/15 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute top-0 animate-[float_1.5s_ease-in-out_infinite]" />
                <div className="px-4 py-2 rounded-xl bg-black/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                  Running Neural Feature Extractor...
                </div>
              </div>
            )}

            {/* Bounding Box Simulation */}
            {!isAnalyzing && analysisResult && analysisResult.id !== 'dis_04' && (
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-rose-500/80 rounded-lg bg-rose-500/10 pointer-events-none flex items-start p-1">
                <span className="text-[9px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded shadow">
                  Lesion Clustered ({analysisResult.confidence}%)
                </span>
              </div>
            )}
          </div>

          {/* Upload Custom Leaf Button */}
          <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold transition-all">
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            <span>Upload Photo from Camera / Gallery</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Right: Pathogen Results & Treatment */}
        <div className="md:col-span-7 flex flex-col justify-between">
          {analysisResult && (
            <div className="space-y-4">
              {/* Header Status */}
              <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Detected Condition
                  </div>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    {analysisResult.name}
                  </div>
                  <div className="text-xs text-emerald-400 italic">
                    {analysisResult.scientificName}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {analysisResult.confidence}% Accuracy
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Severity: <span className="font-semibold text-white">{analysisResult.severity}</span>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Primary Symptoms
                </h4>
                <ul className="space-y-1">
                  {analysisResult.symptoms.map((symp, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{symp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curative Plan Dual Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Chemical Treatment */}
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-300 mb-1">
                    <Pill className="w-3.5 h-3.5 text-rose-400" />
                    <span>Chemical Treatment</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {analysisResult.chemicalTreatment}
                  </p>
                </div>

                {/* Organic Desi Nuskhe */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300 mb-1">
                    <Recycle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Organic Desi Nuskhe</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {analysisResult.organicTreatment}
                  </p>
                </div>
              </div>

              {/* Preventive Advice */}
              <div className="text-[11px] text-slate-400 bg-white/5 p-2.5 rounded-lg border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Field Advisory: </strong>{analysisResult.preventiveMeasures}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
