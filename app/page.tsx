'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, userProfile, loadActiveSession } = useAppStore();

  useEffect(() => {
    let authed = isAuthenticated;
    if (!authed) {
      authed = loadActiveSession();
    }

    if (authed) {
      const profile = useAppStore.getState().userProfile;
      if (profile?.profileCompleted && profile.name && profile.name.trim().toLowerCase() !== 'guest') {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    } else {
      router.replace('/auth');
    }
  }, [isAuthenticated, userProfile, loadActiveSession, router]);

  return null;
}