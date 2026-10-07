'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import {
  X,
  User,
  Wallet,
  MapPin,
  Phone,
  Sprout,
  ShieldCheck,
  Check,
  Lock,
  Sparkles
} from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_CHOICES = ['👨‍🌾', '👩‍🌾', '🌾', '🌱', '🚜', '🏢', '🚛', '🔬', '🏛️', '⚡', '🌻', '🌽'];

const NET_WORTH_OPTIONS = [
  'Below ₹1 Lakh',
  '₹1–5 Lakh',
  '₹5–10 Lakh',
  '₹10–25 Lakh',
  '₹25–50 Lakh',
  '₹50 Lakh–₹1 Crore',
  'Above ₹1 Crore',
  'Prefer not to say / Not provided',
];

export default function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { userProfile, updateUserProfile, farms, addFarm, updateFarm } = useAppStore();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('👨‍🌾');
  const [netWorth, setNetWorth] = useState('');
  const [customNetWorth, setCustomNetWorth] = useState('');
  const [location, setLocation] = useState('');
  const [stateName, setStateName] = useState('');
  const [phone, setPhone] = useState('');
  const [farmAcreage, setFarmAcreage] = useState('12.0');
  const [primaryCrop, setPrimaryCrop] = useState('Wheat (Sharbati)');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setAvatar(userProfile.avatar || '👨‍🌾');
      setNetWorth(userProfile.netWorth || 'Not provided');
      setLocation(userProfile.location || 'Ludhiana, Punjab');
      setStateName(userProfile.state || 'Punjab');
      setPhone(userProfile.phone || '+91 ');
      if (farms[0]) {
        setFarmAcreage(String(farms[0].areaAcres));
      }
    }
  }, [userProfile, farms, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    let finalNetWorth = netWorth;
    if (customNetWorth.trim()) {
      const cleanDigits = customNetWorth.replace(/[^0-9]/g, '');
      if (cleanDigits) {
        const num = Number(cleanDigits);
        if (num >= 10000000) {
          finalNetWorth = `₹${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Crore`;
        } else if (num >= 100000) {
          finalNetWorth = `₹${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
        } else {
          finalNetWorth = `₹${num.toLocaleString('en-IN')}`;
        }
      }
    } else if (netWorth === 'Prefer not to say / Not provided') {
      finalNetWorth = 'Not provided';
    }

    updateUserProfile({
      name: name.trim() || userProfile.name,
      avatar,
      netWorth: finalNetWorth,
      location: location.trim(),
      state: stateName.trim(),
      phone: phone.trim(),
    });

    if (farms[0] && farmAcreage) {
      updateFarm(farms[0].id, { areaAcres: Number(farmAcreage) || farms[0].areaAcres });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1a0f]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-8 border border-[#DCE8D8] shadow-2xl shadow-[#1C3A27]/15 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="close-profile-edit-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6B8771] hover:text-[#1C3A27] hover:bg-[#F0F5EE] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#EAF5E8] border border-[#B7DDB2] flex items-center justify-center text-xl shadow-xs">
            ⚙️
          </div>
          <div>
            <h2 className="text-lg font-black text-[#1C3A27]">Farmer Profile &amp; Settings</h2>
            <p className="text-xs text-[#55735B]">Update your verified personal &amp; financial details</p>
          </div>
        </div>

        {saveSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EAF5E8] text-[#2E7D4F] text-2xl border border-[#B7DDB2] animate-bounce">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#1C3A27]">Profile Updated Successfully!</h3>
            <p className="text-xs text-[#55735B]">Your changes have been saved to your personal profile.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#2B4B34] mb-2">
                Profile Avatar
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {AVATAR_CHOICES.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all cursor-pointer ${
                      avatar === emoji
                        ? 'bg-[#EAF5E8] border-2 border-[#2E7D4F] scale-110 shadow-sm'
                        : 'bg-[#F8FAF7] border border-[#DCE8D8] hover:bg-[#EEF6EB]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-[#2B4B34] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#2E7D4F] absolute left-3 top-3" />
                <input
                  id="edit-profile-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAFDF9] border border-[#D0E2CE] focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 rounded-xl text-[#1C3A27] text-xs outline-none transition-colors"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Net Worth Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#2B4B34] flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-[#B47818]" />
                  Estimated Net Worth
                </label>
                <span className="text-[10px] text-[#6B8771] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#2E7D4F]" /> Private
                </span>
              </div>
              <select
                id="edit-profile-networth-select"
                value={netWorth}
                onChange={(e) => {
                  setNetWorth(e.target.value);
                  setCustomNetWorth('');
                }}
                className="w-full px-3 py-2.5 bg-[#FAFDF9] border border-[#D0E2CE] focus:border-[#2E7D4F] focus:ring-2 focus:ring-[#2E7D4F]/15 rounded-xl text-[#1C3A27] text-xs outline-none transition-colors"
              >
                {NET_WORTH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-white text-[#1C3A27]">
                    {opt}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <input
                  id="edit-profile-custom-networth"
                  type="text"
                  value={customNetWorth}
                  onChange={(e) => setCustomNetWorth(e.target.value)}
                  placeholder="Or enter custom exact amount (e.g. ₹15,00,000)"
                  className="w-full px-3 py-2 bg-[#FAFDF9] border border-[#D0E2CE] focus:border-[#2E7D4F] rounded-xl text-[#1C3A27] text-xs placeholder:text-[#8AA890] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Location & State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2B4B34] mb-1">
                  Location (District)
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D4F] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-[#FAFDF9] border border-[#D0E2CE] focus:border-[#2E7D4F] rounded-xl text-[#1C3A27] text-xs outline-none transition-colors"
                    placeholder="Ludhiana, Punjab"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2B4B34] mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAFDF9] border border-[#D0E2CE] focus:border-[#2E7D4F] rounded-xl text-[#1C3A27] text-xs outline-none transition-colors"
                  placeholder="Punjab"
                />
              </div>
            </div>

            {/* Phone & Farm Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2B4B34] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#2E7D4F] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-[#FAFDF9] border border-[#D0E2CE] focus:border-[#2E7D4F] rounded-xl text-[#1C3A27] text-xs outline-none transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2B4B34] mb-1">
                  Farm Holding (Acres)
                </label>
                <div className="relative">
                  <Sprout className="w-3.5 h-3.5 text-[#2E7D4F] absolute left-3 top-3" />
                  <input
                    type="number"
                    value={farmAcreage}
                    onChange={(e) => setFarmAcreage(e.target.value)}
                    step="0.5"
                    className="w-full pl-8 pr-3 py-2.5 bg-[#FAFDF9] border border-[#D0E2CE] focus:border-[#2E7D4F] rounded-xl text-[#1C3A27] text-xs outline-none transition-colors"
                    placeholder="12.0"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#DCE8D8]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#F0F5EE] hover:bg-[#E4EDE1] text-[#3E5C46] text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-profile-changes-btn"
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256841] text-white text-xs font-bold shadow-md shadow-[#2E7D4F]/20 hover:shadow-lg transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
