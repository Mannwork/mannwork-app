import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { useCategories } from "@/common/hooks/useCategories";
import { useSubcategories } from "@/common/hooks/useSubcategories";
import { categoryIcons } from "@/common/types/categories.interface";
import { MaterialIcons } from "@expo/vector-icons";

interface SelectedCategory {
  categoryId: string;
  categoryName: string;
  selectedSubcategories: string[];
}

interface EditProfessionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    professions: {
      category_id: number;
      subcategory_id: string;
      category_name: string;
      subcategory_name: string;
    }[]
  ) => void;
  currentProfessions: {
    category_id: number;
    subcategory_id: string;
    category_name: string;
    subcategory_name: string;
  }[];
}

// Componente para renderizar cada categoría y sus subcategorías
interface CategoryItemProps {
  item: any;
  isSelected: boolean;
  selectedCategory: SelectedCategory | undefined;
  handleCategoryToggle: (category: any) => void;
  handleSubcategoryToggle: (categoryId: string, subcategory: string) => void;
  selectedCategoriesCount: number;
  isDisabled?: boolean;
}

const CategoryItem = ({
  item,
  isSelected,
  selectedCategory,
  handleCategoryToggle,
  handleSubcategoryToggle,
  selectedCategoriesCount,
}: CategoryItemProps) => {
  const { data: subcategories, isLoading } = useSubcategories(item.id);
  const isDisabled = selectedCategoriesCount >= 3 && !isSelected;

  return (
    <View className="mb-4 mx-4">
      <Pressable
        onPress={() => handleCategoryToggle(item)}
        className={`flex-row items-center p-4 rounded-xl border-2 ${
          isSelected
            ? "border-green-600 bg-green-50"
            : "border-gray-200 bg-white"
        } ${isDisabled ? "opacity-60" : "opacity-100"}`}
        style={{
          shadowColor: isSelected ? "#2D7A3E" : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isSelected ? 0.1 : 0.05,
          shadowRadius: 4,
          elevation: isSelected ? 3 : 1,
        }}
        disabled={isDisabled}
      >
        <View
          className={`p-3 rounded-lg mr-4 ${
            isSelected ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <MaterialIcons
            name={(categoryIcons[item.name] as any) || "category"}
            size={28}
            color={isSelected ? "#2D7A3E" : "#4B5563"}
          />
        </View>
        <View className="flex-1">
          <Text
            className={`text-lg font-bold ${
              isSelected ? "text-green-800" : "text-gray-800"
            }`}
          >
            {item.name}
          </Text>
          {isSelected &&
            selectedCategory &&
            selectedCategory.selectedSubcategories.length > 0 && (
              <Text className="text-xs text-green-600 mt-1">
                {selectedCategory.selectedSubcategories.length} seleccionadas
              </Text>
            )}
        </View>
        <View
          className={`w-6 h-6 rounded-full border-2 ${
            isSelected ? "bg-green-600 border-green-600" : "border-gray-300"
          } items-center justify-center`}
        >
          {isSelected && <MaterialIcons name="check" size={16} color="white" />}
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
                        handleSubcategoryToggle(String(item.id), subcategory.id)
                      }
                      className={`flex-row items-center p-4 rounded-xl ${
                        isSubcategorySelected
                          ? "bg-green-50 border-2 border-green-500"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <View
                        className={`w-6 h-6 rounded-full border-2 ${
                          isSubcategorySelected
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        } items-center justify-center mr-3`}
                      >
                        {isSubcategorySelected && (
                          <MaterialIcons name="check" size={16} color="white" />
                        )}
                      </View>
                      <Text
                        className={`text-base ${
                          isSubcategorySelected
                            ? "text-green-800 font-medium"
                            : "text-gray-700"
                        }`}
                      >
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

export const EditProfessionsModal = ({
  visible,
  onClose,
  onSave,
  currentProfessions,
}: EditProfessionsModalProps) => {
  const [selectedCategories, setSelectedCategories] = useState<
    SelectedCategory[]
  >([]);
  const { data: categories, isLoading } = useCategories();

  // Convertir las profesiones actuales al formato de SelectedCategory
  useEffect(() => {
    if (
      visible &&
      currentProfessions &&
      categories &&
      selectedCategories.length === 0 // Solo inicializa si está vacío
    ) {
      const grouped = currentProfessions.reduce((acc, profession) => {
        const categoryId = String(profession.category_id);
        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            categoryName: profession.category_name,
            selectedSubcategories: [],
          };
        }
        acc[categoryId].selectedSubcategories.push(profession.subcategory_id);
        return acc;
      }, {} as Record<string, SelectedCategory>);

      setSelectedCategories(Object.values(grouped));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, currentProfessions, categories]);

  const isDisabled =
    selectedCategories.length === 0 ||
    selectedCategories.some((sc) => sc.selectedSubcategories.length === 0);

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
          const isSelected = sc.selectedSubcategories.includes(subcategoryId);
          return {
            ...sc,
            selectedSubcategories: isSelected
              ? sc.selectedSubcategories.filter((sub) => sub !== subcategoryId)
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

  const handleSave = () => {
    const professions = selectedCategories.flatMap((sc) =>
      sc.selectedSubcategories.map((subId) => {
        const category = categories?.find(
          (c) => String(c.id) === sc.categoryId
        );
        const subcategory = category
          ? currentProfessions.find(
              (p) =>
                String(p.category_id) === sc.categoryId &&
                p.subcategory_id === subId
            )
          : null;

        return {
          category_id: Number(sc.categoryId),
          subcategory_id: subId,
          category_name: sc.categoryName,
          subcategory_name: subcategory?.subcategory_name || "",
        };
      })
    );

    onSave(professions);
    onClose();
  };

  if (!visible) return null;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 py-3 bg-green-mannwork border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-2xl font-bold text-white">
            Editar profesiones
          </Text>
          <Pressable onPress={onClose} className="p-2">
            <MaterialIcons name="close" size={24} color="white" />
          </Pressable>
        </View>
        <Text className="text-white">
          Selecciona hasta 3 categorías principales
        </Text>

        {selectedCategories.length > 0 && (
          <View className="mt-4 bg-green-50 p-3 rounded-lg border border-green-100">
            <Text className="text-green-800 text-sm">
              <Text className="font-bold">{selectedCategories.length}</Text> de
              3 categorías seleccionadas
            </Text>
            {selectedCategories.length === 3 && (
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
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            const isSelected = selectedCategories.some(
              (sc) => sc.categoryId === String(item.id)
            );
            const selectedCategory = selectedCategories.find(
              (sc) => sc.categoryId === String(item.id)
            );

            return (
              <CategoryItem
                item={item}
                isSelected={isSelected}
                selectedCategory={selectedCategory}
                handleCategoryToggle={handleCategoryToggle}
                handleSubcategoryToggle={handleSubcategoryToggle}
                selectedCategoriesCount={selectedCategories.length}
                isDisabled={selectedCategories.length >= 3 && !isSelected}
              />
            );
          }}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}

      <View className="p-6 bg-white border-t border-gray-100">
        <Pressable
          onPress={handleSave}
          disabled={isDisabled}
          className={`py-4 rounded-xl ${
            isDisabled ? "bg-gray-300" : "bg-green-600"
          }`}
        >
          <Text className="text-white font-semibold text-lg text-center">
            Guardar cambios
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
