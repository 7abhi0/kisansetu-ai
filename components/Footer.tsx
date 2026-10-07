import React from 'react';
import Link from 'next/link';
import { Sprout, PhoneCall, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#DCE8D8] bg-[#EDF4E8] text-[#607568] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#DCE8D8] flex items-center justify-center shadow-sm">
                <Sprout className="w-4 h-4 text-[#2E7D4F]" />
              </div>
              <span className="font-bold text-base text-[#183326]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                KisanSetu <span className="text-[#2E7D4F]">AI</span>
              </span>
            </div>
            <p className="text-[#607568] text-xs leading-relaxed">
              India's premier AI-powered Smart Agriculture ecosystem. Bridging the gap between 140M+ farmers, agricultural scientists, logistics, and APMC markets with deep intelligence.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <a 
                href="tel:1551" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#2E7D4F] border border-[#DCE8D8] hover:bg-[#E7F3E5] transition-all font-semibold shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Kisan Call Centre: 1551</span>
              </a>
            </div>
          </div>

          {/* Col 2: AI Capabilities */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#183326] text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>Deep AI Modules</h4>
            <ul className="space-y-1.5">
              <li><Link href="/ai-hub#kisangpt" className="hover:text-[#2E7D4F] transition-colors">KisanGPT Voice AI</Link></li>
              <li><Link href="/ai-hub#disease-scan" className="hover:text-[#2E7D4F] transition-colors">Leaf Computer Vision Scanner</Link></li>
              <li><Link href="/ai-hub#price-forecaster" className="hover:text-[#2E7D4F] transition-colors">Multi-Horizon Price Predictor</Link></li>
              <li><Link href="/ai-hub#sell-advisor" className="hover:text-[#2E7D4F] transition-colors">Sell vs Hold Decision Intelligence</Link></li>
              <li><Link href="/ai-hub#smart-irrigation" className="hover:text-[#2E7D4F] transition-colors">IoT Smart Irrigation &amp; Telemetry</Link></li>
              <li><Link href="/ai-hub#ocr-scanner" className="hover:text-[#2E7D4F] transition-colors">Mandi J-Form &amp; Bill OCR</Link></li>
            </ul>
          </div>

          {/* Col 3: Ecosystem & Roles */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[#183326] text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>Ecosystem Hubs</h4>
            <ul className="space-y-1.5">
              <li><Link href="/dashboard" className="hover:text-[#2E7D4F] transition-colors">Farmer Operational Console</Link></li>
              <li><Link href="/marketplace" className="hover:text-[#2E7D4F] transition-colors">APMC e-Procurement Board</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#2E7D4F] transition-colors">Transporter Fleet Logistics</Link></li>
              <li><Link href="/community" className="hover:text-[#2E7D4F] transition-colors">Krishi Manch Community</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#2E7D4F] transition-colors">District Agricultural Analytics</Link></li>
              <li><Link href="/auth" className="hover:text-[#2E7D4F] transition-colors">Instant Role Switcher Demo</Link></li>
            </ul>
          </div>

          {/* Col 4: National Mandi Integration */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#183326] text-sm flex items-center gap-1.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <ShieldCheck className="w-4 h-4 text-[#2E7D4F]" />
              e-NAM &amp; APMC Sync
            </h4>
            <p className="text-[#607568] text-xs">
              Live telemetry streaming rates from 1,200+ regulated Mandis including Azadpur, Lasalgaon, Khanna, Guntur, and Vashi.
            </p>
            <div className="p-2.5 rounded-xl bg-white border border-[#DCE8D8] space-y-1 shadow-sm">
              <div className="flex items-center justify-between text-[11px] text-[#607568]">
                <span>Agmarknet API Status:</span>
                <span className="text-[#2E7D4F] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF70] animate-pulse" />
                  Operational
                </span>
              </div>
              <div className="text-[10px] text-[#9BB5A0]">Average Latency: 42ms | 99.98% Uptime</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#DCE8D8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#607568] text-xs">
            © 2026 KisanSetu AI Technologies Pvt Ltd. Built with pride for Indian Agriculture.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#607568]">
            <span className="flex items-center gap-1 text-[#2E7D4F] font-medium">
              <HeartHandshake className="w-3.5 h-3.5" /> Empowering 140M+ Annadatas
            </span>
            <span className="hover:text-[#2E7D4F] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#2E7D4F] cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
