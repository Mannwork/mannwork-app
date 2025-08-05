import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useState } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface CreateRequestData {
  name: string;
  description: string;
  location: LocationData | null;
  scheduleDate?: Date;
  photos: string[];
  client: string;
  category: number;
  subCategory: string;
  professionals: string[];
  status: "searching"
}

interface UseCreateRequestReturn {
  createRequest: (data: CreateRequestData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useCreateRequest(): UseCreateRequestReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async (data: CreateRequestData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Validar datos requeridos
      if (!data.name || !data.description || !data.client || !data.category) {
        throw new Error("Faltan datos requeridos para crear la solicitud");
      }

      if (!data.professionals || data.professionals.length === 0) {
        throw new Error("Debe seleccionar al menos un profesional");
      }

      // Preparar los datos para la inserción (solo campos que sabemos que existen)
      const requestData: any = {
        name: data.name,
        description: data.description,
        location: data.location ? JSON.stringify(data.location) : null,
        photos: data.photos || [],
        client: data.client,
        category: data.category,
        status: 'searching', // Estado inicial
      };

      // Solo agregar campos opcionales si existen
      if (data.subCategory) {
        requestData.subcategory = data.subCategory;
      }
      
      if (data.scheduleDate) {
        requestData.scheduledate = data.scheduleDate;
      }

      console.log('Datos a insertar en requests:', requestData);

      // Insertar la solicitud en la base de datos
      const { data: newRequest, error: insertError } = await supabase
        .from('requests')
        .insert([requestData])
        .select()
        .single();

      if (insertError) {
        console.error('Error al crear la solicitud:', insertError);
        throw new Error(insertError.message || 'Error al crear la solicitud');
      }

      if (!newRequest) {
        throw new Error('No se pudo crear la solicitud');
      }

      // Crear las relaciones con los profesionales seleccionados
      const requestProfessionalsData = data.professionals.map(professionalId => ({
        request_id: newRequest.id,
        professional_id: professionalId,
        status: 'selected' as const,
      }));

      const { error: professionalsError } = await supabase
        .from('request_professionals')
        .insert(requestProfessionalsData);

      if (professionalsError) {
        console.error('Error al relacionar profesionales:', professionalsError);
        // No lanzamos error aquí porque la solicitud ya se creó
        console.warn('La solicitud se creó pero no se pudieron relacionar los profesionales');
      }

      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error en useCreateRequest:', err);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRequest,
    loading,
    error,
  };
} 