import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendImage?: () => void;
  onSendFile?: () => void;
  placeholder?: string;
}

const ChatInput = ({
  onSendMessage,
  onSendImage,
  onSendFile,
  placeholder = "Escribe un mensaje...",
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <View className="bg-white border-t border-gray-200 px-4 py-3">
      <View className="flex-row items-end">
        <Pressable
          onPress={onSendImage}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3 mb-2"
        >
          <MaterialIcons name="image" size={20} color="#6B7280" />
        </Pressable>

        <Pressable
          onPress={onSendFile}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3 mb-2"
        >
          <MaterialIcons name="attach-file" size={20} color="#6B7280" />
        </Pressable>

        <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-3 min-h-[40px] justify-center">
          <TextInput
            value={message}
            onChangeText={setMessage}
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
          disabled={!message.trim()}
          className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${
            message.trim() ? "bg-green-mannwork" : "bg-gray-300"
          }`}
        >
          <MaterialIcons
            name="send"
            size={20}
            color={message.trim() ? "#FFFFFF" : "#9CA3AF"}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default ChatInput;
