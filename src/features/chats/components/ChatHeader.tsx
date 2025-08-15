import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatStore } from "../store/chat.store";

const ChatHeader = ({ onlineUsers }: { onlineUsers: string[] }) => {
    const { userId } = useAuth();
    const { actualChatData } = useChatStore();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    console.log("onlineUsers", onlineUsers);

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

    const getStatusColor = () => {
        if (userId === actualChatData.professional_id) {
            if (onlineUsers.includes(actualChatData.client_id as string)) {
                return "bg-green-500";
            } else {
                return "bg-gray-500";
            }
        } else {
            if (
                onlineUsers.includes(actualChatData.professional_id as string)
            ) {
                return "bg-green-500";
            } else {
                return "bg-gray-500";
            }
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "active":
                return "Activo";
            case "completed":
                return "Completado";
            case "pending":
                return "Pendiente";
            default:
                return "Desconocido";
        }
    };

    useEffect(() => {}, [actualChatData]);

    return (
        <View
            className="bg-green-mannwork px-4 py-3"
            style={{ paddingTop: insets.top + 10 }}
        >
            <View className="flex-row items-center">
                <Pressable
                    onPress={() =>
                        router.replace("/(protected)/(mainTabs)/chats")
                    }
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3"
                >
                    <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color="#FFFFFF"
                    />
                </Pressable>

                <View className="flex-1 flex-row items-center">
                    <View className="relative">
                        <View className="w-12 h-12 bg-white rounded-full items-center justify-center overflow-hidden">
                            {actualChatData.professionalImage ? (
                                <Image
                                    source={{
                                        uri: actualChatData.professionalImage,
                                    }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <MaterialIcons
                                    name="person"
                                    size={24}
                                    color="#2D7A3E"
                                />
                            )}
                        </View>

                        <View
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor()}`}
                        />
                    </View>

                    <View className="ml-3 flex-1">
                        <Text className="text-white font-bold text-lg">
                            {formatName(actualChatData.professionalName)}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <View
                                className={`w-2 h-2 rounded-full mr-2 ${getStatusColor()}`}
                            />
                            <Text className="text-white/80 text-sm">
                                {getStatusText(actualChatData.status)}
                            </Text>
                        </View>
                    </View>
                </View>

                <Pressable
                    // onPress={onOptionsPress}
                    className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                >
                    <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
                </Pressable>
            </View>

            <View className="mt-3 bg-white/10 rounded-lg px-3 py-2">
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-white/90 text-sm font-medium">
                            {actualChatData.mainCategory}
                        </Text>
                        <Text className="text-white/70 text-xs mt-1">
                            {actualChatData.subCategory}
                        </Text>
                    </View>
                    <MaterialIcons name="work" size={16} color="#FFFFFF" />
                </View>
            </View>
        </View>
    );
};

export default ChatHeader;
