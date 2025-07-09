import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useSubcategoriesByCategories(categoryIds: number[]) {
  return useQuery({
    queryKey: ["subcategories-by-categories", categoryIds],
    queryFn: async () => {
      if (!categoryIds.length) return {};
      // 1. Busca todas las relaciones para esos categoryIds
      const { data: rels, error: relsError } = await supabase
        .from("category_subcategory")
        .select("category_id, subcategory_id")
        .in("category_id", categoryIds);

      if (relsError) throw relsError;
      if (!rels || rels.length === 0) return {};

      const subcategoryIds = rels.map((r) => r.subcategory_id);

      // 2. Busca todas las subcategorías por esos IDs
      const { data: subcategories, error: subError } = await supabase
        .from("subcategories")
        .select("id, name, created_at")
        .in("id", subcategoryIds);

      if (subError) throw subError;

      // 3. Devuelve agrupado por category_id
      const grouped: Record<number, any[]> = {};
      categoryIds.forEach((catId) => {
        grouped[catId] = rels
          .filter((r) => r.category_id === catId)
          .map((r) => subcategories.find((s) => s.id === r.subcategory_id))
          .filter(Boolean);
      });
      return grouped;
    },
    enabled: !!categoryIds.length,
  });
} 