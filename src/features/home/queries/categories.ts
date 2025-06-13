import { supabase } from '@/common/lib/supabase/supabaseClient';

export interface Category {
  id: number;
  name: string;
  icon_url: string;
  sub_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  category: string;
  subcategory: string;
  isSubcategory: boolean;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error('Error al obtener las categorías: ' + error.message);
  }

  return data as Category[];
};

export const searchCategories = (categories: Category[], query: string): SearchResult[] => {
  const searchResults: SearchResult[] = [];
  const normalizedQuery = query.toLowerCase().trim();
  const addedSubcategories = new Set<string>(); // Para evitar duplicados

  categories.forEach((category) => {
    const isCategoryMatch = category.name.toLowerCase().includes(normalizedQuery);

    // Si la categoría coincide o si estamos buscando en subcategorías
    category.sub_categories.forEach(subcategory => {
      const isSubcategoryMatch = subcategory.toLowerCase().includes(normalizedQuery);
      const key = `${category.name}-${subcategory}`;

      // Solo agregar si no hemos agregado esta combinación antes
      if (!addedSubcategories.has(key) && (isCategoryMatch || isSubcategoryMatch)) {
        searchResults.push({
          category: category.name,
          subcategory,
          isSubcategory: isSubcategoryMatch
        });
        addedSubcategories.add(key);
      }
    });
  });

  return searchResults;
}; 