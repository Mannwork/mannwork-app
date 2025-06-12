import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const SearchModalComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches] = useState([
    "Plomería",
    "Electricista",
    "Limpieza",
    "Jardinería",
  ]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    // Aquí iría la lógica de búsqueda
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="bg-green-mannwork px-4 py-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="w-6" />
          <Text className="text-xl font-bold text-white flex-1 text-center">
            ¿Qué necesitas?
          </Text>
          <Pressable onPress={() => router.back()} className="w-6">
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
              data={[
                {
                  category: "Plomería",
                  subcategories: [
                    "Reparación de caños",
                    "Instalación de grifos",
                    "Desatascos",
                  ],
                },
                {
                  category: "Electricista",
                  subcategories: [
                    "Instalaciones eléctricas",
                    "Reparaciones",
                    "Iluminación",
                  ],
                },
                {
                  category: "Limpieza",
                  subcategories: [
                    "Limpieza de hogar",
                    "Limpieza de oficinas",
                    "Limpieza post-obra",
                  ],
                },
              ]}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSearchQuery(item.category)}
                  className="flex-row items-center py-4 px-4 border-b border-gray-100"
                >
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-green-mannwork">
                      {item.category}
                    </Text>
                    <Text className="text-base text-gray-600 mt-1">
                      {item.subcategories[0]}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#2D7A3E"
                  />
                </Pressable>
              )}
              keyExtractor={(item) => item.category}
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
                data={[
                  "Plomería",
                  "Electricista",
                  "Limpieza",
                  "Jardinería",
                  "Pintura",
                  "Carpintería",
                  "Herrería",
                  "Albañilería",
                  "Gasista",
                  "Aire acondicionado",
                  "Mudanzas",
                  "Limpieza de piscinas",
                  "Instalación de pisos",
                  "Techista",
                  "Instalación de aberturas",
                  "Instalación de cortinas",
                  "Instalación de muebles",
                  "Instalación de electrodomésticos",
                  "Instalación de alarmas",
                  "Instalación de cámaras de seguridad",
                ]}
                contentContainerStyle={{ paddingBottom: 16 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setSearchQuery(item)}
                    className="flex-row items-center py-4 px-4 border-b border-gray-100"
                  >
                    <View className="bg-green-mannwork-light rounded-full p-2 mr-4">
                      <MaterialIcons
                        name="category"
                        size={24}
                        color="#2D7A3E"
                      />
                    </View>
                    <Text className="text-xl font-bold text-green-mannwork flex-1">
                      {item}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#2D7A3E"
                    />
                  </Pressable>
                )}
                keyExtractor={(item) => item}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchModalComponent;
