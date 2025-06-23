import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import type { Request } from "@/features/request";
import {
  getMockRequestsByTab,
  RequestDetailModal,
  useUserRole,
} from "@/features/request";

const RequestDetailScreen = () => {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const router = useRouter();
  const { data: userRole, isLoading: isLoadingRole } = useUserRole();

  // Simular que somos profesionales
  const simulatedUserRole = "professional";

  // Obtener la solicitud específica (en producción esto vendría de una API)
  const allRequests = [
    ...getMockRequestsByTab(simulatedUserRole, "received"),
    ...getMockRequestsByTab(simulatedUserRole, "completed"),
  ];

  const request = allRequests.find((req) => req.id === requestId) as
    | Request
    | undefined;

  const handleClose = () => {
    // Volver a la pantalla anterior
    router.back();
  };

  const handleContactUser = (userId: string) => {
    // TODO: Implementar navegación al chat
    console.log("Contactar usuario:", userId);
    router.push("/(protected)/(mainTabs)/chats");
  };

  const handleUpdateStatus = (status: Request["status"]) => {
    // TODO: Implementar actualización de estado
    console.log("Actualizar estado a:", status);
    // Volver a la lista después de actualizar
    router.back();
  };

  // Si no hay requestId, redirigir a la lista
  useEffect(() => {
    if (!requestId) {
      router.back();
    }
  }, [requestId, router]);

  // Si no hay solicitud válida, volver atrás
  useEffect(() => {
    if (!isLoadingRole && !request) {
      router.back();
    }
  }, [isLoadingRole, request, router]);

  if (isLoadingRole) {
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
      currentUserRole={simulatedUserRole}
      isVisible={true}
      onClose={handleClose}
      onContact={handleContactUser}
      onUpdateStatus={handleUpdateStatus}
    />
  );
};

export default RequestDetailScreen;
