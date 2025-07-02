import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useState } from "react";

export function useCreateRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (requestData: {
    name: string;
    description: string;
    location: any;
    photos: string[];
    client: string;
    professionals: string[]; // array de userId (text)
    status?: string;
    category: number; // bigint
    subCategory: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Crear la request
      const { data, error } = await supabase.from("requests").insert([
        {
          name: requestData.name,
          description: requestData.description,
          location: requestData.location,
          photos: requestData.photos,
          client: requestData.client,
          status: requestData.status || "searching",
          category: requestData.category,
          subCategory: requestData.subCategory,
        },
      ]).select("id");

      if (error) throw error;
      const requestId = data?.[0]?.id;
      if (!requestId) throw new Error("No se pudo obtener el id de la solicitud");

      // 2. Insertar en la tabla intermedia
      if (requestData.professionals.length > 0) {
        const profRows = requestData.professionals.map(profId => ({
          request_id: requestId,
          professional_id: profId,
        }));
        const { error: profError } = await supabase.from("request_professionals").insert(profRows);
        if (profError) throw profError;
      }

      return true;
    } catch (e: any) {
      setError(e.message || "No se pudo enviar la solicitud");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createRequest, loading, error };
} 