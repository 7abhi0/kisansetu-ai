'use client';

import React, { useState } from 'react';
import { MANDI_PRICES, MandiPrice } from '@/lib/data';
import { MapPin, Navigation, TrendingUp, DollarSign, Star, Route } from 'lucide-react';

export default function MandiMapViewer() {
  const [selectedMandi, setSelectedMandi] = useState<MandiPrice>(MANDI_PRICES[0]);

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" /> Geospatial Logistics & APMC Discovery
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            Nearby Mandis & Net Realization Explorer
          </h3>
          <p className="text-xs text-slate-400">
            Calculates transport freight cost deducted from modal price to display true net farmer profit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full font-semibold">
            GPS Radar: 250km Radius
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left: Interactive Stylized Map Visualizer */}
        <div className="lg:col-span-7 bg-[#07130b] border border-emerald-500/20 rounded-2xl p-4 relative min-h-[320px] flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Subtle radar / topo mesh lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 agri-grid opacity-30 pointer-events-none" />

          {/* Compass / status overlay */}
          <div className="flex items-center justify-between z-10">
            <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-slate-300 font-mono">
              Base Location: <strong className="text-white">Ludhiana (30.90° N, 75.85° E)</strong>
            </div>
            <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              8 Live Mandis Online
            </div>
          </div>

          {/* Mandi Pins scattered on geographic projection map */}
          <div className="relative h-64 w-full flex items-center justify-center my-auto">
            {MANDI_PRICES.map((m, idx) => {
              const isSelected = selectedMandi.id === m.id;
              // Procedural map coordinates relative to Punjab
              const positions = [
                { top: '38%', left: '46%' }, // Khanna
                { top: '48%', left: '54%' }, // Karnal
                { top: '65%', left: '40%' }, // Alwar
                { top: '75%', left: '30%' }, // Lasalgaon
                { top: '78%', left: '22%' }, // Rajkot
                { top: '85%', left: '60%' }, // Guntur
                { top: '70%', left: '45%' }, // Indore
                { top: '52%', left: '50%' }, // Azadpur
              ];
              const pos = positions[idx % positions.length];

              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMandi(m)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className={`p-1.5 rounded-full border shadow-lg transition-all ${
                    isSelected 
                      ? 'bg-emerald-500 border-white ring-4 ring-emerald-500/40 text-black animate-bounce' 
                      : 'bg-[#0f2416] border-emerald-500/60 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 whitespace-nowrap border shadow-sm ${
                    isSelected 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black' 
                      : 'bg-black/75 text-slate-300 border-white/10 group-hover:border-emerald-500/50'
                  }`}>
                    {m.mandi} (₹{m.modalPrice})
                  </span>
                </button>
              );
            })}

            {/* Farmer Farm Origin Node */}
            <div className="absolute top-[35%] left-[42%] flex flex-col items-center z-20 pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white ring-4 ring-cyan-500/40 flex items-center justify-center animate-pulse" />
              <span className="text-[9px] font-extrabold bg-cyan-950 text-cyan-300 px-1 rounded border border-cyan-500/40 mt-1">
                Your Farm
              </span>
            </div>
          </div>

          {/* Bottom legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-2 z-10">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Your Farm
              <span className="w-2 h-2 rounded-full bg-emerald-400 ml-2" /> APMC Mandi
            </span>
            <span>Click any pin to inspect freight deduction</span>
          </div>
        </div>

        {/* Right: Selected Mandi Financial Breakdown Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Selected Yard</span>
                <h4 className="text-lg font-bold text-white">{selectedMandi.mandi}</h4>
                <div className="text-xs text-emerald-400">{selectedMandi.state} • {selectedMandi.commodity}</div>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-300 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>{selectedMandi.rating}</span>
              </div>
            </div>

            {/* Price Math breakdown */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">APMC Modal Rate:</span>
                <span className="text-white font-mono font-bold">₹{selectedMandi.modalPrice} / Qtl</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Road Distance:</span>
                <span className="text-white font-mono">{selectedMandi.distanceKm} km</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-400 flex items-center gap-1">
                  Estimated Freight Cost:
                </span>
                <span className="text-rose-400 font-mono font-bold">-₹{selectedMandi.transportCostPerQtl} / Qtl</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-emerald-400">Farmer Net Realization</div>
                  <div className="text-xs text-slate-300">In-hand profit per quintal</div>
                </div>
                <div className="text-xl font-black text-emerald-300 font-mono">
                  ₹{selectedMandi.netRealization}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Arrival Today: <strong className="text-white">{selectedMandi.arrivalQuantityTons} MT</strong></span>
              <span>Updated: {selectedMandi.updatedAt}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Navigating to ${selectedMandi.mandi} (${selectedMandi.distanceKm} km). Dispatching route to Transporter network.`)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <Navigation className="w-4 h-4" />
              <span>Book Transport to {selectedMandi.mandi.split(' ')[0]}</span>
            </button>
            <button 
              onClick={() => alert(`Opening official e-NAM Mandi Gate Pass entry for ${selectedMandi.mandi}...`)}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold"
            >
              Gate Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
