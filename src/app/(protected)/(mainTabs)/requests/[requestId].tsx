import { useAllSubcategories } from "@/common/hooks/useAllSubcategories";
import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useUserRole } from "@/features/request";
import RequestDetailModal from "@/features/request/components/RequestDetailModal";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

const RequestDetailScreen = () => {
    const { requestId } = useLocalSearchParams<{ requestId: string }>();
    const router = useRouter();
    const { data: userRole, isLoading: isLoadingRole } = useUserRole();
    const { subcategories: allSubcategories } = useAllSubcategories();

    // Fetch real de la solicitud
    const { data: request, isLoading } = useQuery({
        queryKey: ["request-detail", requestId, allSubcategories],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("requests")
                .select(`*, categories!requests_category_fkey(name)`)
                .eq("id", requestId)
                .single();
            if (error) throw error;

            // Parsear la ubicación JSON
            const locationData = data.location ? JSON.parse(data.location) : {};

            // Buscar el nombre de la subcategoría
            const subcategoryName =
                allSubcategories.find((sub) => sub.id === data.subcategory)
                    ?.name ||
                data.subcategory ||
                "Subcategoría no disponible";

            // Mapear el estado de la base de datos al formato esperado
            const mapStatus = (dbStatus: string) => {
                switch (dbStatus) {
                    case "searching":
                        return "pending";
                    case "accepted":
                        return "in_progress";
                    case "working":
                        return "in_progress";
                    case "paid":
                        return "completed";
                    case "completed":
                        return "completed";
                    case "cancelled":
                        return "cancelled";
                    default:
                        return "pending";
                }
            };

            // Obtener profesionales asociados a esta solicitud
            const { data: requestProfessionals } = await supabase
                .from("request_professionals")
                .select(
                    `
          professional_id,
          users!request_professionals_professional_id_fkey(
            id,
            name,
            last_name
          )
        `
                )
                .eq("request_id", requestId);

            // Obtener información del cliente
            const { data: clientData } = await supabase
                .from("users")
                .select("id, name, last_name")
                .eq("id", data.client)
                .single();

            // Transformar profesionales al formato esperado
            const professionals =
                requestProfessionals?.map((rp: any) => ({
                    id: rp.professional_id,
                    name: rp.users?.name || "",
                    lastName: rp.users?.last_name || "",
                    role: "professional" as const,
                })) || [];

            // Crear array de usuarios incluyendo cliente y profesionales
            const users = [
                // Agregar cliente si existe
                ...(clientData
                    ? [
                          {
                              id: clientData.id,
                              name: clientData.name,
                              lastName: clientData.last_name,
                              role: "client" as const,
                          },
                      ]
                    : []),
                // Agregar profesionales
                ...professionals,
            ];

            return {
                id: data.id,
                title: data.name,
                description: data.description,
                category: data.categories?.name || "Categoría no disponible",
                subcategory: subcategoryName,
                location: {
                    address: locationData.address || "Dirección no disponible",
                    city: locationData.city || "",
                    province: locationData.province || "",
                },
                images: data.photos || [],
                status: mapStatus(data.status) as
                    | "pending"
                    | "in_progress"
                    | "completed"
                    | "cancelled",
                createdAt: data.inserted_at,
                userRole: userRole || "client",
                client: {
                    name: clientData?.name || "",
                    lastName: clientData?.last_name || "",
                },
                users: users,
            };
        },
        enabled: !!requestId && !!allSubcategories.length,
    });

    const handleClose = () => router.back();

    const handleUpdateStatus = async (
        newStatus: "pending" | "in_progress" | "completed" | "cancelled"
    ) => {
        try {
            // Mapear el estado del frontend al estado de la base de datos
            const mapStatusToDB = (status: string) => {
                switch (status) {
                    case "pending":
                        return "searching";
                    case "in_progress":
                        return "working";
                    case "completed":
                        return "completed";
                    case "cancelled":
                        return "cancelled";
                    default:
                        return "searching";
                }
            };

            const dbStatus = mapStatusToDB(newStatus);

            const { error } = await supabase
                .from("requests")
                .update({ status: dbStatus })
                .eq("id", requestId);

            if (error) {
                console.error("Error al actualizar estado:", error);
                return;
            }

            console.log("Estado actualizado a:", newStatus);
            // TODO: Refrescar los datos o navegar de vuelta
            router.back();
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        }
    };

    // Nueva función para navegar al perfil del profesional
    const handleProfessionalPress = (userId: string) => {
        router.push({
            pathname: "/(protected)/users/[userId]",
            params: { userId },
        });
    };

    if (isLoadingRole || isLoading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#2D7A3E" />
            </View>
        );
    }

    if (!request) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#2D7A3E" />
            </View>
        );
    }

    return (
        <RequestDetailModal
            request={request}
            currentUserRole={userRole || "client"}
            isVisible={true}
            onClose={handleClose}
            onUpdateStatus={handleUpdateStatus}
            onProfessionalPress={handleProfessionalPress}
        />
    );
};

export default RequestDetailScreen;
