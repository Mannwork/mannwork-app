import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useCategories } from "../../common/hooks/useCategories";
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

const SkeletonCard = () => (
    <View
        className="flex-row items-center bg-gray-200/60 rounded-2xl px-6 mr-4 w-48 h-20 animate-pulse"
        style={{ opacity: 0.7 }}
    >
        <View
            className="bg-white rounded-full p-2 mr-3"
            style={{ width: 36, height: 36 }}
        />
        <View className="bg-gray-300 rounded w-24 h-4" />
    </View>
);

const SubcategoryCarrousel = () => {
    const { data: categories } = useCategories();
    const addSearch = useSearchStore((state) => state.addSearch);
    const [subcategoriesMap, setSubcategoriesMap] = useState<
        Record<number, any[]>
    >({});

    useEffect(() => {
        if (!categories) return;
        const limitedCategories = categories.slice(0, 5);
        let isMounted = true;
        const fetchSubcategories = async () => {
            const results: Record<number, any[]> = {};
            try {
                for (const category of limitedCategories) {
                    const { getSubcategoriesByCategory } = await import(
                        "@/common/hooks/useSubcategories"
                    );
                    const data = await getSubcategoriesByCategory(category.id);
                    results[category.id] = data || [];
                }
                if (isMounted) setSubcategoriesMap(results);
            } catch (e) {
                console.error("Error cargando subcategorías:", e);
            }
        };
        fetchSubcategories();
        return () => {
            isMounted = false;
        };
    }, [categories]);

    if (!categories) return null;
    const limitedCategories = categories.slice(0, 5);

    // Verifica si las subcategorías están cargando
    const loading =
        Object.keys(subcategoriesMap).length < limitedCategories.length ||
        limitedCategories.some((cat) => !subcategoriesMap[cat.id]);

    const handleSubcategoryPress = (
        category: string,
        subcategory: string,
        categoryId: number,
        subcategoryId: string
    ) => {
        const icon = categoryIcons[category];
        addSearch(category, subcategory);
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
            {limitedCategories.map((category, idx) => {
                const subcategories = subcategoriesMap[category.id] || [];
                return (
                    <View key={category.id} className="mb-6">
                        <Text className="mx-4 mb-2 text-base font-bold text-gray-800">
                            {category.name}
                        </Text>
                        {loading ? (
                            <View
                                style={{
                                    flexDirection: "row",
                                    paddingLeft: 16,
                                }}
                            >
                                {[...Array(3)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </View>
                        ) : (
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
                                                name={
                                                    (categoryIcons[
                                                        category.name
                                                    ] || "category") as any
                                                }
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
                                    `${category.id}-${
                                        item.id || item.name
                                    }-${index}`
                                }
                            />
                        )}
                    </View>
                );
            })}
        </View>
    );
};

export default SubcategoryCarrousel;
