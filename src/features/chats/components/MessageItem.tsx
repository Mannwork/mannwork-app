import { Text, View } from "react-native";

import { Message } from "@/common/types/message.type";
import { formatTime } from "@/common/utils/formatTime";
import MessageFile from "./MessageFile";
import MessageImage from "./MessageImage";
import QuoteCard from "./QuoteCard";
import QuoteRequestCard from "./QuoteRequestCard";

interface MessageItemProps {
    userLogged: string;
    message: Message;
    onQuoteRequest?: () => void;
    isQuoted?: boolean;
    requestId?: string;
}

const MessageItem = ({
    userLogged,
    message,
    onQuoteRequest,
    isQuoted = false,
    requestId,
}: MessageItemProps) => {
    const formattedTime = formatTime(message.created_at);

    const renderMessageContent = () => {
        switch (message.type) {
            case "image":
                return <MessageImage message={message} />;

            case "file":
                return <MessageFile message={message} />;

            case "quote_request":
                return (
                    <QuoteRequestCard
                        onQuote={onQuoteRequest || (() => {})}
                        isFromMe={message.sender_id === userLogged}
                        timestamp={formattedTime}
                        isQuoted={isQuoted}
                    />
                );

            case "quote":
                return (
                    <QuoteCard
                        quoteId={message.content}
                        timestamp={formattedTime}
                        requestId={requestId || ""}
                    />
                );

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
                        {formattedTime}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default MessageItem;
