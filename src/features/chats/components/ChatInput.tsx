import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { postNewMessage } from "../services/post-new-message";

import useSupabaseStorage from "@/common/hooks/useSupabaseStorage";
import { useCurrentUser } from "@/features/profile";
interface ChatInputProps {
    chatId: string;
    senderId: string;
    receptorId: string;
    placeholder?: string;
}

const ChatInput = ({
    chatId,
    senderId,
    receptorId,
    placeholder = "Escribe un mensaje...",
}: ChatInputProps) => {
    const { data: userLogged } = useCurrentUser();

    const { handleUploadImage, handleUploadDocument } =
        useSupabaseStorage(`chats`);

    const [content, setContent] = useState("");

    const handleSend = () => {
        if (content.trim()) {
            postNewMessage({
                content,
                chat_id: chatId,
                sender_id: senderId,
                receptor_id: receptorId,
                type: "text",
            });
            setContent("");
        }
    };

    const handleSendImage = async () => {
        if (
            userLogged?.rol === "professional" &&
            !userLogged?.membership_json?.isPro
        ) {
            alert(
                "Solo los profesionales con membresía Pro pueden enviar imágenes."
            );
            return;
        }

        const imgUri = await handleUploadImage(senderId);
        if (imgUri) {
            postNewMessage({
                content: imgUri,
                chat_id: chatId,
                sender_id: senderId,
                receptor_id: receptorId,
                type: "image",
            });
        }
    };

    const handleSendFile = async () => {
        if (
            userLogged?.rol === "professional" &&
            !userLogged?.membership_json?.isPro
        ) {
            alert(
                "Solo los profesionales con membresía Pro pueden enviar archivos."
            );
            return;
        }

        const fileUri = await handleUploadDocument(senderId, chatId);
        if (fileUri) {
            postNewMessage({
                content: fileUri,
                chat_id: chatId,
                sender_id: senderId,
                receptor_id: receptorId,
                type: "file",
            });
        }
    };

    return (
        <View className="bg-white border-t border-gray-200 px-4 py-3">
            <View className="flex-row items-end">
                <Pressable
                    onPress={handleSendImage}
                    className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3 mb-2"
                >
                    <MaterialIcons name="image" size={20} color="#6B7280" />
                </Pressable>

                <Pressable
                    onPress={handleSendFile}
                    className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3 mb-2"
                >
                    <MaterialIcons
                        name="attach-file"
                        size={20}
                        color="#6B7280"
                    />
                </Pressable>

                <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-3 min-h-[40px] justify-center">
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder={placeholder}
                        placeholderTextColor="#9CA3AF"
                        className="text-gray-900 text-base"
                        multiline
                        maxLength={1000}
                        textAlignVertical="center"
                        style={{
                            paddingTop: 0,
                            paddingBottom: 0,
                            lineHeight: 20,
                        }}
                    />
                </View>

                <Pressable
                    onPress={handleSend}
                    disabled={!content.trim()}
                    className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${
                        content.trim() ? "bg-green-mannwork" : "bg-gray-300"
                    }`}
                >
                    <MaterialIcons
                        name="send"
                        size={20}
                        color={content.trim() ? "#FFFFFF" : "#9CA3AF"}
                    />
                </Pressable>
            </View>
        </View>
    );
};

export default ChatInput;
