import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export interface Subcategory {
  id: string;
  name: string;
  created_at: string;
}

async function getSubcategoriesByCategory(
  categoryId: number
): Promise<Subcategory[]> {
  // 1. Buscar los subcategory_id asociados a la categoría
  const { data: rels, error: relsError } = await supabase
    .from("category_subcategory")
    .select("subcategory_id")
    .eq("category_id", categoryId);

  if (relsError) throw relsError;
  if (!rels || rels.length === 0) return [];

  const subcategoryIds = rels.map((r) => r.subcategory_id);

  // 2. Buscar las subcategorías por esos IDs
  const { data: subcategories, error: subError } = await supabase
    .from("subcategories")
    .select("id, name, created_at")
    .in("id", subcategoryIds);

  if (subError) throw subError;
  return subcategories || [];
}

export { getSubcategoriesByCategory };

export function useSubcategories(categoryId?: number) {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => {
      if (!categoryId) return Promise.resolve([]);
      return getSubcategoriesByCategory(categoryId);
    },
    enabled: !!categoryId,
  });
}
