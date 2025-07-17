import ChatInput from "@/features/chats/components/ChatInput";
import { useChatMessages } from "@/features/chats/hooks/useChatMessages";
import { useUserRole } from "@/features/request";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
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
    } = useChatMessages(chatId as string);
    const router = useRouter();
    const { data: userRole } = useUserRole();
    const insets = useSafeAreaInsets();

    // Profesional abre modal de cotización
    const handleQuoteRequest = () => {
        router.push(`/chats/quote-modal?chatId=${chatId}`);
    };

    // Cliente abre modal de pago
    const handlePayQuote = (quoteMessage: any) => {
        router.push(
            `/chats/see-quote-modal?quoteAmount=${
                quoteMessage.quote.amount
            }&quoteDescription=${encodeURIComponent(
                quoteMessage.quote.description
            )}&quoteProfessionalName=${encodeURIComponent(
                quoteMessage.quote.professionalName
            )}&quoteProfessionalAvatar=${encodeURIComponent(
                quoteMessage.quote.professionalAvatar || ""
            )}&quoteId=${quoteMessage.id}`
        );
    };

    const renderMessage = ({ item }: { item: any }) => (
        <MessageItem
            userLogged={userId as string}
            message={item}
            onQuoteRequest={
                userRole === "professional" ? handleQuoteRequest : undefined
            }
            onPayQuote={
                userRole === "client" &&
                item.type === "quote" &&
                item.quoteStatus === "pending"
                    ? () => handlePayQuote(item)
                    : undefined
            }
        />
    );

    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Error al cargar mensajes</Text>;

    const messages = messagesPage?.pages.flatMap((page) => page) || [];

    console.log("xddddddddddddddddddddd", messages);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
        >
            <View className="flex-1 bg-gray-50">
                {/* <ChatHeader
                    professionalName={mockChatData.professionalName}
                    professionalImage={mockChatData.professionalImage}
                    mainCategory={mockChatData.mainCategory}
                    subCategory={mockChatData.subCategory}
                    status={mockChatData.status}
                    // onOptionsPress={handleOptionsPress}
                /> */}

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
                />

                {/* Botón de cotización */}
                {/* {userRole === "client" && (
                    // <QuoteButton
                    //     // onRequestQuote={handleRequestQuote}
                    //     // onViewQuote={handleViewQuote}
                    //     userRole={userRole}
                    //     hasQuote={messages.some((m) => m.type === "quote")}
                    // />
                )} */}

                <ChatInput
                    chatId={chatId as string}
                    senderId={userId as string}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;
