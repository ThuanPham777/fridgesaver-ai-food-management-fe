import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, AuthTokens } from '@/types/auth.types';

interface AuthStore {
  user: AuthUser | null;
  /** Access token lives in memory only — never written to localStorage */
  tokens: AuthTokens | null;
  isAuthenticated: boolean;

  setAuth: (user: AuthUser, tokens: AuthTokens) => void;
  /** Update only the access token (e.g. after a silent refresh) */
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setAuth: (user, tokens) => set({ user, tokens, isAuthenticated: true }),

      setAccessToken: (accessToken) =>
        set((s) => ({
          tokens: { accessToken },
          isAuthenticated: s.user !== null,
        })),

      clearAuth: () =>
        set({ user: null, tokens: null, isAuthenticated: false }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: 'auth-store',
      // Only persist the user profile — tokens stay in memory for security
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
