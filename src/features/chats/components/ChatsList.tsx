import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import ChatItem from "./ChatItem";
import EmptyChatsState from "./EmptyChatsState";
import { useChatList } from "../hooks/useChatList";

interface ChatListProps {
    userRole: "client" | "professional";
    activeTab: "active" | "pending" | "completed";
    onChatPress: (chatId: string) => void;
    onStartChat?: () => void;
}

const ChatsList = ({
    userRole,
    activeTab,
    onChatPress,
    onStartChat,
}: ChatListProps) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isRefetching,
        refetch,
    } = useChatList({ pageSize: 10 });

    // Aplanar los datos de todas las páginas
    const allChats = useMemo(() => {
        return data?.pages.flatMap(page => page) || [];
    }, [data]);

    // Filtrar chats por el tab activo
    const filteredChats = useMemo(() => {
        return allChats.filter((chat) => chat.status === activeTab);
    }, [allChats, activeTab]);

    const renderChatItem = useCallback(({ item }: { item: any }) => (
        <ChatItem chat={item} onPress={() => onChatPress(item.id)} />
    ), [onChatPress]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    // Mostrar estado de carga inicial
    if (!data && !isRefetching) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#2D7A3E" />
            </View>
        );
    }

    // Si no hay chats en ninguna categoría, mostrar estado vacío general
    if (allChats.length === 0) {
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
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                isFetchingNextPage ? (
                    <View className="py-4">
                        <ActivityIndicator size="small" color="#2D7A3E" />
                    </View>
                ) : null
            }
            refreshControl={
                <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={handleRefresh}
                    tintColor="#2D7A3E"
                    colors={["#2D7A3E"]}
                />
            }
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        />
    );
};

export default ChatsList;
