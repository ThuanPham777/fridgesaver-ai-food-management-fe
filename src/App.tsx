import { useState, useEffect } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppRouter } from '@/router';
import { useAuthStore } from '@/store/useAuthStore';
import { env } from '@/config/env';
import { PageLoader } from '@/components/common/PageLoader';
import type { ApiResponse } from '@/types/api.types';
import type { AuthResponseDto } from '@/types/auth.types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Module-level singleton promise so the refresh call is made exactly once,
 * even when React 18 Strict Mode mounts → unmounts → remounts the component.
 */
let hydrationPromise: Promise<void> | null = null;

function getHydrationPromise(): Promise<void> {
  if (hydrationPromise) return hydrationPromise;

  const { user, tokens } = useAuthStore.getState();

  // Already has a token or no persisted user — nothing to do
  if (tokens?.accessToken || !user) {
    hydrationPromise = Promise.resolve();
    return hydrationPromise;
  }

  // User profile is persisted but access token is gone (page refresh).
  // Use raw axios (not apiClient) so the response interceptor is never triggered
  // — if the refresh cookie is expired we just clear state, no redirect loop.
  hydrationPromise = axios
    .post<ApiResponse<AuthResponseDto>>(
      `${env.apiBaseUrl}/auth/refresh`,
      undefined,
      { withCredentials: true },
    )
    .then((res) => {
      const { accessToken, user: freshUser } = res.data.data;
      const authUser = {
        id: freshUser.id,
        email: freshUser.email,
        fullName: freshUser.fullName,
        role: freshUser.role,
        avatarUrl: freshUser.avatarUrl ?? undefined,
        phone: freshUser.phone ?? undefined,
      };
      useAuthStore.getState().setAuth(authUser, { accessToken });
    })
    .catch(() => {
      // Cookie expired or revoked — log the user out cleanly
      useAuthStore.getState().clearAuth();
    });

  return hydrationPromise;
}

function useAuthHydration() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Both StrictMode mount cycles share the same promise — only one HTTP call is made
    getHydrationPromise().then(() => setReady(true));
  }, []);

  return ready;
}

function App() {
  const authReady = useAuthHydration();

  if (!authReady) return <PageLoader />;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
