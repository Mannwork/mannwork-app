import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Switch,
    Text,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useCategories } from "@/common/hooks/useCategories";
import { categoryIcons } from "@/common/types/categories.interface";
import { router } from "expo-router";
import AuthButton from "../../components/AuthButton";
import { useAuthStore } from "../store/auth.store";

interface SelectedCategory {
    categoryId: string;
    categoryName: string;
    selectedSubcategories: string[];
}

export const SelectCategory = () => {
    const [selectedCategories, setSelectedCategories] = useState<
        SelectedCategory[]
    >([]);
    const { data: categories, isLoading } = useCategories();
    const { setData } = useAuthStore();

    const isDisabled =
        selectedCategories.length === 0 ||
        selectedCategories[0]?.selectedSubcategories.length === 0;

    const handleCategoryToggle = (category: any) => {
        const isSelected = selectedCategories.some(
            (sc) => sc.categoryId === category.id
        );

        if (isSelected) {
            // Remover categoría
            setSelectedCategories((prev) =>
                prev.filter((sc) => sc.categoryId !== category.id)
            );
        } else {
            // Agregar categoría (máximo 3)
            if (selectedCategories.length >= 3) {
                // Aquí podrías mostrar un mensaje de error
                return;
            }
            setSelectedCategories((prev) => [
                ...prev,
                {
                    categoryId: category.id,
                    categoryName: category.name,
                    selectedSubcategories: [],
                },
            ]);
        }
    };

    const handleSubcategoryToggle = (
        categoryId: string,
        subcategory: string
    ) => {
        setSelectedCategories((prev) =>
            prev.map((sc) => {
                if (sc.categoryId === categoryId) {
                    const isSelected =
                        sc.selectedSubcategories.includes(subcategory);
                    return {
                        ...sc,
                        selectedSubcategories: isSelected
                            ? sc.selectedSubcategories.filter(
                                  (sub) => sub !== subcategory
                              )
                            : [...sc.selectedSubcategories, subcategory],
                    };
                }
                return sc;
            })
        );
    };

    const isCategorySelected = (categoryId: string) => {
        return selectedCategories.some((sc) => sc.categoryId === categoryId);
    };

    const getSelectedCategory = (categoryId: string) => {
        return selectedCategories.find((sc) => sc.categoryId === categoryId);
    };

    const handleNext = () => {
        setData(
            "categories",
            selectedCategories.map((sc) => sc.categoryId)
        );
        setData(
            "selected_subcategories",
            selectedCategories.map((sc) => sc.selectedSubcategories).flat()
        );
        router.push("/sign-up/contact-data");
    };

    const renderCategoryItem = ({ item }: { item: any }) => {
        const isSelected = isCategorySelected(item.id);
        const selectedCategory = getSelectedCategory(item.id);

        return (
            <View>
                <Pressable
                    onPress={() => handleCategoryToggle(item)}
                    className="flex-row items-center py-4 px-4 border-b border-gray-100"
                    style={{
                        opacity:
                            selectedCategories.length >= 3 && !isSelected
                                ? 0.5
                                : 1,
                    }}
                >
                    <View className="bg-green-mannwork-light rounded-full p-2 mr-4">
                        <MaterialIcons
                            name={
                                (categoryIcons[item.name] as any) || "category"
                            }
                            size={24}
                            color="#2D7A3E"
                        />
                    </View>
                    <Text className="text-xl font-bold text-green-mannwork flex-1">
                        {item.name}
                    </Text>
                    <Switch
                        value={isSelected}
                        onValueChange={() => handleCategoryToggle(item)}
                        trackColor={{ false: "#767577", true: "#2D7A3E" }}
                        thumbColor={isSelected ? "#fff" : "#f4f3f4"}
                        disabled={selectedCategories.length >= 3 && !isSelected}
                    />
                </Pressable>

                {/* Subcategorías */}
                {isSelected && (
                    <View className="bg-gray-50 px-4 py-2">
                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                            Subespecializaciones:
                        </Text>
                        {item.sub_categories.map(
                            (subcategory: string, index: number) => {
                                const isSubcategorySelected =
                                    selectedCategory?.selectedSubcategories.includes(
                                        subcategory
                                    );
                                return (
                                    <Pressable
                                        key={index}
                                        onPress={() =>
                                            handleSubcategoryToggle(
                                                item.id,
                                                subcategory
                                            )
                                        }
                                        className="flex-row items-center py-2"
                                    >
                                        <View className="w-5 h-5 border-2 border-green-mannwork rounded mr-3 justify-center items-center">
                                            {isSubcategorySelected && (
                                                <MaterialIcons
                                                    name="check"
                                                    size={16}
                                                    color="#2D7A3E"
                                                />
                                            )}
                                        </View>
                                        <Text className="text-base text-gray-800 flex-1">
                                            {subcategory}
                                        </Text>
                                    </Pressable>
                                );
                            }
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white">
            <View className="bg-green-mannwork px-4 py-4">
                <View className="flex-row items-center justify-between mb-2">
                    <View className="w-6" />
                    <Text className="text-xl font-bold text-white flex-1 text-center">
                        ¿Cual es tu oficio?
                    </Text>
                </View>
                <Text className="text-white text-center text-sm">
                    Selecciona hasta 3 oficios principales
                </Text>
            </View>

            {/* Content */}
            <View className="flex-1">
                {isLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#2D7A3E" />
                    </View>
                ) : (
                    <View className="flex-1">
                        <View className="px-4 py-2 border-b border-gray-200 bg-green-mannwork-light">
                            <Text className="text-lg font-bold text-green-mannwork">
                                Selecciones disponibles (
                                {selectedCategories.length}/3)
                            </Text>
                        </View>
                        <FlatList
                            data={categories}
                            contentContainerStyle={{ paddingBottom: 16 }}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                )}
            </View>
            <AuthButton
                onPress={handleNext}
                className="bg-green-mannwork mx-6"
                style={{
                    opacity: isDisabled ? 0.5 : 1,
                }}
                disabled={isDisabled}
            >
                <Text className="font-semibold text-background-white">
                    Siguiente
                </Text>
            </AuthButton>
        </View>
    );
};
