import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RequestsHeaderProps {
  onSearch?: () => void;
  onCreate?: () => void;
}

const RequestsHeader = ({ onSearch, onCreate }: RequestsHeaderProps) => {
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
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <MaterialIcons name="search" size={24} color="#6B7280" />
          </Pressable>

          <Pressable
            onPress={onCreate}
            className="w-10 h-10 bg-white rounded-full items-center justify-center"
          >
            <MaterialIcons name="add" size={24} color="#2D7A3E" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default RequestsHeader;
