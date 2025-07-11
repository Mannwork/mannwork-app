import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface SendRequestButtonProps {
  selectedCount: number;
  loading: boolean;
  error?: string;
  onPress: () => void;
}

export default function SendRequestButton({
  selectedCount,
  loading,
  error,
  onPress,
}: SendRequestButtonProps) {
  return (
    <View className="absolute bg-red-5 left-0 right-0 bottom-0 px-6 pb-6">
      <View className="absolute left-0 right-0 bottom-0 top-0 bg-white z-0" />
      <Pressable
        className={`rounded-xl py-3 mt-4 items-center justify-center shadow-lg ${
          selectedCount === 0 ? "bg-gray-300" : "bg-green-mannwork"
        } z-10`}
        onPress={onPress}
        style={{
          elevation: 8,
          opacity: selectedCount === 0 || loading ? 0.6 : 1,
        }}
        disabled={selectedCount === 0 || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Enviar solicitud</Text>
        )}
      </Pressable>
      {error && <Text className="text-red-500 text-center mt-2">{error}</Text>}
    </View>
  );
}
