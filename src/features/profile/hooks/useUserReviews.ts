import { supabase } from "@/common/lib/supabase/supabaseClient";
import { SupabaseReview, UserReview } from "@/features/reviews/interfaces/review.interface";
import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 3; // Número de reseñas por página

export function useUserReviews(userId: string, filter: 'received' | 'given' = 'received') {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchReviews = useCallback(async (isLoadingMore = false) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const currentPage = isLoadingMore ? page : 0;
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      if (isLoadingMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      setError(null);

      const query = supabase
        .from("reviews")
        .select(`*, reviewer:reviewer_id (id, name, last_name, profile_pic, membership_json)`, { count: 'exact' })
        .order("created_at", { ascending: false })
        .range(from, to);

      // Filtrar por reseñas recibidas o dadas
      const filteredQuery = filter === 'received' 
        ? query.eq("reviewed_id", userId)
        : query.eq("reviewer_id", userId);

      const { data, error: queryError, count } = await filteredQuery;

      if (queryError) {
        throw queryError;
      }

      // Verificar si hay más páginas
      setHasMore((count || 0) > to + 1);

      // Mapear los datos para incluir el nombre y la imagen del revisor
      const formattedData = (data as unknown as SupabaseReview[]).map(review => ({
        ...review,
        reviewer_name: review.reviewer ? `${review.reviewer.name} ${review.reviewer.last_name}` : 'Usuario anónimo',
        reviewer_image: review.reviewer?.profile_pic || undefined,
        reviewer_membership_json: review.reviewer?.membership_json || undefined,
      }));

      if (isLoadingMore) {
        setReviews(prev => [...prev, ...formattedData]);
      } else {
        setReviews(formattedData);
      }
      
      setPage(currentPage + 1);
    } catch (err) {
      console.error('Error al cargar las reseñas:', err);
      setError('Error al cargar las reseñas. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId, filter, page]);

  useEffect(() => {
    fetchReviews(false);
  }, [fetchReviews]);

  // Función para cargar más reseñas
  const loadMoreReviews = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchReviews(true);
    }
  };

  return { 
    reviews, 
    loading, 
    loadingMore, 
    error, 
    hasMore, 
    loadMoreReviews 
  };
}