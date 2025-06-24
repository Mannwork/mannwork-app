import { ActivityIndicator, Text, View } from "react-native";

const LoadingState = () => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#2D7A3E" />
      <Text className="text-gray-600 mt-4">Cargando solicitudes...</Text>
    </View>
  );
};

export default LoadingState;
