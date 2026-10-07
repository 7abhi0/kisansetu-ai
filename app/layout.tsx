import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LivingFarmBackground from '@/components/LivingFarmBackground';
import FloatingKisanAssistant from '@/components/FloatingKisanAssistant';

export const metadata: Metadata = {
  title: 'KisanSetu AI | AI Powered Smart Agriculture Ecosystem for India',
  description: 'Enterprise AI-powered AgriTech platform for 140M+ Indian farmers. Real-time APMC Mandi rates, multi-horizon price forecasting, leaf disease computer vision diagnostics, and smart IoT irrigation.',
  keywords: 'AgriTech, AI Agriculture, Indian Farmer, Mandi Prices, e-NAM, APMC, Crop Disease Detection, KisanGPT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F5F8F0] text-[#183326] antialiased relative">
        {/* Living Agriculture Dynamic Background — fixed, never moves with scroll */}
        <LivingFarmBackground />

        {/* Main Application Shell — scrolls normally above the fixed background */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>

        {/* Floating AI Kisan Assistant Orb */}
        <FloatingKisanAssistant />
      </body>
    </html>
  );
}
