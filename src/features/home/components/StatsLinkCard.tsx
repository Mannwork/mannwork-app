import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Importa el hook
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const StatsLinkCard: React.FC = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push("/(protected)/(mainTabs)/home/professional-stats")}
      className="bg-green-mannwork-light rounded-2xl border-2 border-green-mannwork px-6 py-5 mx-4 mt-4 mb-2 shadow-md flex-row items-center"
    >
      <View className="bg-green-mannwork rounded-full w-12 h-12 items-center justify-center mr-4">
        <MaterialIcons name="insert-chart" size={30} color="#fff" />
      </View>
      <View className="flex-1">
        <Text className="text-xl font-bold text-green-mannwork mb-1">Ver estadísticas</Text>
        <Text className="text-base text-gray-700">Consultá tu desempeño y evolución como profesional</Text>
      </View>
    </TouchableOpacity>
  );
};

export default StatsLinkCard;