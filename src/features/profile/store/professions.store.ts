import { create } from 'zustand';

interface Profession {
  category_id: number;
  subcategory_id: string;
  category_name: string;
  subcategory_name: string;
}

interface ProfessionsState {
  professions: Profession[];
  setProfessions: (professions: Profession[]) => void;
  resetProfessions: () => void;
}

export const useProfessionsStore = create<ProfessionsState>((set) => ({
  professions: [],
  setProfessions: (professions) => set({ professions }),
  resetProfessions: () => set({ professions: [] }),
})); 