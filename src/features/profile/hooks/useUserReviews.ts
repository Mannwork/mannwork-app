import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useEffect, useState } from "react";

export interface UserReview {
  id: string;
  reviewer_id: string;
  reviewed_id: string;
  commentary: string;
  calification: number;
  created_at: string;
  updated_at: string;
  request_id: string;
  reviewer_name?: string;
  reviewer_image?: string;
}

export function useUserReviews(userId: string) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    supabase
      .from("reviews")
      .select(`*, reviewer:reviewer_id (id, name, avatar_url)`)
      .eq("reviewed_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setReviews([]);
        } else {
          // Mapear reviewer_name y reviewer_image si existen
          const mapped = (data || []).map((r: any) => ({
            ...r,
            reviewer_name: r.reviewer?.name || "",
            reviewer_image: r.reviewer?.avatar_url || undefined,
          }));
          setReviews(mapped);
        }
        setLoading(false);
      });
  }, [userId]);

  return { reviews, loading, error };
} 