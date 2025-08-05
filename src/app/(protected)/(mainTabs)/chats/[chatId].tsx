import ChatHeader from "@/features/chats/components/ChatHeader";
import ChatInput from "@/features/chats/components/ChatInput";
import QuoteButton from "@/features/chats/components/QuoteButton";
import { useChatMessages } from "@/features/chats/hooks/useChatMessages";
import { updateMessagesReadStatus } from "@/features/chats/services/update-messages-read-status";
import { useUserRole } from "@/features/request";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MessageItem from "../../../../features/chats/components/MessageItem";

const ChatScreen = () => {
    const { chatId } = useLocalSearchParams();
    const { userId } = useAuth();
    const {
        data: messagesPage,
        isLoading,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
    } = useChatMessages(chatId as string);
    const router = useRouter();
    const { data: userRole } = useUserRole();
    const insets = useSafeAreaInsets();

    // Profesional abre modal de cotización
    const handleQuoteRequest = () => {
        router.push(`/chats/quote-modal?chatId=${chatId}`);
    };

    useEffect(() => {
        updateMessagesReadStatus(chatId as string, userId as string);
    }, [chatId, userId]);

    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Error al cargar mensajes</Text>;

    const messages = messagesPage?.pages.flatMap((page) => page.messages) || [];
    const hasActiveQuote = messagesPage?.pages.some((page) => page.hasActiveQuote) || false;

    const renderMessage = ({ item }: { item: any }) => (
            <MessageItem
                userLogged={userId as string}
                message={item}
                onQuoteRequest={
                    userRole === "professional" ? handleQuoteRequest : undefined
                }
                isQuoted={hasActiveQuote}
            />
    )

    const handleFetchNextPage = async () => {
        if (hasNextPage) {
            await fetchNextPage();
        }

        return;
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
        >
            <View className="flex-1 bg-gray-50">
                <ChatHeader />

                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refetch}
                        />
                    }
                    onEndReachedThreshold={0.5}
                    onEndReached={handleFetchNextPage}
                    inverted
                />

                {/* Botón de cotización */}
                {userRole === "client" && (
                    <QuoteButton
                        chatId={chatId as string}
                        userRole={userRole}
                        hasQuote={messagesPage?.pages.some((page) => page.hasActiveQuote)}
                    />
                )}

                <ChatInput
                    chatId={chatId as string}
                    senderId={userId as string}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;
