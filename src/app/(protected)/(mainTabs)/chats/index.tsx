import ChatsHeader from "@/features/chats/components/ChatsHeader";
import ChatsList from "@/features/chats/components/ChatsList";
import ChatsTabs from "@/features/chats/components/ChatsTabs";
import { useUserRole } from "@/features/request/hooks/useUserRole";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const ChatsScreen = () => {
  const { data: userRole, isLoading } = useUserRole();
  const { userId } = useAuth();
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<
    "active" | "pending" | "completed"
  >("pending");

  // Establecer la pestaña activa basada en el parámetro de URL
  useEffect(() => {
    if (tab && ["active", "pending", "completed"].includes(tab)) {
      setActiveTab(tab as "active" | "pending" | "completed");
    }
  }, [tab]);

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2D7A3E" />
        <Text className="text-gray-600 mt-4">Cargando chats...</Text>
      </View>
    );
  }

  // Guest user state
  if (!userId || !userRole) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Función no disponible
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Para acceder a los chats, necesitas iniciar sesión con tu cuenta.
        </Text>
        <Pressable
          onPress={() => router.push("/(auth)/sign-in")}
          className="bg-green-mannwork px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Iniciar Sesión</Text>
        </Pressable>
      </View>
    );
  }

  const handleStartChat = () => {
    // Navegar a buscar profesionales o solicitudes
    router.push("/(protected)/(mainTabs)/requests");
  };

  const handleTabChange = (tab: "active" | "pending" | "completed") => {
    setActiveTab(tab);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ChatsHeader userRole={userRole} />

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
