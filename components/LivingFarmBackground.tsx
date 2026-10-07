'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  opacity: number;
  type: 'leaf' | 'petal';
  hue: number;
  windPhase: number; // individual wind phase offset for organic feel
}

export default function LivingFarmBackground() {
  const { theme } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Mouse position only — NO scroll tracking whatsoever
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const isNight = theme === 'dark';

  // Track mouse for very gentle environmental parallax (no scroll)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window === 'undefined') return;
      const pos = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
      mousePosRef.current = pos;
      setMousePos(pos);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas: Slow Falling Leaves & Petals — FULLY TIME-BASED, NO SCROLL COUPLING
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle count — keep it light
    const getParticleCount = () => {
      if (width < 640)  return 4;   // mobile
      if (width < 1024) return 8;   // tablet
      return 13;                    // desktop
    };

    let count = getParticleCount();
    const particles: Particle[] = [];

    const createParticle = (startAtRandom = false): Particle => {
      const isPetal = Math.random() > 0.55;
      return {
        x: Math.random() * width,
        // Spread initial y across viewport so not all start at top
        y: startAtRandom ? Math.random() * height : -20 - Math.random() * 80,
        // VERY SLOW — a leaf should take 6–14 seconds to cross viewport
        vx: (Math.random() - 0.45) * 0.28,
        vy: 0.14 + Math.random() * 0.22,
        size: isPetal ? 5 + Math.random() * 5 : 8 + Math.random() * 10,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.008,   // very slow spin
        opacity: isPetal
          ? 0.18 + Math.random() * 0.28
          : 0.22 + Math.random() * 0.35,
        type: isPetal ? 'petal' : 'leaf',
        hue: isPetal ? 42 : 115,
        windPhase: Math.random() * Math.PI * 2,
      };
    };

    // Seed initial particles spread across viewport
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
      count = getParticleCount();
      while (particles.length < count) particles.push(createParticle(true));
      if (particles.length > count) particles.length = count;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    let lastTime = performance.now();

    const drawLeaf = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.38, p.size, 0, 0, Math.PI * 2);
      // Natural leaf green — not neon
      const leafSat  = isNight ? '55%' : '52%';
      const leafLight = isNight ? '32%' : '40%';
      ctx.fillStyle = `hsla(${p.hue}, ${leafSat}, ${leafLight}, 1)`;
      ctx.fill();
      // Center vein
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.75);
      ctx.lineTo(0, p.size * 0.75);
      ctx.strokeStyle = `hsla(${p.hue}, 60%, 55%, 0.5)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    };

    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.65);
      ctx.bezierCurveTo(
        p.size * 0.48, -p.size * 0.45,
        p.size * 0.48,  p.size * 0.45,
        0,              p.size * 0.65
      );
      ctx.bezierCurveTo(
        -p.size * 0.48,  p.size * 0.45,
        -p.size * 0.48, -p.size * 0.45,
        0,              -p.size * 0.65
      );
      // Soft golden/white petal
      ctx.fillStyle = isNight
        ? `hsla(50, 80%, 60%, 1)`
        : `hsla(48, 85%, 72%, 1)`;
      ctx.fill();
      ctx.restore();
    };

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.08);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle sinusoidal wind — purely time-based, NOT scroll-based
        const windDrift = Math.sin(time * 0.0006 + p.windPhase) * 0.22;

        // Update position — ONLY time/velocity drives movement
        p.x += (p.vx + windDrift) * (dt * 60);
        p.y += p.vy * (dt * 60);
        p.rotation += p.vRot * (dt * 60);

        // Respawn when off-screen
        if (p.y > height + 30) {
          Object.assign(p, createParticle(false));
          p.y = -20;
        }
        if (p.x < -40) p.x = width + 20;
        if (p.x > width + 40) p.x = -20;

        if (p.type === 'leaf') {
          drawLeaf(p);
        } else {
          drawPetal(p);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isNight]);

  // Mouse-only parallax — very subtle, maximum ±10px
  const mouseTiltX = (mousePos.x - 0.5) * 10;
  const mouseTiltY = (mousePos.y - 0.5) * 6;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* ── LAYER 1: MORNING AGRICULTURAL SKY ──────────────────── */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isNight
            ? 'bg-gradient-to-b from-[#030905] via-[#08150c] to-[#040e07]'
            : 'bg-gradient-to-b from-[#FEF9EC] via-[#F0F7EB] to-[#E8F5E0]'
        }`}
      />

      {/* Warm Morning Sunlight Glow — mouse parallax only */}
      <div
        style={{
          transform: `translate(${mouseTiltX * 1.2}px, ${mouseTiltY}px)`,
          transition: 'transform 0.6s ease-out',
        }}
        className={`absolute -top-20 left-1/4 w-[680px] h-[480px] rounded-full blur-[130px] pointer-events-none transition-all duration-1000 ${
          isNight
            ? 'bg-emerald-500/8'
            : 'bg-amber-300/18 mix-blend-multiply animate-sunlight'
        }`}
      />

      {/* Secondary ambient — right side soft emerald */}
      <div
        style={{
          transform: `translate(${-mouseTiltX * 0.6}px, ${mouseTiltY * 0.4}px)`,
          transition: 'transform 0.8s ease-out',
        }}
        className={`absolute top-1/3 -right-20 w-[500px] h-[380px] rounded-full blur-[150px] pointer-events-none ${
          isNight ? 'bg-teal-500/5' : 'bg-emerald-300/14'
        }`}
      />

      {/* ── LAYER 2: DISTANT FARMLAND HILLS — mouse-only parallax ── */}
      {/* NO translateY based on scroll. Only mouse tilt ±6px */}
      <div
        style={{
          transform: `translateX(${mouseTiltX * 0.4}px) translateY(${mouseTiltY * 0.3}px)`,
          transition: 'transform 0.5s ease-out',
        }}
        className="absolute bottom-0 left-0 right-0 h-[260px] sm:h-[320px] pointer-events-none opacity-50"
      >
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor={isNight ? '#0b2616' : '#8EB99A'} stopOpacity="0.55" />
              <stop offset="100%" stopColor={isNight ? '#041008' : '#C8DFCA'} stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="hillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor={isNight ? '#0e311c' : '#6E9E7B'} stopOpacity="0.70" />
              <stop offset="100%" stopColor={isNight ? '#06160c' : '#B4D4B8'} stopOpacity="0.92" />
            </linearGradient>
          </defs>
          {/* Distant hills */}
          <path
            fill="url(#hillGrad1)"
            d="M0,160 C240,110 480,210 720,150 C960,90 1200,190 1440,130 L1440,320 L0,320 Z"
          />
          {/* Nearer rolling fields */}
          <path
            fill="url(#hillGrad2)"
            d="M0,210 C180,180 380,240 600,195 C820,150 1100,230 1440,180 L1440,320 L0,320 Z"
          />
          {/* Silhouetted farm trees */}
          <g fill={isNight ? '#092113' : '#5A8A65'} opacity="0.75">
            <circle cx="210" cy="188" r="16" /><circle cx="225" cy="182" r="19" />
            <circle cx="242" cy="189" r="14" /><rect x="224" y="195" width="4" height="20" />
            <circle cx="890" cy="164" r="18" /><circle cx="910" cy="158" r="22" />
            <circle cx="932" cy="166" r="16" /><rect x="908" y="174" width="5" height="24" />
            <circle cx="1280" cy="195" r="14" /><circle cx="1295" cy="190" r="17" />
            <rect x="1293" y="200" width="3" height="18" />
          </g>
        </svg>
      </div>

      {/* ── LAYER 3: FOREGROUND CROP SILHOUETTES — mouse-only ────── */}
      {/* NO translateY based on scroll. Only mouse tilt ±3px */}
      <div
        style={{
          transform: `translateX(${-mouseTiltX * 0.15}px) translateY(${mouseTiltY * 0.15}px)`,
          transition: 'transform 0.4s ease-out',
        }}
        className="absolute -bottom-4 left-0 right-0 h-24 pointer-events-none flex justify-between items-end px-4 sm:px-12 opacity-35 sm:opacity-50"
      >
        {/* Left: Wind-swaying wheat stalks */}
        <div className="flex items-end gap-1.5 animate-wind-subtle">
          {[36, 52, 44, 60, 48, 64, 56, 40].map((h, idx) => (
            <div
              key={`crop-l-${idx}`}
              style={{
                height: `${h}px`,
                width: '3px',
                borderRadius: '2px',
                background: isNight
                  ? 'linear-gradient(to top, #0f3d20, #70c98a)'
                  : 'linear-gradient(to top, #2E7D4F, #D7A83E)',
                opacity: 0.65 + (idx % 3) * 0.12,
              }}
              className="relative"
            >
              <div
                style={{
                  width: '7px', height: '13px',
                  borderRadius: '50% 50% 20% 20%',
                  background: isNight ? '#70c98a' : '#D7A83E',
                  position: 'absolute',
                  top: '-9px', left: '-2px',
                  transform: `rotate(${idx % 2 === 0 ? 8 : -8}deg)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Right: Mustard/flower stalks */}
        <div className="flex items-end gap-2 animate-wind-gentle">
          {[42, 58, 48, 68, 54, 46, 62].map((h, idx) => (
            <div
              key={`crop-r-${idx}`}
              style={{
                height: `${h}px`,
                width: '3px',
                borderRadius: '2px',
                background: isNight
                  ? 'linear-gradient(to top, #0e361c, #65a30d)'
                  : 'linear-gradient(to top, #2E7D4F, #86D4A0)',
                opacity: 0.60 + (idx % 2) * 0.18,
              }}
              className="relative"
            >
              <div
                style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%',
                  background: idx % 3 === 0 ? '#D7A83E' : isNight ? '#70c98a' : '#4CAF70',
                  position: 'absolute',
                  top: '-6px', left: '-2.5px',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── LAYER 4: CANVAS — slow falling leaves & petals ─────── */}
      {/* Animation is ENTIRELY time-based — scrolling has zero effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
