import { ActivityIndicator, Text, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Buscando profesionales cercanos...",
}: LoadingStateProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#2D7A3E" />
      <Text className="text-gray-600 mt-4">{message}</Text>
    </View>
  );
}
