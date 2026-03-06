import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/config/constants';
import { storage } from '@/utils/storage';
import type { AuthUser, AuthTokens } from '@/types/auth.types';

interface AuthStore {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;

  setAuth: (user: AuthUser, tokens: AuthTokens) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setAuth: (user, tokens) => {
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        set({ user, tokens, isAuthenticated: true });
      },

      clearAuth: () => {
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        set({ user: null, tokens: null, isAuthenticated: false });
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    { name: 'auth-store' },
  ),
);
