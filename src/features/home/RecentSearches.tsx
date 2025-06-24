import { useSearchStore } from "@/features/home/stores/searchStore";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const RecentSearches = () => {
  const { recentSearches, removeSearch } = useSearchStore();

  if (recentSearches.length === 0) return null;

  const handleSearchPress = (category: string, subcategory: string) => {
    router.push({
      pathname: "/(protected)/(mainTabs)/requests/create",
      params: { category, subcategory },
    });
  };

  return (
    <View className="mx-4 mt-3">
      <View className="flex-col gap-y-2 space-y-3">
        {recentSearches.map((search, idx) => (
          <Pressable
            key={search.timestamp}
            onPress={() =>
              handleSearchPress(search.category, search.subcategory)
            }
            className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200"
          >
            <View className="flex-1">
              <Text className="text-[13px] text-gray-400 font-semibold mb-1">
                {search.category}
              </Text>
              <Text className="text-base text-gray-800 font-bold">
                {search.subcategory}
              </Text>
            </View>
            <Pressable onPress={() => removeSearch(idx)}>
              <MaterialIcons name="close" size={22} color="#888" />
            </Pressable>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default RecentSearches;
