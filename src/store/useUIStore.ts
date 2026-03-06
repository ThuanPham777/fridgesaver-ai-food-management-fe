import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types/common.types';

interface UIStore {
  theme: Theme;
  sidebarOpen: boolean;
  globalLoading: boolean;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,
      globalLoading: false,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
    }),
    { name: 'ui-store', partialize: (s) => ({ theme: s.theme }) },
  ),
);
