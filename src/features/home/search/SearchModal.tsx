import { getSubcategoriesByCategory } from "@/common/hooks/useSubcategories";
import { categoryIcons } from "@/common/types/categories.interface";
import { useSearchStore } from "@/features/home/stores/searchStore";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCategories } from "../../../common/hooks/useCategories";

const SearchModalComponent = () => {
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const { data: categories } = useCategories();
  const addSearch = useSearchStore((state) => state.addSearch);
  // Búsqueda simple y directa
  const [searching, setSearching] = useState(false);
  const normalized = searchQuery.trim().toLowerCase();

  // Estado para todas las subcategorías de todas las categorías
  const [allSubcategories, setAllSubcategories] = useState<
    {
      categoryId: number;
      categoryName: string;
      subcategories: { id: string; name: string }[];
    }[]
  >([]);
  const [loadingAllSub, setLoadingAllSub] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !categories) return;
    setLoadingAllSub(true);
    const results: {
      categoryId: number;
      categoryName: string;
      subcategories: { id: string; name: string }[];
    }[] = [];
    for (const cat of categories) {
      const subs = await getSubcategoriesByCategory(cat.id);
      results.push({
        categoryId: cat.id,
        categoryName: cat.name,
        subcategories: subs,
      });
    }
    setAllSubcategories(results);
    setLoadingAllSub(false);
  };

  // Búsqueda real usando subcategorías de la base
  const filteredResults = useMemo(() => {
    if (!allSubcategories.length || !categories) return [];
    const results: {
      category: string;
      subcategory: string;
      categoryId: number;
      subcategoryId: string;
    }[] = [];
    // 1. Coincidencias de categoría: mostrar todas sus subcategorías
    allSubcategories.forEach((cat) => {
      if (cat.categoryName.toLowerCase().includes(normalized)) {
        cat.subcategories.forEach((sub) => {
          results.push({
            category: cat.categoryName,
            subcategory: sub.name,
            categoryId: cat.categoryId,
            subcategoryId: sub.id,
          });
        });
      }
    });
    // 2. Coincidencias de subcategoría: mostrar solo esa subcategoría y su categoría
    allSubcategories.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        if (sub.name.toLowerCase().includes(normalized)) {
          results.push({
            category: cat.categoryName,
            subcategory: sub.name,
            categoryId: cat.categoryId,
            subcategoryId: sub.id,
          });
        }
      });
    });
    // 3. Evitar duplicados
    const unique = results.filter(
      (item, idx, arr) =>
        arr.findIndex(
          (x) =>
            x.category === item.category && x.subcategory === item.subcategory
        ) === idx
    );
    return unique;
  }, [searching, allSubcategories, normalized]);

  const handleResultPress = async (
    category: string,
    subcategory: string,
    categoryId: number,
    subcategoryId: string
  ) => {
    const icon = categoryIcons[category];
    if (userId) {
      await addSearch(category, subcategory, userId);
    }
    setSearchQuery(subcategory); // Mostrar la subcategoría seleccionada en la searchbar
    setSelectedCategory(null); // Volver a modo global
    // Opcional: puedes navegar aquí si lo deseas, si no, deja solo la UX de búsqueda
    router.back();
    setTimeout(() => {
      router.push({
        pathname: "/(protected)/(mainTabs)/home/create",
        params: {
          category,
          subcategory,
          categoryId: categoryId.toString(),
          subcategoryId,
          icon,
        },
      });
    }, 100);
  };

  const handleClose = () => {
    router.back();
  };

  const handleSearchBarChange = (text: string) => {
    setSearchQuery(text);
    // Si borra el texto o escribe algo diferente al nombre de la categoría seleccionada, volver a global
    if (selectedCategory && (text === "" || text !== selectedCategory.name)) {
      setSelectedCategory(null);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-green-mannwork px-4 py-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="w-6" />
          <Text className="text-xl font-bold text-white flex-1 text-center">
            ¿Qué necesitas?
          </Text>
          <Pressable onPress={handleClose} className="w-6">
            <MaterialIcons name="close" size={24} color="white" />
          </Pressable>
        </View>
        <View className="flex-row items-center border-b-2 border-gray-200 rounded-full px-4 py-2">
          <MaterialIcons name="search" size={28} color="#fff" />
          <TextInput
            className="flex-1 ml-2 text-2xl text-white"
            placeholder="Buscar"
            placeholderTextColor="#fff"
            value={searchQuery}
            onChangeText={handleSearchBarChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {loadingAllSub ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2D7A3E" />
          </View>
        ) : searchQuery ? (
          <View className="flex-1">
            <View className="px-4 py-4 border-b border-gray-200 bg-green-mannwork-light">
              <Text className="text-lg font-bold text-green-mannwork">
                Resultados de la búsqueda
              </Text>
            </View>
            <FlatList
              data={filteredResults}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    handleResultPress(
                      item.category,
                      item.subcategory,
                      item.categoryId,
                      item.subcategoryId
                    )
                  }
                  className="flex-row items-center py-4 px-4 border-b border-gray-100"
                >
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-green-mannwork">
                      {item.category}
                    </Text>
                    <Text className="text-sm text-gray-600 mt-1">
                      {item.subcategory}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#2D7A3E"
                  />
                </Pressable>
              )}
              keyExtractor={(item, index) =>
                `${item.category}-${item.subcategory}-${index}`
              }
            />
          </View>
        ) : (
          <View className="flex-1">
            {/* Categorías */}
            <View className="px-4 py-2 border-b border-gray-200 bg-green-mannwork-light">
              <Text className="text-lg font-bold text-green-mannwork">
                Encontra lo que necesitas por categoría...
              </Text>
            </View>
            <View className="flex-1">
              <FlatList
                data={categories}
                contentContainerStyle={{ paddingBottom: 16 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={async () => {
                      setSelectedCategory(item);
                      setSearchQuery(item.name);
                      setLoadingAllSub(true);
                      const subs = await getSubcategoriesByCategory(item.id);
                      setAllSubcategories([
                        {
                          categoryId: item.id,
                          categoryName: item.name,
                          subcategories: subs,
                        },
                      ]);
                      setLoadingAllSub(false);
                      setSearching(true);
                    }}
                    className="flex-row items-center py-4 px-4 border-b border-gray-100"
                  >
                    <View className="bg-green-mannwork-light rounded-full p-2 mr-4">
                      <MaterialIcons
                        name={(categoryIcons[item.name] || "category") as any}
                        size={24}
                        color="#2D7A3E"
                      />
                    </View>
                    <Text className="text-xl font-bold text-green-mannwork flex-1">
                      {item.name}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#2D7A3E"
                    />
                  </Pressable>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchModalComponent;
