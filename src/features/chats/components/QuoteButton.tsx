import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { getQuote } from "../services/get-quote";
import { postNewMessage } from "../services/post-new-message";

interface QuoteButtonProps {
    chatId: string;
    refetch: () => void;
    receptorId: string;
    requestId?: string;
    userRole: "client" | "professional";
    hasQuote?: boolean;
}

const QuoteButton = ({
    refetch,
    receptorId,
    userRole,
    hasQuote = false,
    chatId,
    requestId,
}: QuoteButtonProps) => {
    const { userId } = useAuth();

    const getButtonText = () => {
        if (userRole === "client") {
            return hasQuote ? "Ver cotización" : "Solicitar cotización";
        } else {
            return hasQuote ? "Ver cotización" : "Enviar cotización";
        }
    };

    const getButtonColor = () => {
        return hasQuote ? "bg-blue-500" : "bg-green-mannwork";
    };

    const handlePress = async () => {
        if (hasQuote) {
            // Buscar el último mensaje tipo 'quote' para este chat
            const quote = await getQuote("", chatId);

            if (quote) {
                router.push({
                    pathname: "/(protected)/(mainTabs)/chats/see-quote-modal",
                    params: {
                        quoteId: quote.id,
                        quoteAmount: quote.price?.toString() || "0",
                        quoteDescription: quote.descriptionservice || "",
                        quoteProfessionalName: quote.professionalName || "",
                        quoteProfessionalAvatar: quote.professionalAvatar || "",
                        professionalAccessToken:
                            quote.professionalAccessToken || "",
                        requestId: requestId,
                    },
                });
            }
        } else {
            await postNewMessage({
                content: "",
                chat_id: chatId,
                sender_id: userId as string,
                type: "quote_request",
                receptor_id: receptorId,
            });
            refetch();
        }
    };

    return (
        <View className="bg-white border-t border-gray-200 px-4 py-3">
            <Pressable
                onPress={handlePress}
                className={`${getButtonColor()} rounded-lg py-3 px-4 flex-row items-center justify-center`}
            >
                <MaterialIcons
                    name={hasQuote ? "receipt" : "request-quote"}
                    size={20}
                    color="#FFFFFF"
                />
                <Text className="text-white font-semibold text-base ml-2">
                    {getButtonText()}
                </Text>
            </Pressable>
        </View>
    );
};

export default QuoteButton;
