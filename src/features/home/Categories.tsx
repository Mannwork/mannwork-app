import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

const mockCategories = [
  { name: "Mascotas", icon: "pets" },
  { name: "Hogar", icon: "home-repair-service" },
  { name: "Transporte", icon: "directions-car" },
  { name: "Clases", icon: "school" },
  { name: "Salud", icon: "local-hospital" },
  { name: "Tecnología", icon: "computer" },
];

const Categories = () => (
  <View className="mt-5">
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="pl-4"
    >
      {mockCategories.map((cat, idx) => (
        <Pressable key={idx} className="items-center mr-6">
          <View className="bg-green-mannwork-light p-3 rounded-full mb-1">
            <MaterialIcons name={cat.icon as any} size={28} color="#2D7A3E" />
          </View>
          <Text className="text-xs text-gray-700 font-medium">{cat.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  </View>
);

export default Categories;
