import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, RefreshControl, Text, View } from "react-native";
import ChatItem from "./ChatItem";
import EmptyChatsState from "./EmptyChatsState";

interface Chat {
    id: string;
    professionalName: string;
    professionalImage?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    mainCategory: string;
    subCategory: string;
    status: "active" | "completed" | "pending";
}

interface ChatsListProps {
    chats: Chat[];
    userRole: "client" | "professional";
    activeTab: "active" | "pending" | "completed";
    isLoading?: boolean;
    onRefresh?: () => void;
    onChatPress: (chatId: string) => void;
    onStartChat?: () => void;
}

const ChatsList = ({
    chats,
    userRole,
    activeTab,
    isLoading = false,
    onRefresh,
    onChatPress,
    onStartChat,
}: ChatsListProps) => {
    // Filtrar chats por el tab activo
    const filteredChats = chats.filter((chat) => chat.status === activeTab);

    const renderChatItem = ({ item }: { item: Chat }) => (
        <ChatItem chat={item} onPress={() => onChatPress(item.id)} />
    );

    // Si no hay chats en ninguna categoría, mostrar estado vacío general
    if (chats.length === 0) {
        return (
            <EmptyChatsState userRole={userRole} onStartChat={onStartChat} />
        );
    }

    // Si no hay chats en la categoría seleccionada, mostrar mensaje específico
    if (filteredChats.length === 0) {
        const getEmptyMessage = () => {
            switch (activeTab) {
                case "active":
                    return {
                        title: "No tienes trabajos activos",
                        subtitle: "Los trabajos en curso aparecerán aquí",
                        icon: "work-outline",
                    };
                case "pending":
                    return {
                        title: "No tienes trabajos pendientes",
                        subtitle: "Las solicitudes pendientes aparecerán aquí",
                        icon: "schedule",
                    };
                case "completed":
                    return {
                        title: "No tienes trabajos completados",
                        subtitle: "Los trabajos finalizados aparecerán aquí",
                        icon: "check-circle-outline",
                    };
            }
        };

        const emptyMessage = getEmptyMessage();

        return (
            <View className="flex-1 items-center justify-center px-8 py-12">
                <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
                    <MaterialIcons
                        name={emptyMessage.icon as any}
                        size={48}
                        color="#9CA3AF"
                    />
                </View>
                <Text className="text-gray-900 text-xl font-bold text-center mb-3">
                    {emptyMessage.title}
                </Text>
                <Text className="text-gray-600 text-base text-center leading-6">
                    {emptyMessage.subtitle}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={onRefresh}
                    tintColor="#2D7A3E"
                    colors={["#2D7A3E"]}
                />
            }
            contentContainerStyle={{ flexGrow: 1 }}
        />
    );
};

export default ChatsList;
