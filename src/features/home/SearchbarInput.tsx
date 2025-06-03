import { MaterialIcons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

const SearchBarInput = () => (
  <View className="flex-row items-center bg-gray-200 rounded-full px-4 py-2 mx-4 mt-4">
    <TextInput
      className="flex-1 text-base text-gray-800"
      placeholder="¿Qué necesitas?"
      placeholderTextColor="#888"
      style={{ paddingVertical: 3 }}
    />
    <MaterialIcons name="search" size={24} color="#2D7A3E" />
  </View>
);

export default SearchBarInput;
