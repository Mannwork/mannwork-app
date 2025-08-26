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
    const { data, error } = await supabase
        .from("category_subcategory")
        .select("subcategories(id, name, created_at)")
        .eq("category_id", categoryId);

    if (error) {
        console.error("Error fetching subcategories:", error);
        throw error;
    }

    // Extraer los datos de subcategorías del resultado anidado
    const subcategories: any[] = data
        .map((item) => item.subcategories)
        .filter(Boolean);

    return subcategories;
}

export { getSubcategoriesByCategory };

export function useSubcategories(categoryId: number) {
    return useQuery({
        queryKey: ["subcategories", categoryId],
        queryFn: () => {
            return getSubcategoriesByCategory(categoryId);
        },
        enabled: !!categoryId,
    });
}
