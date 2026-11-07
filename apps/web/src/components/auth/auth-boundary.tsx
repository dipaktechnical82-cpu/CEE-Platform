'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthenticatedUser } from '@cee/contracts';
import { ApiClientError } from '@/lib/api-client';
import { authApi } from '@/lib/auth-api';

type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: AuthenticatedUser }
  | { status: 'forbidden' }
  | { status: 'unavailable' };

const AuthenticatedUserContext = createContext<AuthenticatedUser | null>(null);

export function useAuthenticatedUser(): AuthenticatedUser | null {
  return useContext(AuthenticatedUserContext);
}

export function AuthBoundary({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    void authApi
      .me()
      .then(({ user }) => {
        if (active) setState({ status: 'authenticated', user });
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiClientError && error.status === 401) {
          router.replace('/login');
        } else if (error instanceof ApiClientError && error.status === 403) {
          setState({ status: 'forbidden' });
        } else {
          setState({ status: 'unavailable' });
        }
      });
    return () => {
      active = false;
    };
  }, [retryCount, router]);

  if (state.status === 'authenticated') {
    return (
      <AuthenticatedUserContext.Provider value={state.user}>
        {children}
      </AuthenticatedUserContext.Provider>
    );
  }
  if (state.status === 'forbidden') {
    return (
      <main className="mx-auto max-w-xl p-8 text-center" role="alert">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Your account is not authorized to view this page.
        </p>
      </main>
    );
  }
  if (state.status === 'unavailable') {
    return (
      <main className="mx-auto max-w-xl p-8 text-center" role="alert">
        <h1 className="text-xl font-semibold">Account service unavailable</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          We could not verify your session. No protected content is shown.
        </p>
        <button
          className="mt-4 rounded bg-brand-600 px-4 py-2 text-white"
          onClick={() => {
            setState({ status: 'loading' });
            setRetryCount((count) => count + 1);
          }}
          type="button"
        >
          Retry
        </button>
      </main>
    );
  }
  return (
    <main className="p-8 text-center" aria-live="polite">
      Verifying your account…
    </main>
  );
}
