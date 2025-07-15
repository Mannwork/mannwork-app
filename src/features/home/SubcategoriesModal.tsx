import { useSubcategories } from "@/common/hooks/useSubcategories";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSearchStore } from "./stores/searchStore";

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

interface SubcategoriesModalProps {
  category: {
    id: number;
    name: string;
    icon_url: string;
    sub_categories: string[];
  };
}

const SubcategoriesModal = ({ category }: SubcategoriesModalProps) => {
  const { userId } = useAuth();
  const addSearch = useSearchStore((state) => state.addSearch);
  const { data: subcategories, isLoading } = useSubcategories(category.id);

  const handleSubcategoryPress = async (subcategory: any) => {
    const icon = categoryIcons[category.name];
    if (userId) {
      await addSearch(category.name, subcategory.name, userId);
    }
    router.back();
    router.push({
      pathname: "/(protected)/(mainTabs)/home/create",
      params: {
        category: category.name,
        subcategory: subcategory.name,
        categoryId: category.id.toString(),
        subcategoryId: subcategory.id,
        categoryName: category.name,
        subcategoryName: subcategory.name,
        icon,
      },
    });
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-green-mannwork px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleClose} className="w-6">
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-xl font-bold text-white flex-1 text-center">
            {category.name}
          </Text>
          <View className="w-6" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="px-4 py-4 border-b border-gray-200 bg-green-mannwork-light">
          <Text className="text-lg font-bold text-green-mannwork">
            Selecciona una subcategoría
          </Text>
        </View>

        <FlatList
          data={subcategories || []}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item: subcategory }) => (
            <Pressable
              onPress={() => handleSubcategoryPress(subcategory)}
              className="flex-row items-center py-6 px-4 border-b border-gray-100"
            >
              <Text className="text-lg font-bold text-green-mannwork flex-1">
                {subcategory.name}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#2D7A3E" />
            </Pressable>
          )}
          keyExtractor={(item, index) =>
            `${category.id}-${item.id || item.name}-${index}`
          }
        />
      </View>
    </View>
  );
};

export default SubcategoriesModal;
