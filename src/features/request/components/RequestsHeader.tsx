import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RequestsHeaderProps {
  onSearch?: () => void;
  onCreate?: () => void;
  isSearchVisible?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

const RequestsHeader = ({ onSearch, onCreate, isSearchVisible, searchQuery, onSearchQueryChange }: RequestsHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-green-mannwork border-b border-gray-200"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-2xl font-bold text-white">Solicitudes</Text>

        <View className="flex-row items-center gap-x-3">
          <Pressable
            onPress={onSearch}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isSearchVisible ? "bg-white" : "bg-gray-100"
            }`}
          >
            <MaterialIcons 
              name={isSearchVisible ? "close" : "search"} 
              size={24} 
              color={isSearchVisible ? "#2D7A3E" : "#6B7280"} 
            />
          </Pressable>

          <Pressable
            onPress={onCreate}
            className="w-10 h-10 bg-white rounded-full items-center justify-center"
          >
            <MaterialIcons name="add" size={24} color="#2D7A3E" />
          </Pressable>
        </View>
      </View>
      
      {isSearchVisible && (
        <View className="px-4 pb-4">
          <TextInput
            className="bg-white rounded-lg px-4 py-3 text-gray-900"
            placeholder="Buscar por nombre, categoría, cliente o profesional..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={onSearchQueryChange}
            autoFocus
          />
        </View>
      )}
    </View>
  );
};

export default RequestsHeader;
