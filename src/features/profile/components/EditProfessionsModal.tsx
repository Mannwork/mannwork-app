import { useEffect, useState } from "react";
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
import { useSubcategories } from "@/common/hooks/useSubcategories";
import { categoryIcons } from "@/common/types/categories.interface";

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
  return (
    <View>
      <Pressable
        onPress={() => handleCategoryToggle(item)}
        className="flex-row items-center py-4 px-4 border-b border-gray-100"
        style={{
          opacity: selectedCategoriesCount >= 3 && !isSelected ? 0.5 : 1,
        }}
      >
        <View className="bg-green-mannwork-light rounded-full p-2 mr-4">
          <MaterialIcons
            name={(categoryIcons[item.name] as any) || "category"}
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
          disabled={selectedCategoriesCount >= 3 && !isSelected}
        />
      </Pressable>
      {/* Subcategorías */}
      {isSelected && (
        <View className="bg-gray-50 px-4 py-2">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Subespecializaciones:
          </Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="#2D7A3E" />
          ) : subcategories && subcategories.length > 0 ? (
            subcategories.map((subcategory: any) => {
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
                  className="flex-row items-center py-2"
                >
                  <View className="w-5 h-5 border-2 border-green-mannwork rounded mr-3 justify-center items-center">
                    {isSubcategorySelected && (
                      <MaterialIcons name="check" size={16} color="#2D7A3E" />
                    )}
                  </View>
                  <Text className="text-base text-gray-800 flex-1">
                    {subcategory.name}
                  </Text>
                </Pressable>
              );
            })
          ) : (
            <Text className="text-gray-400 italic">
              No hay subcategorías disponibles.
            </Text>
          )}
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
    // Convertir de vuelta al formato de profesiones
    const professions = selectedCategories.flatMap((sc) =>
      sc.selectedSubcategories.map((subId) => {
        const category = categories?.find(
          (c) => String(c.id) === sc.categoryId
        );
        const subcategory = category
          ? // Aquí necesitarías obtener las subcategorías para esta categoría
            // Por simplicidad, usamos los datos que ya tenemos
            currentProfessions.find(
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
    <View className="flex-1 bg-white rounded-xl">
      {/* Header */}
      <View className="bg-green-mannwork px-4 py-4 rounded-t-xl">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable onPress={onClose} className="w-6">
            <MaterialIcons name="close" size={24} color="white" />
          </Pressable>
          <Text className="text-xl font-bold text-white flex-1 text-center">
            Editar oficios
          </Text>
          <View className="w-6" />
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
                Selecciones disponibles ({selectedCategories.length}/3)
              </Text>
            </View>
            <FlatList
              data={categories}
              contentContainerStyle={{ paddingBottom: 16 }}
              renderItem={({ item }) => (
                <CategoryItem
                  item={item}
                  isSelected={isCategorySelected(item.id)}
                  selectedCategory={getSelectedCategory(item.id)}
                  handleCategoryToggle={handleCategoryToggle}
                  handleSubcategoryToggle={handleSubcategoryToggle}
                  selectedCategoriesCount={selectedCategories.length}
                />
              )}
              keyExtractor={(item) => String(item.id)}
            />
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="p-4 border-t border-gray-200">
        <Pressable
          className={`rounded-xl py-4 ${
            isDisabled ? "bg-gray-300" : "bg-green-mannwork"
          }`}
          onPress={handleSave}
          disabled={isDisabled}
        >
          <Text
            className={`text-center font-bold text-lg ${
              isDisabled ? "text-gray-500" : "text-white"
            }`}
          >
            Guardar cambios
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
