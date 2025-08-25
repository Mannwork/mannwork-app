import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSearchStore } from "../../stores/searchStore";

const categoryIcons: Record<string, string> = {
  Carpintero: "carpenter",
  Plomero: "plumbing",
  Técnico: "build",
  Albañil: "construction",
  Tapicero: "weekend",
  Limpieza: "cleaning-services",
  Colocador: "handyman",
  Electricista: "electrical-services",
  Gasista: "local-fire-department",
  Pintor: "format-paint",
  Mudancero: "local-shipping",
  Reformas: "home-repair-service",
  Cerrajero: "vpn-key",
  Jardinero: "yard",
  Arquitecto: "architecture",
  Herrero: "hardware",
  Decorador: "style",
  "Control de plagas": "bug-report",
  Seguridad: "security",
  Piletas: "pool",
  Bienestar: "self-improvement",
  Cuidadores: "face",
  Mascotas: "pets",
  "A/A": "ac-unit",
  Belleza: "spa",
  Autos: "directions-car",
  Eventos: "celebration",
};

interface SubcategoryCarrouselProps {
  categories: any[];
  subcategoriesMap: Record<number, any[]>;
}

const SubcategoryCarrousel = ({
  categories,
  subcategoriesMap,
}: SubcategoryCarrouselProps) => {
  const { userId } = useAuth();
  const addSearch = useSearchStore((state) => state.addSearch);

  if (!categories || categories.length === 0) return null;

  const limitedCategories = categories.slice(0, 5);

  const handleSubcategoryPress = async (
    category: string,
    subcategory: string,
    categoryId: number,
    subcategoryId: string
  ) => {
    const icon = categoryIcons[category];
    if (userId) {
      await addSearch(category, subcategory, userId);
    }
    router.push({
      pathname: "/(protected)/(mainTabs)/home/create",
      params: {
        category,
        subcategory,
        categoryId: categoryId.toString(),
        subcategoryId,
        categoryName: category,
        subcategoryName: subcategory,
        icon,
      },
    });
  };

  return (
    <View className="mt-4">
      {limitedCategories.map((category: any, idx: number) => {
        const subcategories = subcategoriesMap[category.id] || [];
        return (
          <View key={category.id} className="mb-6">
            <Text className="mx-4 mb-2 text-base font-bold text-gray-800">
              {category.name}
            </Text>
            <FlatList
              data={subcategories}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 16 }}
              renderItem={({ item: subcategory }) => (
                <Pressable
                  onPress={() =>
                    handleSubcategoryPress(
                      category.name,
                      subcategory.name,
                      category.id,
                      subcategory.id
                    )
                  }
                  className="flex-row items-center bg-green-mannwork-light rounded-2xl px-6 mr-4 w-48 h-20"
                >
                  <View className="bg-white rounded-full p-2 mr-3">
                    <MaterialIcons
                      name={(categoryIcons[category.name] || "category") as any}
                      size={28}
                      color="#2D7A3E"
                    />
                  </View>
                  <Text
                    className="text-xs text-green-mannwork font-bold flex-1 text-center"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {subcategory.name}
                  </Text>
                </Pressable>
              )}
              keyExtractor={(item, index) =>
                `${category.id}-${item.id || item.name}-${index}`
              }
            />
          </View>
        );
      })}
    </View>
  );
};

export default SubcategoryCarrousel;
