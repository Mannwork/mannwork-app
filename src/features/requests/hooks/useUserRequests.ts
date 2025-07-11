import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useEffect, useState } from "react";

interface Request {
  id: string;
  name: string;
  description: string;
  location: any;
  scheduledate?: string;
  photos: string[];
  client: string;
  status: 'searching' | 'accepted' | 'working' | 'paid' | 'completed' | 'cancelled';
  bill?: string;
  category: number;
  subcategory: string;
  selectedQuote?: string;
  inserted_at: string;
  updated_at: string;
}

interface UseUserRequestsReturn {
  requests: Request[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserRequests(userId: string): UseUserRequestsReturn {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('requests')
        .select('*')
        .eq('client', userId)
        .order('inserted_at', { ascending: false });

      if (fetchError) {
        console.error('Error al obtener solicitudes:', fetchError);
        throw new Error(fetchError.message || 'Error al obtener solicitudes');
      }

      setRequests(data || []);
      console.log('Solicitudes obtenidas:', data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error en useUserRequests:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
  };
} 