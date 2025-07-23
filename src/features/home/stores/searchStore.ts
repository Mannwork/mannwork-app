import { supabase } from '@/common/lib/supabase/supabaseClient';
import { create } from 'zustand';

interface SearchHistory {
  id?: string;
  user_id: string;
  category: string;
  subcategory: string;
  created_at: string;
}

interface SearchStore {
  recentSearches: SearchHistory[];
  isLoading: boolean;
  addSearch: (category: string, subcategory: string, userId: string) => Promise<void>;
  removeSearch: (searchId: string) => Promise<void>;
  loadUserSearches: (userId: string) => Promise<void>;
  clearSearches: () => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  recentSearches: [],
  isLoading: false,

  addSearch: async (category, subcategory, userId) => {
    try {
      set({ isLoading: true });

      // Verificar si ya existe esta búsqueda para este usuario
      const { data: existingSearch } = await supabase
        .from('user_search_history')
        .select('id')
        .eq('user_id', userId)
        .eq('category', category)
        .eq('subcategory', subcategory)
        .single();

      if (existingSearch) {
        // Si existe, actualizar el timestamp
        await supabase
          .from('user_search_history')
          .update({ created_at: new Date().toISOString() })
          .eq('id', existingSearch.id);
      } else {
        // Obtener todas las búsquedas existentes del usuario, ordenadas por fecha descendente
        const { data: allSearches, error: fetchError } = await supabase
          .from('user_search_history')
          .select('id, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // Si ya hay 2 búsquedas, eliminar la más antigua
        if (allSearches && allSearches.length >= 2) {
          // Buscar la más antigua
          const oldest = allSearches.reduce((prev, curr) =>
            new Date(prev.created_at) < new Date(curr.created_at) ? prev : curr
          );
          await supabase
            .from('user_search_history')
            .delete()
            .eq('id', oldest.id);
        }

        // Insertar la nueva búsqueda
        await supabase
          .from('user_search_history')
          .insert({
            user_id: userId,
            category,
            subcategory,
            created_at: new Date().toISOString(),
          });
      }

      // Recargar las búsquedas del usuario
      await get().loadUserSearches(userId);
    } catch (error) {
      console.error('Error adding search:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeSearch: async (searchId) => {
    try {
      set({ isLoading: true });
      
      await supabase
        .from('user_search_history')
        .delete()
        .eq('id', searchId);

      set((state) => ({
        recentSearches: state.recentSearches.filter(search => search.id !== searchId)
      }));
    } catch (error) {
      console.error('Error removing search:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadUserSearches: async (userId) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase
        .from('user_search_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      set({ recentSearches: data || [] });
    } catch (error) {
      console.error('Error loading user searches:', error);
      set({ recentSearches: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  clearSearches: () => {
    set({ recentSearches: [] });
  },
})); 