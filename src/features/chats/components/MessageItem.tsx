import { Image, Text, View } from "react-native";

import { Message } from "@/common/types/message.type";
import QuoteRequestCard from "./QuoteRequestCard";

interface MessageItemProps {
    userLogged: string;
    message: Message;
    onQuoteRequest?: () => void;
    onPayQuote?: () => void;
}

const MessageItem = ({
    userLogged,
    message,
    onQuoteRequest,
    onPayQuote,
}: MessageItemProps) => {
    const formatTime = (timestamp: string) => {
        // Aquí podrías implementar lógica para formatear la hora
        return timestamp;
    };

    const renderMessageContent = () => {
        switch (message.type) {
            case "image":
                return (
                    <View className="rounded-lg overflow-hidden">
                        <Image
                            source={{ uri: message.content }}
                            className="w-48 h-32"
                            resizeMode="cover"
                        />
                    </View>
                );

            // case "file":
            //   return (
            //     <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
            //       <MaterialIcons name="attach-file" size={20} color="#6B7280" />
            //       <Text className="text-gray-700 text-sm ml-2 flex-1">
            //         {message.fileName}
            //       </Text>
            //     </View>
            //   );

            case "quote_request":
                return (
                    <QuoteRequestCard
                        onQuote={onQuoteRequest || (() => {})}
                        isFromMe={message.sender_id === userLogged}
                        status={"pending"}
                        timestamp={message.created_at}
                    />
                );

            // case "quote":
            //   return (
            //     <QuoteCard
            //       quote={message.quote!}
            //       isFromMe={message.isFromMe}
            //       onPay={onPayQuote}
            //       status={message.quoteStatus || "pending"}
            //       timestamp={message.timestamp}
            //     />
            //   );

            default:
                return (
                    <Text
                        className={`text-base ${
                            message.sender_id === userLogged
                                ? "text-white"
                                : "text-gray-900"
                        }`}
                    >
                        {message.content}
                    </Text>
                );
        }
    };

    // Para mensajes normales, mantener el bubble. Para cards, no usar bubble extra.
    if (message.type === "quote_request" || message.type === "quote") {
        return <View className="px-4 py-2">{renderMessageContent()}</View>;
    }

    return (
        <View
            className={`px-4 py-2 ${
                message.sender_id === userLogged ? "items-end" : "items-start"
            }`}
        >
            <View
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender_id === userLogged
                        ? "bg-green-mannwork rounded-br-md"
                        : "bg-gray-200 rounded-bl-md"
                }`}
            >
                {renderMessageContent()}

                <View
                    className={`mt-2 ${
                        message.sender_id === userLogged
                            ? "items-end"
                            : "items-start"
                    }`}
                >
                    <Text
                        className={`text-xs ${
                            message.sender_id === userLogged
                                ? "text-white/80"
                                : "text-gray-500"
                        }`}
                    >
                        {formatTime(message.created_at)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default MessageItem;
