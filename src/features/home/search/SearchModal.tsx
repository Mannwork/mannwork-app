import { useSearchStore } from "@/features/home/stores/searchStore";
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
import { useCategories } from "../hooks/useCategories";
import { searchCategories } from "../queries/categories";

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

const SearchModalComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: categories } = useCategories();
  const addSearch = useSearchStore((state) => state.addSearch);

  const searchResults = useMemo(() => {
    if (!categories || !searchQuery.trim()) return [];
    return searchCategories(categories, searchQuery);
  }, [categories, searchQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setIsLoading(false);
  };

  const handleResultPress = (category: string, subcategory: string) => {
    const icon = categoryIcons[category];
    addSearch(category, subcategory);
    router.back();
    setTimeout(() => {
      router.push({
        pathname: "/(protected)/(mainTabs)/home/create",
        params: { category, subcategory, icon },
      });
    }, 100);
  };

  const handleClose = () => {
    router.back();
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
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {isLoading ? (
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
              data={searchResults}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    handleResultPress(item.category, item.subcategory)
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
                    onPress={() => setSearchQuery(item.name)}
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
