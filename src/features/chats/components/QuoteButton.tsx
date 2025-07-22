import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { postNewMessage } from "../services/post-new-message";

interface QuoteButtonProps {
    chatId: string;
    onViewQuote?: () => void;
    userRole: "client" | "professional";
    hasQuote?: boolean;
}

const QuoteButton = ({
    onViewQuote,
    userRole,
    hasQuote = false,
    chatId,
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

    const handlePress = () => {
        if (hasQuote && onViewQuote) {
            onViewQuote();
        } else {
            postNewMessage({
                content: "",
                chat_id: chatId,
                sender_id: userId as string,
                type: "quote_request",
            });
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
