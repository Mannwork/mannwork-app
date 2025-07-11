// Copia local de categoryIcons para asegurar coincidencia exacta
import { useCategories } from "@/common/hooks/useCategories";
import { useSearchStore } from "@/features/home/stores/searchStore";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

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

const RecentSearches = () => {
  const { recentSearches, removeSearch } = useSearchStore();
  const { data: categories } = useCategories();
  const [subcategoriesMap, setSubcategoriesMap] = useState<
    Record<number, any[]>
  >({});

  // Cargar subcategorías para todas las categorías
  useEffect(() => {
    if (!categories) return;

    const fetchSubcategories = async () => {
      const results: Record<number, any[]> = {};
      try {
        for (const category of categories) {
          const { getSubcategoriesByCategory } = await import(
            "@/common/hooks/useSubcategories"
          );
          const data = await getSubcategoriesByCategory(category.id);
          results[category.id] = data || [];
        }
        setSubcategoriesMap(results);
      } catch (e) {
        console.error("Error cargando subcategorías:", e);
      }
    };

    fetchSubcategories();
  }, [categories]);

  if (recentSearches.length === 0) return null;

  // Función para normalizar strings (solo letras y números, sin tildes, minúsculas)
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quita tildes
      .replace(/[^a-z0-9]/g, ""); // deja solo letras y números

  const handleSearchPress = async (category: string, subcategory: string) => {
    const normalizedCategory = normalize(category);
    const iconKey = Object.keys(categoryIcons).find(
      (key) => normalize(key) === normalizedCategory
    );
    const icon = iconKey ? categoryIcons[iconKey] : undefined;

    // Buscar la categoría por nombre
    const foundCategory = categories?.find((cat) => cat.name === category);
    if (!foundCategory) return;

    // Buscar la subcategoría por nombre
    const categorySubcategories = subcategoriesMap[foundCategory.id] || [];
    const foundSubcategory = categorySubcategories.find(
      (sub) => sub.name === subcategory
    );
    if (!foundSubcategory) return;

    router.push({
      pathname: "/(protected)/(mainTabs)/home/create",
      params: {
        category,
        subcategory,
        categoryId: foundCategory.id.toString(),
        subcategoryId: foundSubcategory.id,
        categoryName: category,
        subcategoryName: subcategory,
        icon,
      },
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
