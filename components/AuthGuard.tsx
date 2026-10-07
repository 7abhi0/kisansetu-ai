'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Wraps any page that requires authentication.
 * If the user is not authenticated, attempts session restoration or redirects to /auth.
 * If authenticated but profile is not completed, redirects to /onboarding.
 * Displays a premium agricultural loading state while resolving.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, userProfile, loadActiveSession } = useAppStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 1. Try to load active session if not already in store
    let authed = isAuthenticated;
    if (!authed) {
      authed = loadActiveSession();
    }

    if (!authed) {
      router.replace('/auth');
      return;
    }

    // 2. Check profile completion status
    const currentProfile = useAppStore.getState().userProfile;
    const isCompleted = Boolean(
      currentProfile &&
      currentProfile.profileCompleted &&
      currentProfile.name &&
      currentProfile.name.trim().toLowerCase() !== 'guest'
    );

    if (!isCompleted && pathname !== '/onboarding') {
      router.replace('/onboarding');
      return;
    }

    if (isCompleted && pathname === '/onboarding') {
      router.replace('/dashboard');
      return;
    }

    setChecking(false);
  }, [isAuthenticated, pathname, router, loadActiveSession]);

  if (checking) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050d06 0%, #09170c 50%, #050d06 100%)',
          gap: '18px',
          zIndex: 9999,
        }}
      >
        {/* Animated logo mark with pulse */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            boxShadow: '0 0 35px rgba(34, 197, 94, 0.35)',
            animation: 'ks-pulse 1.4s ease-in-out infinite',
          }}
        >
          🌱
        </div>

        {/* Loading Message */}
        <div style={{ textAlign: 'center', color: '#f8fafc' }}>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#4ade80',
            }}
          >
            Loading your farm profile...
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#94a3b8',
              marginTop: '4px',
            }}
          >
            Personalizing your agricultural command center
          </div>
        </div>

        {/* Spinner ring */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '3px solid rgba(34,197,94,0.15)',
            borderTopColor: '#22c55e',
            animation: 'ks-spin 0.8s linear infinite',
          }}
        />

        <style>{`
          @keyframes ks-spin  { to { transform: rotate(360deg); } }
          @keyframes ks-pulse { 0%,100% { transform: scale(1); opacity:.92; }
                                 50%     { transform: scale(1.08); opacity:1; } }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
