'use client';

import React from 'react';
import { MANDI_PRICES } from '@/lib/data';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';

export default function MandiTicker() {
  return (
    <div className="w-full bg-[#08110b] border-y border-emerald-500/15 py-2.5 overflow-hidden flex items-center">
      {/* Live Badge indicator */}
      <div className="flex items-center gap-1.5 px-3 py-0.5 ml-4 bg-emerald-500/10 border border-emerald-500/25 rounded-md text-[11px] font-bold text-emerald-400 shrink-0 z-10">
        <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
        <span>APMC LIVE</span>
      </div>

      {/* Ticker Content */}
      <div className="flex overflow-hidden whitespace-nowrap mask-gradient">
        <div className="flex gap-8 items-center animate-marquee">
          {MANDI_PRICES.concat(MANDI_PRICES).map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-2 text-xs font-medium">
              <span className="text-slate-300 font-semibold">{item.commodity}</span>
              <span className="text-slate-400 text-[11px]">({item.mandi})</span>
              <span className="text-white font-mono font-bold">₹{item.modalPrice.toLocaleString()}</span>
              <span className={`flex items-center text-[11px] font-semibold ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
              </span>
              <span className="text-slate-600">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
