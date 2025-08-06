import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import MyView from "@/common/components/MyView";
import { useCategories } from "@/common/hooks/useCategories";
import { useSubcategories } from "@/common/hooks/useSubcategories";
import { categoryIcons } from "@/common/types/categories.interface";
import { router } from "expo-router";
import AuthButton from "../../components/AuthButton";
import { useAuthStore } from "../store/auth.store";
import HeaderRegisterSteps from "./HeaderRegisterSteps";

interface SelectedCategory {
    categoryId: string;
    categoryName: string;
    selectedSubcategories: string[];
}

// Componente para renderizar cada categoría y sus subcategorías
interface CategoryItemProps {
    item: any;
    isSelected: boolean;
    selectedCategory: SelectedCategory | undefined;
    handleCategoryToggle: (category: any) => void;
    handleSubcategoryToggle: (categoryId: string, subcategory: string) => void;
    selectedCategoriesCount: number;
    isDisabled: boolean;
}

const CategoryItem = ({
    item,
    isSelected,
    selectedCategory,
    handleCategoryToggle,
    handleSubcategoryToggle,
    selectedCategoriesCount,
    isDisabled,
}: CategoryItemProps) => {
    const { data: subcategories, isLoading } = useSubcategories(item.id);
    return (
        <View className="mb-4 mx-4">
            <Pressable
                onPress={() => handleCategoryToggle(item)}
                className={`flex-row items-center p-4 rounded-xl border-2 ${isSelected ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white'} ${isDisabled && !isSelected ? 'opacity-60' : 'opacity-100'}`}
                style={{
                    shadowColor: isSelected ? '#2D7A3E' : '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.1 : 0.05,
                    shadowRadius: 4,
                    elevation: isSelected ? 3 : 1,
                }}
                disabled={isDisabled && !isSelected}
            >
                <View className={`p-3 rounded-lg mr-4 ${isSelected ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <MaterialIcons
                        name={(categoryIcons[item.name] as any) || "category"}
                        size={28}
                        color={isSelected ? "#2D7A3E" : "#4B5563"}
                    />
                </View>
                <View className="flex-1">
                    <Text className={`text-lg font-bold ${isSelected ? 'text-green-800' : 'text-gray-800'}`}>
                        {item.name}
                    </Text>
                    {isSelected && selectedCategory && selectedCategory.selectedSubcategories.length > 0 && (
                        <Text className="text-xs text-green-600 mt-1">
                            {selectedCategory.selectedSubcategories.length} seleccionadas
                        </Text>
                    )}
                </View>
                <View className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'} items-center justify-center`}>
                    {isSelected && (
                        <MaterialIcons name="check" size={16} color="white" />
                    )}
                </View>
            </Pressable>
            {/* Subcategorías */}
            {isSelected && (
                <View className="mt-2 ml-12 mr-2">
                    <View className="border-l-2 border-green-200 pl-4 py-2">
                        <Text className="text-sm font-semibold text-gray-600 mb-2">
                            SELECCIONA TUS ESPECIALIDADES
                        </Text>
                        {isLoading ? (
                            <View className="py-4">
                                <ActivityIndicator size="small" color="#2D7A3E" />
                            </View>
                        ) : subcategories && subcategories.length > 0 ? (
                            <View className="flex flex-col gap-y-2">
                                {subcategories.map((subcategory: any) => {
                                    const isSubcategorySelected =
                                        selectedCategory?.selectedSubcategories.includes(
                                            subcategory.id
                                        );
                                    return (
                                        <Pressable
                                            key={String(item.id) + "-" + subcategory.id}
                                            onPress={() =>
                                                handleSubcategoryToggle(
                                                    String(item.id),
                                                    subcategory.id
                                                )
                                            }
                                            className={`flex-row items-center p-4 rounded-xl ${isSubcategorySelected ? 'bg-green-50 border-2 border-green-500' : 'bg-white border border-gray-200'}`}
                                        >
                                            <View className={`w-6 h-6 rounded-full border-2 ${isSubcategorySelected ? 'bg-green-500 border-green-500' : 'border-gray-300'} items-center justify-center mr-3`}>
                                                {isSubcategorySelected && (
                                                    <MaterialIcons name="check" size={16} color="white" />
                                                )}
                                            </View>
                                            <Text className={`text-base ${isSubcategorySelected ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
                                                {subcategory.name}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ) : (
                            <Text className="text-gray-400 text-sm py-2">
                                No hay subcategorías disponibles
                            </Text>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
};

export const SelectCategory = () => {
    const [selectedCategories, setSelectedCategories] = useState<
        SelectedCategory[]
    >([]);
    const { data: categories, isLoading } = useCategories();
    const { setData } = useAuthStore();

    const isDisabled = selectedCategories.length === 0 ||
        selectedCategories.some(cat => cat.selectedSubcategories.length === 0);
    
    const MAX_CATEGORIES = 3;

    const handleCategoryToggle = (category: any) => {
        const categoryId = String(category.id);
        const isSelected = selectedCategories.some(
            (sc) => sc.categoryId === categoryId
        );

        if (isSelected) {
            // Remover categoría
            setSelectedCategories((prev) =>
                prev.filter((sc) => sc.categoryId !== categoryId)
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
                    categoryId: categoryId,
                    categoryName: category.name,
                    selectedSubcategories: [],
                },
            ]);
        }
    };

    const handleSubcategoryToggle = (
        categoryId: string,
        subcategoryId: string
    ) => {
        setSelectedCategories((prev) =>
            prev.map((sc) => {
                if (sc.categoryId === categoryId) {
                    const isSelected =
                        sc.selectedSubcategories.includes(subcategoryId);
                    return {
                        ...sc,
                        selectedSubcategories: isSelected
                            ? sc.selectedSubcategories.filter(
                                  (sub) => sub !== subcategoryId
                              )
                            : [...sc.selectedSubcategories, subcategoryId],
                    };
                }
                return sc;
            })
        );
    };

    const isCategorySelected = (categoryId: string | number) => {
        return selectedCategories.some(
            (sc) => sc.categoryId === String(categoryId)
        );
    };

    const getSelectedCategory = (categoryId: string | number) => {
        return selectedCategories.find(
            (sc) => sc.categoryId === String(categoryId)
        );
    };

    const handleNext = () => {
        setData(
            "categories",
            selectedCategories.map((sc) => sc.categoryId)
        );
        setData(
            "selected_subcategories",
            selectedCategories.map((sc) => sc.selectedSubcategories)
        );
        router.push("/sign-up/contact-data");
    };

    const renderItem = ({ item }: { item: any }) => {
        const isSelected = isCategorySelected(item.id);
        const selectedCategory = getSelectedCategory(item.id);
        const isDisabled = selectedCategories.length >= MAX_CATEGORIES && !isSelected;

        return (
            <CategoryItem
                item={item}
                isSelected={isSelected}
                selectedCategory={selectedCategory}
                handleCategoryToggle={handleCategoryToggle}
                handleSubcategoryToggle={handleSubcategoryToggle}
                selectedCategoriesCount={selectedCategories.length}
                isDisabled={isDisabled}
            />
        );
    };

    return (
        <MyView className="flex-1 bg-gray-50">
            <HeaderRegisterSteps />
            <View className="flex-1">
                <View className="p-6 bg-white border-b border-gray-100">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        ¿En qué te especializas?
                    </Text>
                    <Text className="text-gray-600">
                        Selecciona hasta {MAX_CATEGORIES} categorías principales
                    </Text>
                    
                    {selectedCategories.length > 0 && (
                        <View className="mt-4 bg-green-50 p-3 rounded-lg border border-green-100">
                            <Text className="text-green-800 text-sm">
                                <Text className="font-bold">{selectedCategories.length}</Text> de {MAX_CATEGORIES} categorías seleccionadas
                            </Text>
                            {selectedCategories.length === MAX_CATEGORIES && (
                                <Text className="text-green-700 text-xs mt-1">
                                    Has alcanzado el máximo de categorías
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#2D7A3E" />
                    </View>
                ) : (
                    <FlatList
                        data={categories}
                        renderItem={renderItem}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={{ paddingVertical: 16 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
            
            <View className="p-5 border-t border-gray-200 bg-white">
                <AuthButton
                    onPress={handleNext}
                    disabled={isDisabled}
                    className={isDisabled ? "opacity-50" : ""}
                >
                    <Text className="font-semibold text-white text-center">
                        {isDisabled ? "Selecciona al menos una subcategoría" : "Continuar"}
                    </Text>
                </AuthButton>
                {selectedCategories.length > 0 && (
                    <Text className="text-center text-sm text-gray-500 mt-3">
                        {selectedCategories.reduce((acc, cat) => acc + (cat?.selectedSubcategories?.length || 0), 0)} especialidades seleccionadas
                    </Text>
                )}
            </View>
        </MyView>
    );
};
