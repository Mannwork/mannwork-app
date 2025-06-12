import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const SearchBarInput = () => (
  <Pressable
    onPress={() => router.push("/(protected)/(mainTabs)/home/search-modal")}
  >
    <View className="flex-row items-center bg-gray-200 rounded-full px-4 py-2 mx-4 mt-4">
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <View className="py-3">
            <Text className="text-base text-gray-400">¿Qué necesitas?</Text>
          </View>
          <MaterialIcons name="search" size={24} color="#2D7A3E" />
        </View>
      </View>
    </View>
  </Pressable>
);

export default SearchBarInput;
