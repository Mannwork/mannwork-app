import { supabase } from "@/common/lib/supabase/supabaseClient";
import { SupabaseReview } from "@/features/reviews/interfaces/review.interface";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 3; // Número de reseñas por página

interface UseUserReviewsOptions {
  initialPageSize?: number;
}

interface FetchReviewsParams {
  pageParam?: number;
  userId: string;
  filter: 'received' | 'given';
  pageSize?: number;
}

async function fetchReviewsPage({ pageParam = 1, userId, filter, pageSize = PAGE_SIZE }: FetchReviewsParams) {
  const from = (pageParam - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = supabase
    .from("reviews")
    .select(`*, reviewer:reviewer_id (id, name, last_name, profile_pic, membership_json)`, { count: 'exact' })
    .order("created_at", { ascending: false })
    .range(from, to);

  // Filtrar por reseñas recibidas o dadas
  const filteredQuery = filter === 'received' 
    ? query.eq("reviewed_id", userId)
    : query.eq("reviewer_id", userId);

  const { data, error, count } = await filteredQuery;

  if (error) {
    throw error;
  }

  // Mapear los datos para incluir el nombre y la imagen del revisor
  const formattedData = (data as unknown as SupabaseReview[]).map(review => ({
    ...review,
    reviewer_name: review.reviewer ? `${review.reviewer.name} ${review.reviewer.last_name}` : 'Usuario anónimo',
    reviewer_image: review.reviewer?.profile_pic || undefined,
    reviewer_membership_json: review.reviewer?.membership_json || undefined,
  }));

  return {
    data: formattedData,
    nextPage: (count || 0) > to + 1 ? pageParam + 1 : undefined,
    count
  };
}

export function useUserReviews(userId: string, filter: 'received' | 'given' = 'received', options: UseUserReviewsOptions = {}) {
  const { initialPageSize = PAGE_SIZE } = options;
  const [showAll, setShowAll] = useState(false);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [allReviewsLoaded, setAllReviewsLoaded] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ['user-reviews', userId, filter, showAll], [userId, filter, showAll]);

  const fetchAllPages = useCallback(async () => {
    if (!showAll) return;
    
    let allData: any[] = [];
    let currentPage = 1;
    let hasMore = true;
    
    while (hasMore) {
      const result = await fetchReviewsPage({ pageParam: currentPage, userId, filter });
      allData = [...allData, ...result.data];
      hasMore = !!result.nextPage;
      currentPage++;
    }
    
    setAllReviews(allData);
    return allData;
  }, [userId, filter, showAll]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchReviewsPage({ 
      pageParam, 
      userId, 
      filter,
      pageSize: showAll ? 50 : initialPageSize // Aumentamos el tamaño de página si es necesario
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId,
  });

  // Cargar todas las reseñas para estadísticas
  const loadAllReviewsForStats = useCallback(async () => {
    if (allReviewsLoaded || !userId) return;
    
    let allData: any[] = [];
    let currentPage = 1;
    let hasMore = true;
    
    while (hasMore) {
      const result = await fetchReviewsPage({ 
        pageParam: currentPage, 
        userId, 
        filter,
        pageSize: 50 // Tamaño grande para obtener todas las reseñas rápidamente
      });
      
      allData = [...allData, ...result.data];
      hasMore = !!result.nextPage && result.data.length > 0;
      currentPage++;
      
      // Si ya tenemos suficientes reseñas para estadísticas, podemos parar
      if (allData.length >= 100) break;
    }
    
    setAllReviews(allData);
    setAllReviewsLoaded(true);
    return allData;
  }, [userId, filter, allReviewsLoaded]);

  // Cargar todas las reseñas cuando se monta el componente
  useEffect(() => {
    loadAllReviewsForStats();
  }, [loadAllReviewsForStats]);

  // Reseñas paginadas para la lista
  const paginatedReviews = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  // Función para cargar más reseñas paginadas
  const loadMorePaginatedReviews = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Función para recargar las reseñas
  const refreshReviews = useCallback(() => {
    setAllReviews([]);
    return queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);
  
  // Función para cargar todas las reseñas
  const loadAllReviews = useCallback(async () => {
    if (showAll) return;
    setShowAll(true);
  }, [showAll]);

  // Calcular el total de reseñas basado en el conteo de la primera página
  const totalReviews = data?.pages[0]?.count || 0;
  
  return {
    // Todas las reseñas (para estadísticas)
    allReviews,
    // Reseñas paginadas (para la lista)
    paginatedReviews,
    // Metadatos
    totalReviews,
    loading: status === 'pending',
    loadingMore: isFetchingNextPage,
    loadingAll: showAll && isFetchingNextPage,
    error: error ? 'Error al cargar las reseñas. Por favor, inténtalo de nuevo.' : null,
    hasMore: hasNextPage,
    // Funciones
    loadMoreReviews: loadMorePaginatedReviews,
    refreshReviews,
    refetch,
  };
}