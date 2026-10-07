'use client';

import React, { useState } from 'react';
import { Sparkles, X, Bot, Sprout } from 'lucide-react';
import KisanGptChat from './KisanGptChat';

export default function FloatingKisanAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Floating AI Kisan Intelligence Orb ─────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Helper tooltip pill */}
        {!isOpen && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-[#DCE8D8] text-[#2E7D4F] text-xs font-semibold shadow-lg shadow-[#183326]/8 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-[#D7A83E]" />
            <span>AI Kisan Assistant</span>
            <span className="w-2 h-2 rounded-full bg-[#4CAF70]" />
          </div>
        )}

        {/* The Orb Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Kisan Assistant"
          className="relative group w-14 h-14 rounded-full flex items-center justify-center focus:outline-none transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Rotating Leaf Ring */}
          <div className="absolute inset-0 rounded-full border border-[#2E7D4F]/35 animate-orbit-ring pointer-events-none">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#4CAF70] shadow-[0_0_6px_#4CAF70]" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D7A83E] shadow-[0_0_6px_#D7A83E]" />
          </div>

          {/* Ambient Glow */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[#2E7D4F]/25 via-[#4CAF70]/20 to-[#D7A83E]/20 blur-md group-hover:blur-lg transition-all" />

          {/* Central Core */}
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#1e5535] via-[#2E7D4F] to-[#4CAF70] border border-[#4CAF70]/40 flex items-center justify-center shadow-lg shadow-[#2E7D4F]/30 animate-breathing-orb">
            {isOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Bot className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D7A83E]" />
              </div>
            )}
          </div>
        </button>
      </div>

      {/* ── Chat Window ─────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[460px] sm:h-[620px] z-50 flex flex-col p-2 sm:p-0">
          {/* Mobile backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="sm:hidden absolute inset-0 bg-[#183326]/40 backdrop-blur-sm"
          />

          <div className="relative flex-1 flex flex-col glass-panel rounded-3xl border border-[#DCE8D8] shadow-2xl shadow-[#183326]/12 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[#DCE8D8] bg-[#F3F8F1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#E7F3E5] border border-[#DCE8D8] flex items-center justify-center text-[#2E7D4F]">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#183326] flex items-center gap-1.5" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    KisanGPT{' '}
                    <span className="text-[10px] font-semibold text-[#2E7D4F] px-1.5 py-0.5 rounded-full bg-[#E7F3E5] border border-[#DCE8D8]">
                      AI Agri-Expert
                    </span>
                  </h3>
                  <p className="text-[10px] text-[#607568]">Live Crop Diagnosis · Mandi Timing · Agronomy</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[#607568] hover:text-[#183326] hover:bg-[#E7F3E5] transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Embedded Chat */}
            <div className="flex-1 overflow-hidden">
              <KisanGptChat />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
