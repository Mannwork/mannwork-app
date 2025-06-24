import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import type { Request } from "@/features/request";
import {
  getMockRequestsByTab,
  LoadingState,
  RequestsHeader,
  RequestsList,
  RequestsTabs,
  useUserRole,
} from "@/features/request";

const RequestsScreen = () => {
  const [activeTab, setActiveTab] = useState("received");
  const { data: userRole, isLoading: isLoadingRole } = useUserRole();

  // Simular datos de solicitudes basados en el rol y tab activo
  const requests = userRole
    ? getMockRequestsByTab("professional", activeTab)
    : [];

  const handleSearch = () => {
    // TODO: Implementar búsqueda de solicitudes
    console.log("Buscar solicitudes");
  };

  const handleCreate = () => {
    // Cambio: ahora abre el modal de búsqueda en lugar de ir a crear
    router.push("/(protected)/(mainTabs)/home/search-modal");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleRequestPress = (request: Request) => {
    // Navegar al detalle de la solicitud
    router.push({
      pathname: "/(protected)/(mainTabs)/requests/[requestId]",
      params: { requestId: request.id },
    });
  };

  const handleRefresh = () => {
    // TODO: Implementar refresh de datos
    console.log("Refrescar datos");
  };

  const handleCreateRequest = () => {
    router.replace("/(protected)/(mainTabs)/requests/create");
  };

  const handleBrowseRequests = () => {
    // Si estamos en la pestaña completadas como profesional, ir a chats activos
    if (activeTab === "completed") {
      router.push("/(protected)/(mainTabs)/chats?tab=active");
    } else {
      router.push("/(protected)/(mainTabs)/home");
    }
  };

  if (isLoadingRole || !userRole) {
    return (
      <View className="flex-1 bg-gray-50">
        <RequestsHeader onSearch={handleSearch} onCreate={handleCreate} />
        <LoadingState />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <RequestsHeader onSearch={handleSearch} onCreate={handleCreate} />
      <RequestsTabs
        userRole={"professional"}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <RequestsList
        requests={requests}
        userRole={"professional"}
        activeTab={activeTab}
        onRefresh={handleRefresh}
        onRequestPress={handleRequestPress}
        onCreateRequest={handleCreateRequest}
        onBrowseRequests={handleBrowseRequests}
      />
    </View>
  );
};

export default RequestsScreen;
