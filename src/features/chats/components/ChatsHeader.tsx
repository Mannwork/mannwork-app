import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatStore } from "../store/chat.store";

interface ChatsHeaderProps {
    userRole: "client" | "professional";
}

const ChatsHeader = ({ userRole }: ChatsHeaderProps) => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchTextLocal, setSearchTextLocal] = useState("");

    const { setSearchText } = useChatStore();

    const insets = useSafeAreaInsets();

    const getSubtitle = () => {
        return userRole === "client"
            ? "Comunícate con profesionales"
            : "Gestiona tus conversaciones";
    };

    const handleSearchTextChange = (text: string) => {
        setSearchTextLocal(text);
        setTimeout(() => setSearchText(text), 500);
    };

    return (
        <View
            className="bg-green-mannwork px-4 py-4"
            style={{ paddingTop: insets.top + 10 }}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-2xl font-bold text-white">Chats</Text>
                    <Text className="text-white/80 text-sm mt-1">
                        {getSubtitle()}
                    </Text>
                </View>

                <View className="flex-row items-center gap-3">
                    <Pressable
                        onPress={() => setIsSearching(!isSearching)}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                    >
                        <MaterialIcons
                            name="search"
                            size={20}
                            color="#FFFFFF"
                        />
                    </Pressable>

                    {/* {onFilter && (
                        <Pressable
                            onPress={onFilter}
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        >
                            <MaterialIcons
                                name="filter-list"
                                size={20}
                                color="#FFFFFF"
                            />
                        </Pressable>
                    )} */}
                </View>
            </View>
            {isSearching && (
                <View className="mt-4">
                    <TextInput
                        placeholder="Buscar"
                        className="bg-white/20 rounded-full px-4 py-2 placeholder:text-white text-white"
                        value={searchTextLocal}
                        onChangeText={handleSearchTextChange}
                    />
                </View>
            )}
        </View>
    );
};

export default ChatsHeader;
