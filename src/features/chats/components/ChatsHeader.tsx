import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChatsHeaderProps {
  userRole: "client" | "professional";
  onSearch?: () => void;
  onFilter?: () => void;
}

const ChatsHeader = ({ userRole, onSearch, onFilter }: ChatsHeaderProps) => {
  const insets = useSafeAreaInsets();

  const getSubtitle = () => {
    return userRole === "client"
      ? "Comunícate con profesionales"
      : "Gestiona tus conversaciones";
  };

  return (
    <View
      className="bg-green-mannwork px-4 py-4"
      style={{ paddingTop: insets.top + 10 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-white">Chats</Text>
          <Text className="text-white/80 text-sm mt-1">{getSubtitle()}</Text>
        </View>

        <View className="flex-row items-center gap-3">
          {onSearch && (
            <Pressable
              onPress={onSearch}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <MaterialIcons name="search" size={20} color="#FFFFFF" />
            </Pressable>
          )}

          {onFilter && (
            <Pressable
              onPress={onFilter}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <MaterialIcons name="filter-list" size={20} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatsHeader;
