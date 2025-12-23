'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  parseOAuthCallback,
  validateOAuthState,
  setStoredIdToken,
} from '@/lib/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleCallback() {
      const { idToken, state, error: oauthError } = parseOAuthCallback();

      if (oauthError) {
        setError(`OAuth error: ${oauthError}`);
        return;
      }

      if (!idToken) {
        setError('No ID token received');
        return;
      }

      if (!validateOAuthState(state)) {
        setError('Invalid state parameter - possible CSRF attack');
        return;
      }

      setStoredIdToken(idToken);
      router.replace('/');
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.replace('/')}
            className="px-6 py-3 bg-amber-700 text-white font-medium rounded-lg"
          >
            Return Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-pulse text-gray-500">Signing you in...</div>
      </div>
    </main>
  );
}
