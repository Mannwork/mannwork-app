import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useEffect, useState } from "react";

export interface Subcategory {
  id: string;
  name: string;
}

export function useAllSubcategories() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("subcategories")
      .select("id, name")
      .then(({ data }) => {
        setSubcategories(data || []);
        setLoading(false);
      });
  }, []);

  return { subcategories, loading };
} 