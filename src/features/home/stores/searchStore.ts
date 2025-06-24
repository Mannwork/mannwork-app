import { create } from 'zustand';

interface SearchHistory {
  category: string;
  subcategory: string;
  timestamp: number;
}

interface SearchStore {
  recentSearches: SearchHistory[];
  addSearch: (category: string, subcategory: string) => void;
  removeSearch: (index: number) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  recentSearches: [],
  addSearch: (category, subcategory) => 
    set((state) => {
      const newSearch = { category, subcategory, timestamp: Date.now() };
      const updatedSearches = [newSearch, ...state.recentSearches].slice(0, 2);
      return { recentSearches: updatedSearches };
    }),
  removeSearch: (index) =>
    set((state) => ({
      recentSearches: state.recentSearches.filter((_, i) => i !== index),
    })),
})); 