'use client';

import React, { useState } from 'react';
import { PRICE_FORECAST_DATA } from '@/lib/data';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PriceForecastChart() {
  const [activeRange, setActiveRange] = useState<'3d' | '7d' | '14d' | '30d'>('14d');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const points = PRICE_FORECAST_DATA.points;
  const minVal = 2450;
  const maxVal = 2900;
  const range = maxVal - minVal;

  const width = 640;
  const height = 240;
  const paddingX = 45;
  const paddingY = 30;

  const getX = (index: number) => paddingX + (index / (points.length - 1)) * (width - 2 * paddingX);
  const getY = (val: number) => height - paddingY - ((val - minVal) / range) * (height - 2 * paddingY);

  // Generate SVG path for main forecast curve
  const pathD = points.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(pt.price);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Generate SVG path for confidence band
  const highPoints = points.map((pt, i) => `${getX(i)},${getY(pt.high)}`).join(' L ');
  const lowPoints = [...points].reverse().map((pt, i) => `${getX(points.length - 1 - i)},${getY(pt.low)}`).join(' L ');
  const areaD = `M ${highPoints} L ${lowPoints} Z`;

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Neural Forecaster (Multi-Horizon)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              94.2% Confidence
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            {PRICE_FORECAST_DATA.crop}
          </h3>
          <div className="text-xs text-slate-400">
            Base APMC Rate: <span className="text-white font-semibold font-mono">₹{PRICE_FORECAST_DATA.currentPrice}</span> / Quintal
          </div>
        </div>

        {/* Sell / Hold Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-right">
            <div className="text-[10px] font-semibold text-amber-400">AI SIGNAL</div>
            <div className="text-base font-black text-amber-300 flex items-center gap-1 justify-end">
              <span>HOLD FOR 14 DAYS</span>
            </div>
            <div className="text-[10px] text-slate-300">
              Exp. Upside: <span className="text-emerald-400 font-bold">+₹{PRICE_FORECAST_DATA.expectedProfitGainPerQtl}/Qtl</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Chart Graphic */}
      <div className="relative mt-4 w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
            <linearGradient id="bandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.25)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.02)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[2500, 2600, 2700, 2800].map((val) => (
            <g key={val}>
              <line 
                x1={paddingX} 
                y1={getY(val)} 
                x2={width - paddingX} 
                y2={getY(val)} 
                stroke="rgba(255, 255, 255, 0.07)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={paddingX - 8} 
                y={getY(val) + 4} 
                fill="#64748b" 
                fontSize="10" 
                textAnchor="end"
                fontFamily="monospace"
              >
                ₹{val}
              </text>
            </g>
          ))}

          {/* 95% Confidence Band */}
          <path d={areaD} fill="url(#bandGradient)" />

          {/* Forecast Trendline */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="url(#curveGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Data Points */}
          {points.map((pt, i) => {
            const cx = getX(i);
            const cy = getY(pt.price);
            const isHovered = hoveredIndex === i;
            const isPeak = pt.price === PRICE_FORECAST_DATA.expectedPeakPrice;

            return (
              <g 
                key={i} 
                onMouseEnter={() => setHoveredIndex(i)} 
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all"
              >
                {/* Outer halo */}
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isPeak ? 8 : (isHovered ? 7 : 5)} 
                  fill={isPeak ? "#f59e0b" : "#22c55e"} 
                  opacity={0.3} 
                />
                {/* Core dot */}
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isPeak ? 5 : 4} 
                  fill="#ffffff" 
                  stroke={isPeak ? "#f59e0b" : "#16a34a"} 
                  strokeWidth="2.5" 
                />
                {/* X-axis label */}
                <text 
                  x={cx} 
                  y={height - 8} 
                  fill="#94a3b8" 
                  fontSize="10" 
                  textAnchor="middle" 
                  fontWeight="600"
                >
                  {pt.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Peak indicator callout */}
        <div className="absolute top-2 right-12 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40 text-[11px] text-amber-300">
          ⭐ Peak Target: <span className="font-bold font-mono">₹2,780/Qtl</span> (in 14 Days)
        </div>
      </div>

      {/* AI Reasoning Strip */}
      <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-2.5">
        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-emerald-300">Market Intelligence Insight: </span>
          <span className="text-slate-300">{PRICE_FORECAST_DATA.reason}</span>
        </div>
      </div>
    </div>
  );
}
