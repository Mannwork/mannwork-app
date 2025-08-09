import { Linking, Pressable, Text } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import type { Message } from "@/common/types/message.type";

interface Props {
    message: Message;
}

const MessageFile = ({ message }: Props) => {
    return (
        <Pressable
            className="w-[45%] h-14 flex-row items-center bg-gray-100 rounded-lg p-3"
            onPress={() => {
                Linking.openURL(message.content);
            }}
        >
            <MaterialIcons name="attach-file" size={20} color="#6B7280" />
            <Text className="text-gray-700 text-sm ml-2 flex-1">
                Archivo adjunto
            </Text>
        </Pressable>
    );
};

export default MessageFile;
