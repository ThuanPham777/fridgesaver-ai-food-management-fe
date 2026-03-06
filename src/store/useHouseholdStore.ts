import { create } from 'zustand';
import type { Household } from '@/types/household.types';

interface HouseholdStore {
  /** Currently selected / active household */
  currentHousehold: Household | null;
  setCurrentHousehold: (household: Household | null) => void;
  /** Quick update after rename */
  updateHouseholdName: (name: string) => void;
}

export const useHouseholdStore = create<HouseholdStore>()((set) => ({
  currentHousehold: null,

  setCurrentHousehold: (household) => set({ currentHousehold: household }),

  updateHouseholdName: (name) =>
    set((s) => ({
      currentHousehold: s.currentHousehold
        ? { ...s.currentHousehold, name }
        : null,
    })),
}));
