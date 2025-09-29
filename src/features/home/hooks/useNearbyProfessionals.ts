import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface NearbyProfessional {
  id: string;
  name: string;
  last_name: string;
  profile_pic?: string;
  calification: number;
  total_califications: number;
  service_radius: number;
  ubication_json: Location;
  category_id: number;
  subcategory_id: string;
  distance?: number;
  membership_json: membership_json;
}

interface membership_json {
  isPro: boolean;
  endDate: string;
  startingDate: string;
}

interface UseNearbyProfessionalsOptions {
  location: Location;
  categoryId: number;
  subcategoryId: string;
  maxDistance?: number; // en km
  enabled: any
}

export const useNearbyProfessionals = ({
  location,
  categoryId,
  subcategoryId,
  maxDistance = 50,
  enabled
}: UseNearbyProfessionalsOptions) => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["nearby-professionals", location, categoryId, subcategoryId, userId],
    queryFn: async (): Promise<NearbyProfessional[]> => {

      if (!location?.latitude || !location?.longitude) {
        throw new Error("Ubicación requerida");
      }

      // Si no hay usuario autenticado, no mostrar profesionales
      if (!userId) {
        return [];
      }

      // Buscar profesionales con la categoría y subcategoría
      const { data: professionalServices, error: servicesError } = await supabase
        .from("user_professional_services")
        .select("user_id, category_id, subcategory_id")
        .eq("category_id", categoryId)
        .eq("subcategory_id", subcategoryId);

      if (servicesError) {
        throw servicesError;
      }

      if (!professionalServices || professionalServices.length === 0) {
        return [];
      }

      // Obtener los user_ids únicos
      const userIds = [...new Set(professionalServices.map(ps => ps.user_id))];

      // Obtener usuarios bloqueados por el usuario actual
      const { data: blockedUsers, error: blockedError } = await supabase
        .from("user_blocks")
        .select("blocked_id")
        .eq("blocker_id", userId);

      if (blockedError) {
        console.error("Error fetching blocked users:", blockedError);
      }

      // Filtrar usuarios bloqueados
      const blockedIds = blockedUsers?.map(block => block.blocked_id) || [];
      const filteredUserIds = userIds.filter(id => !blockedIds.includes(id));

      if (filteredUserIds.length === 0) {
        return [];
      }

      // Buscar los usuarios profesionales (excluyendo los bloqueados)
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, name, last_name, profile_pic, calification, total_califications, service_radius, ubication_json, rol, membership_json")
        .in("id", filteredUserIds)
        .eq("rol", "professional");

      if (usersError) {
        throw usersError;
      }

      // Combinar los datos (solo con usuarios no bloqueados)
      const combinedData = professionalServices
        .filter(ps => filteredUserIds.includes(ps.user_id))
        .map(ps => {
          const user = users?.find(u => u.id === ps.user_id);
          return {
            ...ps,
            users: user
          };
        }).filter(item => item.users);

      // Si no encontramos usuarios por RLS, intentar consulta directa
      if (combinedData.length === 0) {
        const { data: directUsers, error: directError } = await supabase
          .from("users")
          .select("id, name, last_name, profile_pic, calification, total_califications, service_radius, ubication_json, rol, membership_json ")
          .in("id", filteredUserIds)
          .eq("rol", "professional");

        if (directError) {
          throw directError;
        }

        // Simular datos combinados para testing (solo usuarios no bloqueados)
        const mockCombinedData = professionalServices
          .filter(ps => filteredUserIds.includes(ps.user_id))
          .map(ps => {
            const user = directUsers?.find(u => u.id === ps.user_id);
            return {
              ...ps,
              users: user
            };
          }).filter(item => item.users);

        // Procesar profesionales
        const professionals: NearbyProfessional[] =
          (mockCombinedData
            ?.map((item: any) => {
              const user = item.users;
              if (!user) {
                return null;
              }

              if (user.rol !== "professional") {
                return null;
              }

              const userLocation = user.ubication_json;
              if (!userLocation?.latitude || !userLocation?.longitude) {
                return null;
              }

              // Calcular distancia
              const distance = calculateDistance(
                location.latitude,
                location.longitude,
                userLocation.latitude,
                userLocation.longitude
              );

              // Filtrar por radio de servicio y distancia máxima
              const serviceRadiusKm = user.service_radius || 0;

              if (distance <= maxDistance && distance <= serviceRadiusKm) {
                return {
                  id: user.id,
                  name: user.name,
                  last_name: user.last_name,
                  profile_pic: user.profile_pic,
                  calification: user.calification || 0,
                  total_califications: user.total_califications || 0,
                  service_radius: user.service_radius,
                  ubication_json: userLocation,
                  category_id: item.category_id,
                  subcategory_id: item.subcategory_id,
                  distance: Math.round(distance * 10) / 10,
                  membership_json: user.membership_json,
                };
              }
              return null;
            })
            .filter(Boolean) as NearbyProfessional[]) || [];

        return professionals;
      }

      // Procesar profesionales
      const professionals: NearbyProfessional[] =
        (combinedData
          ?.map((item: any) => {
            const user = item.users;
            if (!user) {
              return null;
            }

            if (user.rol !== "professional") {
              return null;
            }

            const userLocation = user.ubication_json;
            if (!userLocation?.latitude || !userLocation?.longitude) {
              return null;
            }

            // Calcular distancia
            const distance = calculateDistance(
              location.latitude,
              location.longitude,
              userLocation.latitude,
              userLocation.longitude
            );

            // Filtrar por radio de servicio y distancia máxima
            const serviceRadiusKm = user.service_radius || 0;

            if (distance <= maxDistance && distance <= serviceRadiusKm) {
              return {
                id: user.id,
                name: user.name,
                last_name: user.last_name,
                profile_pic: user.profile_pic,
                calification: user.calification || 0,
                total_califications: user.total_califications || 0,
                service_radius: user.service_radius,
                ubication_json: userLocation,
                category_id: item.category_id,
                subcategory_id: item.subcategory_id,
                distance: Math.round(distance * 10) / 10,
                membership_json: user.membership_json,
              };
            }
            return null;
          })
          .filter(Boolean) as NearbyProfessional[]) || [];

      return professionals;
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// Haversine
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
} 