import { useUserRole } from "@/features/request/hooks/useUserRole";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ChatsHeader from "../../../../features/chats/components/ChatsHeader";
import ChatsList from "../../../../features/chats/components/ChatsList";
import ChatsTabs from "../../../../features/chats/components/ChatsTabs";

// Datos de ejemplo - esto vendría de tu API
const mockChats = [
  {
    id: "1",
    professionalName: "Lautaro Kaufmann",
    professionalImage:
      "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no",
    lastMessage: "Perfecto, puedo ir mañana a las 10:00 AM. ¿Te parece bien?",
    lastMessageTime: "14:30",
    unreadCount: 2,
    mainCategory: "Servicios del hogar",
    subCategory: "Reparación de aire acondicionado",
    status: "active" as const,
  },
  {
    id: "2",
    professionalName: "María González",
    professionalImage: "https://example.com/avatar2.jpg",
    lastMessage:
      "Ya terminé el trabajo. ¿Puedes revisar si todo está como esperabas?",
    lastMessageTime: "Ayer",
    unreadCount: 0,
    mainCategory: "Limpieza",
    subCategory: "Limpieza de hogar",
    status: "completed" as const,
  },
  {
    id: "3",
    professionalName: "Roberto Silva",
    professionalImage: "https://example.com/avatar3.jpg",
    lastMessage:
      "Hola, estoy interesado en tu solicitud. ¿Podrías darme más detalles?",
    lastMessageTime: "Lun",
    unreadCount: 1,
    mainCategory: "Plomería",
    subCategory: "Reparación de cañerías",
    status: "pending" as const,
  },
  {
    id: "4",
    professionalName: "Ana López",
    professionalImage: "https://example.com/avatar4.jpg",
    lastMessage: "El trabajo está en progreso. Te envío fotos del avance.",
    lastMessageTime: "12:45",
    unreadCount: 0,
    mainCategory: "Pintura",
    subCategory: "Pintura de interiores",
    status: "active" as const,
  },
  {
    id: "5",
    professionalName: "Juan Pérez",
    professionalImage: "https://example.com/avatar5.jpg",
    lastMessage: "Excelente trabajo. Muchas gracias por todo.",
    lastMessageTime: "Hace 2 días",
    unreadCount: 0,
    mainCategory: "Albañilería",
    subCategory: "Instalación de cerámica",
    status: "completed" as const,
  },
];

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

  // Calcular conteos para cada categoría
  const counts = {
    active: mockChats.filter((chat) => chat.status === "active").length,
    pending: mockChats.filter((chat) => chat.status === "pending").length,
    completed: mockChats.filter((chat) => chat.status === "completed").length,
  };

  const handleChatPress = (chatId: string) => {
    // Navegar al chat individual
    router.push(`/chats/${chatId}`);
  };

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

  const handleRefresh = () => {
    // Recargar chats
    console.log("Refrescando chats");
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

      <ChatsTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={counts}
      />

      <ChatsList
        chats={mockChats}
        userRole={userRole}
        activeTab={activeTab}
        onChatPress={handleChatPress}
        onStartChat={handleStartChat}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

export default ChatsScreen;
