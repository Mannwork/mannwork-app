import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useEffect, useState } from "react";

export function useHasUserReviewed(requestId: string, userId: string) {
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId || !userId) {
      setLoading(false);
      return;
    }

    const checkIfReviewed = async () => {
      try {
        setLoading(true);
        const { data, error: queryError } = await supabase
          .from("reviews")
          .select("id")
          .eq("request_id", requestId)
          .eq("reviewer_id", userId)
          .maybeSingle();

        if (queryError) {
          throw new Error(`Error al verificar la calificación: ${queryError.message}`);
        }

        setHasReviewed(!!data);
      } catch (err) {
        console.error("Error en useHasUserReviewed:", err);
        setError(err instanceof Error ? err.message : "Error desconocido al verificar la calificación");
      } finally {
        setLoading(false);
      }
    };

    checkIfReviewed();
  }, [requestId, userId]);

  return { hasReviewed, loading, error };
}

export default useHasUserReviewed;
