import { supabase } from '@/common/lib/supabase/supabaseClient';

import type { Category } from '../types/categories.interface';

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

