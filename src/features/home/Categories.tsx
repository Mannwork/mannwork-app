import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, Pressable, Text, View } from "react-native";
import { useCategories } from "./hooks/useCategories";

const Categories = () => {
  const { data: categories } = useCategories();

  return (
    <View className="mt-5">
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-4"
        data={categories}
        renderItem={({ item }) => (
          <Pressable className="items-center mr-6">
            <View className="bg-green-mannwork-light p-3 rounded-full mb-1">
              <MaterialIcons
                name={item.icon_url as any}
                size={28}
                color="#2D7A3E"
              />
            </View>
            <Text className="text-xs text-gray-700 font-medium">
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Categories;
