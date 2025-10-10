import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { Request } from "@/features/request";
import {
    LoadingState,
    RequestsHeader,
    RequestsList,
    RequestsTabs,
    useUserRequests,
    useUserRole,
} from "@/features/request";
import { useAuth } from "@clerk/clerk-expo";

const RequestsScreen = () => {
    const params = useLocalSearchParams();
    const { activeTab: activeTabParam } = params;

    const [activeTab, setActiveTab] = useState<
        "received" | "sent" | "completed"
    >((activeTabParam as "completed") || "received");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
    const { data: userRole, isLoading: isLoadingRole } = useUserRole();
    const { userId } = useAuth();

    // Cambiar la tab inicial según el rol
    useEffect(() => {
        if (userRole === "client") {
            setActiveTab("sent");
        } else if (userRole === "professional") {
            setActiveTab("received");
        }
    }, [userRole]);

    // Lógica para solicitudes enviadas por profesionales
    let requestsQueryRole = userRole;
    if (userRole === "professional" && activeTab === "sent") {
        requestsQueryRole = "client";
    }

    const {
        data: allRequests,
        isLoading: isLoadingRequests,
        refetch,
    } = useUserRequests({
        userRole: requestsQueryRole || "client",
        status: activeTab,
    });

    // Filtrar solicitudes basado en la búsqueda
    const filteredRequests = (allRequests || []).filter((request) => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();

        // Filtrar por nombre de la solicitud (title)
        if (request.title.toLowerCase().includes(query)) return true;

        // Filtrar por categoría
        if (request.category.toLowerCase().includes(query)) return true;

        // Filtrar por subcategoría
        if (request.subcategory.toLowerCase().includes(query)) return true;

        // Filtrar por nombre del cliente
        if (request.client.name.toLowerCase().includes(query)) return true;
        if (request.client.last_name.toLowerCase().includes(query)) return true;

        // Filtrar por nombre de profesionales
        const professionalMatch = request.professionals.some(
            (pro) =>
                pro.rol === "professional" &&
                (pro.name.toLowerCase().includes(query) ||
                    pro.last_name.toLowerCase().includes(query))
        );
        if (professionalMatch) return true;

        return false;
    });

    const requests = filteredRequests;

    const handleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
        if (isSearchVisible) {
            // Si se está cerrando la búsqueda, limpiar el query
            setSearchQuery("");
        }
    };

    const handleCreate = () => {
        // Cambio: ahora abre el modal de búsqueda en lugar de ir a crear
        router.push("/(protected)/(mainTabs)/home/search-modal");
    };

    const handleTabChange = (tab: "received" | "sent" | "completed") => {
        setActiveTab(tab);
    };

    const handleRequestPress = (request: Request) => {
        // Navegar al detalle de la solicitud
        router.push({
            pathname: "/(protected)/(mainTabs)/requests/[requestId]",
            params: { requestId: request.id },
        });
    };

    const handleRefresh = async () => {
        try {
            await refetch();
            console.log("Datos refrescados exitosamente");
        } catch (error) {
            console.error("Error al refrescar datos:", error);
        }
    };

    const handleCreateRequest = () => {
        if (
            userRole === "client" &&
            activeTab === "sent" &&
            (!requests || requests.length === 0)
        ) {
            router.push("/(protected)/(mainTabs)/home/search-modal");
        } else {
            router.push("/(protected)/(mainTabs)/home/create");
        }
    };

    // Loading state
    if (isLoadingRole || isLoadingRequests) {
        return (
            <View className="flex-1 bg-gray-50">
                <RequestsHeader
                    onSearch={handleSearch}
                    onCreate={handleCreate}
                    isSearchVisible={isSearchVisible}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                />
                <LoadingState />
            </View>
        );
    }

    // Guest user state
    if (!userId || !userRole) {
        return (
            <View className="flex-1 bg-gray-50">
                <RequestsHeader
                    onSearch={handleSearch}
                    onCreate={handleCreate}
                    isSearchVisible={isSearchVisible}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                />
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Función no disponible
                    </Text>
                    <Text className="text-gray-600 text-center mb-6">
                        Para acceder a las solicitudes, necesitas iniciar sesión con tu cuenta.
                    </Text>
                    <Pressable
                        onPress={() => router.push("/(auth)/sign-in")}
                        className="bg-green-mannwork px-6 py-3 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Iniciar Sesión</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <RequestsHeader
                onSearch={handleSearch}
                onCreate={handleCreate}
                isSearchVisible={isSearchVisible}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
            />
            <RequestsTabs
                userRole={userRole || "client"}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
            <RequestsList
                requests={requests || []}
                userRole={userRole || "client"}
                activeTab={activeTab}
                onRequestPress={handleRequestPress}
                onCreateRequest={handleCreateRequest}
                onBrowseRequests={handleCreate}
                onRefresh={handleRefresh}
                isLoading={isLoadingRequests}
            />
        </View>
    );
};

export default RequestsScreen;
