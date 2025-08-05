import { useAllSubcategories } from "@/common/hooks/useAllSubcategories";
import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { Request } from "../components/RequestCard";

interface UseUserRequestsOptions {
  userRole: "client" | "professional";
  status?: "pending" | "in_progress" | "completed" | "cancelled";
}

export const useUserRequests = ({ userRole, status }: UseUserRequestsOptions) => {
  const { userId } = useAuth();
  const { subcategories: allSubcategories } = useAllSubcategories();

  return useQuery({
    queryKey: ["user-requests", userId, userRole, status, allSubcategories],
    queryFn: async () => {
      if (!userId) throw new Error("No user ID");

      let query;

      if (userRole === "client") {
        // Cliente: obtener solicitudes que él creó con información de categorías
        query = supabase
          .from("requests")
          .select(`
            *,
            categories!requests_category_fkey(name)
          `)
          .eq("client", userId);

        if (status) {
          query = query.eq("status", status);
        }
      } else {
        // Profesional: obtener solicitudes donde él está asociado
        query = supabase
          .from("request_professionals")
          .select(`
            request_id,
            requests!request_professionals_request_id_fkey(
              *,
              categories!requests_category_fkey(name),
              users(
                id,
                name,
                last_name
              )
            )
          `)
          .eq("professional_id", userId).eq("status", "selected");


        if (status) {
          // Filtrar por estado en la tabla requests
          query = query.eq("requests.status", status);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transformar los datos al formato esperado por RequestCard
      const transformedRequests: Request[] = data?.map((item: any) => {
        if (userRole === "client") {
          // Parsear la ubicación JSON
          const locationData = item.location ? JSON.parse(item.location) : {};

          // Buscar el nombre de la subcategoría por id
          const subcategoryName = allSubcategories.find(
            (sub) => sub.id === item.subcategory
          )?.name || item.subcategory || "Subcategoría no disponible";

          return {
            id: item.id,
            title: item.name,
            description: item.description,
            category: item.categories?.name || "Categoría no disponible",
            subcategory: subcategoryName,
            location: {
              address: locationData.address || "Dirección no disponible",
              city: locationData.city || "",
              province: locationData.province || "",
            },
            images: item.photos || [],
            status: item.status,
            createdAt: item.inserted_at,
            userRole: "client" as const,
            client: {
              name: "",
              lastName: "",
              clientId: item.client,
            },
            users: [],
          };
        } else {
          // Para profesionales, los datos vienen de la tabla request_professionals
          const request = item.requests;
          if (!request) {
            // Retornar un objeto Request vacío en lugar de null
            return {
              id: "",
              title: "",
              description: "",
              category: "",
              subcategory: "",
              location: {
                address: "",
                city: "",
                province: "",
              },
              images: [],
              status: "pending" as const,
              createdAt: "",
              userRole: "professional" as const,
              client: {
                name: "",
                lastName: "",
              },
              users: [],
            };
          }

          // Parsear la ubicación JSON
          const locationData = request.location ? JSON.parse(request.location) : {};

          // Buscar el nombre de la subcategoría por id
          const subcategoryName = allSubcategories.find(
            (sub) => sub.id === request.subcategory
          )?.name || request.subcategory || "Subcategoría no disponible";

          return {
            id: request.id,
            title: request.name,
            description: request.description,
            category: request.categories?.name || "Categoría no disponible",
            subcategory: subcategoryName,
            location: {
              address: locationData.address || "Dirección no disponible",
              city: locationData.city || "",
              province: locationData.province || "",
            },
            images: request.photos || [],
            status: request.status,
            createdAt: request.inserted_at,
            userRole: "professional" as const,
            client: {
              name: request.users?.name || "",
              lastName: request.users?.last_name || "",
              clientId: request.users?.id || "",
            },
            // Si la solicitud fue enviada por el profesional, users debe ser el/los destinatario/s profesional/es
            users: item.requests?.request_professionals
              ? item.requests.request_professionals.map((rp: any) => ({
                  id: rp.professional_id,
                  name: rp.users?.name || "",
                  lastName: rp.users?.last_name || "",
                  role: "professional" as const,
                }))
              : request.users
              ? [
                  {
                    id: request.users.id,
                    name: request.users.name,
                    lastName: request.users.last_name,
                    role: "client" as const,
                  },
                ]
              : [],
          };
        }
      }).filter((item) => item.id !== "") || [];

      return transformedRequests;
    },
    enabled: !!userId && !!allSubcategories.length,
  });
}; 