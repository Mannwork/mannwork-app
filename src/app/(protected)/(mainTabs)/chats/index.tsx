import { useUserRole } from "@/features/request/hooks/useUserRole";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ChatsHeader from "../../../../features/chats/components/ChatsHeader";
import ChatsList from "../../../../features/chats/components/ChatsList";
import ChatsTabs from "../../../../features/chats/components/ChatsTabs";

const ChatsScreen = () => {
    const { data: userRole, isLoading } = useUserRole();
    const router = useRouter();
    const { tab } = useLocalSearchParams<{ tab?: string }>();
    const [activeTab, setActiveTab] = useState<
        "active" | "pending" | "completed"
    >("active");

    // Establecer la pestaña activa basada en el parámetro de URL
    useEffect(() => {
        if (tab && ["active", "pending", "completed"].includes(tab)) {
            setActiveTab(tab as "active" | "pending" | "completed");
        }
    }, [tab]);

    if (isLoading || !userRole) return null;

    const handleSearch = () => {
        // Implementar búsqueda de chats
        console.log("Buscar chats");
    };

    const handleFilter = () => {
        // Implementar filtros de chats
        console.log("Filtrar chats");
    };

    const handleStartChat = () => {
        // Navegar a buscar profesionales o solicitudes
        router.push("/(protected)/(mainTabs)/requests");
    };

    const handleTabChange = (tab: "active" | "pending" | "completed") => {
        setActiveTab(tab);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ChatsHeader
                userRole={userRole}
                onSearch={handleSearch}
                onFilter={handleFilter}
            />

            <ChatsTabs activeTab={activeTab} onTabChange={handleTabChange} />

            <ChatsList
                userRole={userRole}
                activeTab={activeTab}
                onStartChat={handleStartChat}
            />
        </View>
    );
};

export default ChatsScreen;
