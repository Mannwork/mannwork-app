import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { useCategories } from "./hooks/useCategories";
import { useSearchStore } from "./stores/searchStore";

const subcategoryIcons: Record<string, string> = {
  // Mascotas
  "Paseador de perros": "pets",
  Alojamiento: "hotel",
  "Guardería de día": "child-care",
  "Mascotas general": "pets",
  // Hogar
  Plomería: "plumbing",
  Electricista: "electrical-services",
  Limpieza: "cleaning-services",
  Jardinería: "yard",
  Pintura: "format-paint",
};

const SubcategoryCarrousel = () => {
  const { data: categories } = useCategories();
  const addSearch = useSearchStore((state) => state.addSearch);

  if (!categories) return null;

  // Tomar solo las primeras 5 categorías
  const limitedCategories = categories.slice(0, 5);

  const handleSubcategoryPress = (category: string, subcategory: string) => {
    addSearch(category, subcategory);
    router.push({
      pathname: "/(protected)/(mainTabs)/requests/create",
      params: { category, subcategory },
    });
  };

  return (
    <View className="mt-4">
      {limitedCategories.map((category) => (
        <View key={category.id} className="mb-6">
          <Text className="mx-4 mb-2 text-base font-bold text-gray-800">
            {category.name}
          </Text>
          <FlatList
            data={category.sub_categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16 }}
            renderItem={({ item: subcategory }) => (
              <Pressable
                onPress={() =>
                  handleSubcategoryPress(category.name, subcategory)
                }
                className="flex-row items-center bg-green-mannwork-light rounded-2xl px-5 py-3 mr-4"
                style={{ minWidth: 160, maxWidth: 200 }}
              >
                <View className="bg-white rounded-full p-2 mr-3">
                  <MaterialIcons
                    name={(subcategoryIcons[subcategory] || "category") as any}
                    size={28}
                    color="#2D7A3E"
                  />
                </View>
                <Text className="text-sm text-green-mannwork font-bold flex-1">
                  {subcategory}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item, index) => `${category.id}-${item}-${index}`}
          />
        </View>
      ))}
    </View>
  );
};

export default SubcategoryCarrousel;
