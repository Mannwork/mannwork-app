import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, Text, View } from "react-native";

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

const SubcategoryCarrousel = ({
  category,
  subcategories,
}: {
  category: string;
  subcategories: string[];
}) => (
  <View className="mt-4">
    <Text className="mx-4 mb-2 text-base font-bold text-gray-800">
      {category}
    </Text>
    <FlatList
      data={subcategories}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingLeft: 16 }}
      renderItem={({ item: sub }) => (
        <View
          className="flex-row items-center bg-green-mannwork-light rounded-2xl px-5 py-3 mr-4"
          style={{ minWidth: 160, maxWidth: 200 }}
        >
          <View className="bg-white rounded-full p-2 mr-3">
            <MaterialIcons
              name={(subcategoryIcons[sub] || "category") as any}
              size={28}
              color="#2D7A3E"
            />
          </View>
          <Text className="text-sm text-green-mannwork font-bold flex-1">
            {sub}
          </Text>
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
    />
  </View>
);

export default SubcategoryCarrousel;
