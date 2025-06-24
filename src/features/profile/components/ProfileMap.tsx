import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface ProfileMapProps {
  coverageRadius: number;
  onPress?: () => void;
}

const ProfileMap = ({ coverageRadius, onPress }: ProfileMapProps) => {
  return (
    <View className="bg-white px-4 py-4">
      <Text className="text-xl font-bold text-green-mannwork mb-3">
        Ubicación
      </Text>

      <View className="flex-row items-center my-1 mb-5">
        <MaterialIcons name="location-on" size={24} color="#2D7A3E" />
        <Text className="text-base text-gray-600 ml-2">
          Radio de cobertura:{" "}
          <Text className="font-semibold text-green-mannwork">
            {coverageRadius}km
          </Text>
        </Text>
      </View>

      <Pressable
        onPress={onPress}
        className="bg-gray-100 rounded-lg h-32 items-center justify-center"
      >
        <MaterialIcons name="map" size={48} color="#2D7A3E" />
        <Text className="text-sm text-gray-600 mt-2">
          Ver mapa de cobertura
        </Text>
      </Pressable>
    </View>
  );
};

export default ProfileMap;
