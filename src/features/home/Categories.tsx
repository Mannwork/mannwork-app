import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { useCategories } from "../../common/hooks/useCategories";

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

const Categories = () => {
    const { data: categories } = useCategories();

    const handleCategoryPress = (category: any) => {
        router.push({
            pathname: "/(protected)/(mainTabs)/home/subcategories-modal",
            params: { categoryId: category.id.toString() },
        });
    };

    return (
        <View className="mt-5">
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pl-4"
                data={categories}
                renderItem={({ item }) => (
                    <Pressable
                        className="items-center mr-6"
                        onPress={() => handleCategoryPress(item)}
                    >
                        <View className="bg-green-mannwork-light p-3 rounded-full mb-1">
                            <MaterialIcons
                                name={categoryIcons[item.name] || "category"}
                                size={28}
                                color="#2D7A3E"
                            />
                        </View>
                        <Text className="text-xs text-gray-700 font-medium">
                            {item.name}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    );
};

export default Categories;
