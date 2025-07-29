import { supabase } from "@/common/lib/supabase/supabaseClient";

export const getHomeCategories = async () => {
    const { data: categories } = await supabase.from("categories").select("*").limit(5).order("name", { ascending: true });

    return categories;
}
