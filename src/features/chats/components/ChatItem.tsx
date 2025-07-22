import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useChatStore } from "../store/chat.store";

interface ChatItemProps {
    chat: {
        id: string;
        professionalName: string;
        professionalImage?: string;
        lastMessage: string;
        lastMessageTime: string;
        unreadCount: number;
        mainCategory: string;
        subCategory: string;
        status: "active" | "completed" | "pending";
        request_id?: string;
        client_id?: string;
        professional_id?: string;
    };
}

const ChatItem = ({ chat }: ChatItemProps) => {
    const { setActualChatData } = useChatStore();

    // const getStatusColor = (status: string) => {
    //     switch (status) {
    //         case "active":
    //             return "bg-green-500";
    //         case "completed":
    //             return "bg-gray-500";
    //         case "pending":
    //             return "bg-yellow-500";
    //         default:
    //             return "bg-gray-500";
    //     }
    // };

    // Formatear el nombre para mostrar solo la primera letra del apellido
    const formatName = (fullName: string) => {
        const names = fullName.split(" ");
        if (names.length >= 2) {
            const firstName = names[0];
            const lastName = names[names.length - 1];
            return `${firstName} ${lastName.charAt(0)}.`;
        }
        return fullName;
    };

    const handleChatPress = () => {
        // Navegar al chat individual
        setActualChatData({
            professionalName: chat.professionalName,
            professionalImage: chat.professionalImage || "",
            mainCategory: chat.mainCategory,
            subCategory: chat.subCategory,
            status: chat.status,
            request_id: chat.request_id,
            client_id: chat.client_id,
            professional_id: chat.professional_id,
        });

        router.push(`/chats/${chat.id}`);
    };

    return (
        <Pressable
            onPress={handleChatPress}
            className="flex-row items-center px-6 py-5 border-b border-gray-100 bg-white"
        >
            <View className="relative">
                <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center overflow-hidden">
                    {chat.professionalImage ? (
                        <Image
                            source={{ uri: chat.professionalImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <MaterialIcons
                            name="person"
                            size={32}
                            color="#6B7280"
                        />
                    )}
                </View>

                {/* <View
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white ${getStatusColor(
                        chat.status
                    )}`}
                /> */}
            </View>

            {/* Contenido del chat */}
            <View className="flex-1 ml-4">
                <View className="flex-row items-center justify-between">
                    <Text className="text-gray-900 font-bold text-lg">
                        {formatName(chat.professionalName)}
                    </Text>
                    <Text className="text-gray-500 text-sm font-medium">
                        {chat.lastMessageTime}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-1">
                        <Text
                            className="text-gray-700 text-base"
                            numberOfLines={1}
                        >
                            {chat.lastMessage}
                        </Text>
                        <View className="mt-2">
                            <Text className="text-green-mannwork text-sm font-semibold">
                                {chat.mainCategory}
                            </Text>
                            <Text className="text-gray-500 text-xs mt-1">
                                {chat.subCategory}
                            </Text>
                        </View>
                    </View>

                    {chat.unreadCount > 0 && (
                        <View className="ml-3">
                            <View className="bg-green-mannwork rounded-full min-w-[24px] h-6 items-center justify-center px-2">
                                <Text className="text-white text-sm font-bold">
                                    {chat.unreadCount > 99
                                        ? "99+"
                                        : chat.unreadCount}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </Pressable>
    );
};

export default ChatItem;
