'use client';

import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Plus, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  Clock, 
  X, 
  ArrowRight,
  Gavel,
  CheckCircle2
} from 'lucide-react';
import { MARKETPLACE_LISTINGS, MarketplaceListing } from '@/lib/data';
import { useAppStore } from '@/lib/store';

export default function MarketplacePage() {
  const { userProfile } = useAppStore();
  const [listings, setListings] = useState<MarketplaceListing[]>(MARKETPLACE_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [selectedItemForBid, setSelectedItemForBid] = useState<MarketplaceListing | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [showAddListingModal, setShowAddListingModal] = useState(false);

  // New Listing Form State
  const [newCropName, setNewCropName] = useState('');
  const [newVariety, setNewVariety] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || item.qualityGrade.includes(selectedGrade);
    const matchesOrganic = !organicOnly || item.isOrganicCertified;
    return matchesSearch && matchesGrade && matchesOrganic;
  });

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForBid || !bidAmount) return;

    const amount = Number(bidAmount);
    setListings((prev) =>
      prev.map((item) =>
        item.id === selectedItemForBid.id
          ? {
              ...item,
              bidsCount: item.bidsCount + 1,
              currentHighestBid: Math.max(item.currentHighestBid, amount)
            }
          : item
      )
    );

    alert(`Bid of ₹${amount}/Qtl placed successfully on "${selectedItemForBid.crop}"! Escrow token reserved.`);
    setSelectedItemForBid(null);
    setBidAmount('');
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName || !newPrice) return;

    const newListing: MarketplaceListing = {
      id: `list_${Date.now()}`,
      farmerName: userProfile?.name || 'Farmer',
      farmerLocation: userProfile?.location || 'Ludhiana, Punjab',
      crop: newCropName,
      variety: newVariety || 'Hybrid Premium',
      quantityAvailableQuintals: Number(newQty) || 100,
      minOrderQuintals: 20,
      pricePerQuintal: Number(newPrice),
      harvestDate: 'April 2026',
      qualityGrade: 'Grade A Premium',
      isOrganicCertified: true,
      bidsCount: 0,
      currentHighestBid: Number(newPrice),
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    };

    setListings([newListing, ...listings]);
    setShowAddListingModal(false);
    setNewCropName('');
    setNewPrice('');
    setNewQty('');
  };

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#DCE8D8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F] flex items-center gap-1.5 mb-1">
            <ShoppingCart className="w-4 h-4" /> e-NAM Certified Mandi Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#183326]">
            Krishi Mandi Spot & Auction Trading
          </h1>
          <p className="text-xs sm:text-sm text-[#607568] mt-1">
            Direct farmer-to-buyer transactions. Zero middleman commissions. 100% Escrow payment security.
          </p>
        </div>

        <button
          onClick={() => setShowAddListingModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#2E7D4F]/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>List Crop Produce for Sale</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-[#DCE8D8] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#789087] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop, variety, or farmer district..."
            className="w-full bg-white border border-[#DCE8D8] rounded-xl pl-10 pr-4 py-2.5 text-[#183326] placeholder:text-[#789087] focus:outline-none focus:border-[#2E7D4F]"
          />
        </div>

        {/* Quality Grade Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[#607568] font-semibold whitespace-nowrap">Grade:</span>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-white border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] focus:outline-none focus:border-[#2E7D4F]"
          >
            <option value="all">All Grades</option>
            <option value="Export">Export Grade (A+)</option>
            <option value="Premium">Grade A Premium</option>
            <option value="Standard">Grade B Standard</option>
          </select>
        </div>

        {/* Organic Toggle */}
        <button
          onClick={() => setOrganicOnly(!organicOnly)}
          className={`px-3 py-2 rounded-xl border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            organicOnly 
              ? 'bg-[#E7F3E5] border-[#2E7D4F] text-[#2E7D4F]' 
              : 'bg-[#F3F8F1] border-[#DCE8D8] text-[#607568] hover:bg-[#E7F3E5] hover:text-[#183326]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Organic Certified</span>
        </button>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div key={item.id} className="glass-card rounded-2xl overflow-hidden border border-[#DCE8D8] flex flex-col justify-between group">
            
            {/* Image & Badges */}
            <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.crop}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-black/75 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
                  {item.qualityGrade}
                </span>
                {item.isOrganicCertified && (
                  <span className="text-[10px] font-bold bg-green-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full border border-green-500/30">
                    🌱 Organic
                  </span>
                )}
              </div>

              <div className="absolute bottom-2.5 right-2.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white border border-white/10">
                ₹{item.pricePerQuintal} / Qtl
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-[#183326] text-base">{item.crop}</h3>
                <div className="text-xs text-[#2E7D4F] font-semibold">{item.variety}</div>
                <div className="text-xs text-[#607568] mt-1">{item.farmerName} • {item.farmerLocation}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#F3F8F1] p-2.5 rounded-xl text-[11px] border border-[#DCE8D8]">
                <div>
                  <span className="text-[#607568]">Available:</span>
                  <div className="font-semibold text-[#183326]">{item.quantityAvailableQuintals} Qtl</div>
                </div>
                <div>
                  <span className="text-[#607568]">Min Order:</span>
                  <div className="font-semibold text-[#183326]">{item.minOrderQuintals} Qtl</div>
                </div>
                <div>
                  <span className="text-[#607568]">High Bid:</span>
                  <div className="font-semibold text-[#2E7D4F] font-mono">₹{item.currentHighestBid}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedItemForBid(item);
                    setBidAmount((item.currentHighestBid + 25).toString());
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#2E7D4F]/20 cursor-pointer"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Place Bid</span>
                </button>
                <button
                  onClick={() => alert(`Spot purchase lot reserved for ${item.crop}! Redirecting to Bank Escrow payment gateway.`)}
                  className="py-2 px-3 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] text-[#183326] font-semibold text-xs border border-[#DCE8D8] transition-colors cursor-pointer"
                >
                  Buy Spot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Place Bid Modal */}
      {selectedItemForBid && (
        <div className="fixed inset-0 z-50 bg-[#183326]/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-[#DCE8D8] space-y-4 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <h3 className="font-bold text-[#183326] text-base">Auction Bid Submission</h3>
              <button onClick={() => setSelectedItemForBid(null)} className="text-[#607568] hover:text-[#183326] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#183326]">{selectedItemForBid.crop} ({selectedItemForBid.variety})</div>
              <div className="text-[#607568]">{selectedItemForBid.farmerName} • {selectedItemForBid.farmerLocation}</div>
              <div className="p-3 rounded-xl bg-[#F3F8F1] border border-[#DCE8D8] flex justify-between">
                <span className="text-[#607568]">Current Highest Bid:</span>
                <strong className="text-[#2E7D4F] font-mono">₹{selectedItemForBid.currentHighestBid} / Qtl</strong>
              </div>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#607568] font-semibold mb-1">Your Bid Amount (₹ / Quintal):</label>
                <input
                  type="number"
                  required
                  min={selectedItemForBid.currentHighestBid + 5}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] font-mono text-sm focus:outline-none focus:border-[#2E7D4F]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold cursor-pointer transition-colors"
                >
                  Submit Guaranteed Bid
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItemForBid(null)}
                  className="py-2.5 px-4 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] text-[#607568] border border-[#DCE8D8] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Listing Modal */}
      {showAddListingModal && (
        <div className="fixed inset-0 z-50 bg-[#183326]/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-[#DCE8D8] space-y-4 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8]">
              <h3 className="font-bold text-[#183326] text-base">List Harvest Produce on Mandi Board</h3>
              <button onClick={() => setShowAddListingModal(false)} className="text-[#607568] hover:text-[#183326] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#607568] font-semibold mb-1">Commodity / Crop Name:</label>
                <input
                  type="text"
                  required
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  placeholder="e.g. Sharbati Wheat"
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] placeholder:text-[#789087] focus:outline-none focus:border-[#2E7D4F]"
                />
              </div>

              <div>
                <label className="block text-[#607568] font-semibold mb-1">Variety / Grade:</label>
                <input
                  type="text"
                  value={newVariety}
                  onChange={(e) => setNewVariety(e.target.value)}
                  placeholder="e.g. DBW-187 Export Certified"
                  className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] placeholder:text-[#789087] focus:outline-none focus:border-[#2E7D4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#607568] font-semibold mb-1">Available Quantity (Qtl):</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] font-mono placeholder:text-[#789087] focus:outline-none focus:border-[#2E7D4F]"
                  />
                </div>
                <div>
                  <label className="block text-[#607568] font-semibold mb-1">Expected Rate (₹/Qtl):</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 2600"
                    className="w-full bg-[#F9FBF8] border border-[#DCE8D8] rounded-xl px-3 py-2 text-[#183326] font-mono placeholder:text-[#789087] focus:outline-none focus:border-[#2E7D4F]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256642] text-white font-bold cursor-pointer transition-colors"
                >
                  Publish Listing
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddListingModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] text-[#607568] border border-[#DCE8D8] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    </AuthGuard>
  );
}
