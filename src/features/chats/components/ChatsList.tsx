import { useCallback, useMemo } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    View,
} from "react-native";
import { useChatList } from "../hooks/useChatList";
import ChatItem from "./ChatItem";
import EmptyChatsState from "./EmptyChatsState";

interface ChatListProps {
    userRole: "client" | "professional";
    activeTab: "active" | "pending" | "completed";
    onStartChat?: () => void;
}

const ChatsList = ({ userRole, activeTab, onStartChat }: ChatListProps) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isRefetching,
        refetch,
    } = useChatList({ pageSize: 10, statusSelected: activeTab });

    // Aplanar los datos de todas las páginas
    const allChats = useMemo(() => {
        return data?.pages.flatMap((page) => page) || [];
    }, [data]);

    const renderChatItem = useCallback(
        ({ item }: { item: any }) => <ChatItem chat={item} />,
        []
    );

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

    return (
        <FlatList
            data={allChats}
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
