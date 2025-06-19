import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface EmptyChatsStateProps {
  onStartChat?: () => void;
  userRole: "client" | "professional";
}

const EmptyChatsState = ({ onStartChat, userRole }: EmptyChatsStateProps) => {
  const getTitle = () => {
    return userRole === "client"
      ? "No tienes chats aún"
      : "No tienes conversaciones activas";
  };

  const getSubtitle = () => {
    return userRole === "client"
      ? "Cuando contactes a un profesional para un trabajo, aparecerá aquí tu conversación"
      : "Cuando un cliente te contacte para un trabajo, aparecerá aquí la conversación";
  };

  const getButtonText = () => {
    return userRole === "client" ? "Buscar profesionales" : "Ver solicitudes";
  };

  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
        <MaterialIcons name="chat-bubble-outline" size={48} color="#9CA3AF" />
      </View>

      <Text className="text-gray-900 text-xl font-bold text-center mb-3">
        {getTitle()}
      </Text>

      <Text className="text-gray-600 text-base text-center leading-6 mb-8">
        {getSubtitle()}
      </Text>

      {onStartChat && (
        <Pressable
          onPress={onStartChat}
          className="bg-green-mannwork rounded-lg px-6 py-3"
        >
          <Text className="text-white font-semibold text-base">
            {getButtonText()}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default EmptyChatsState;
