import { useCategories } from "@/common/hooks/useCategories";
import { categoryIcons } from "@/common/types/categories.interface";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useSubcategoriesByCategories } from "../hooks/useSubcategoriesByCategories";

interface ProfileActivitiesProps {
  professions: {
    category_id: number;
    subcategory_id: string;
    category_name: string;
    subcategory_name: string;
  }[];
  userRole: "professional" | "client";
}

const ProfileActivities = ({
  professions,
  userRole,
}: ProfileActivitiesProps) => {
  const { data: categories } = useCategories();

  // Función para buscar el nombre de la categoría
  const getCategoryName = (id: number) =>
    categories?.find((c) => c.id == id)?.name || "";

  // Agrupa profesiones por categoría (solo los IDs de subcategoría seleccionados por el usuario)
  const grouped: Record<number, string[]> = {};
  professions.forEach((p) => {
    if (!grouped[p.category_id]) grouped[p.category_id] = [];
    if (!grouped[p.category_id].includes(p.subcategory_id)) {
      grouped[p.category_id].push(p.subcategory_id);
    }
  });

  // Obtén los category_id únicos
  const categoryIds = Object.keys(grouped).map(Number);
  const { data: subcategoriesByCategory } =
    useSubcategoriesByCategories(categoryIds);

  if (userRole !== "professional") {
    return null;
  }

  if (!professions || professions.length === 0) {
    return null;
  }

  return (
    <View className="bg-white px-4 py-4">
      <Text className="text-xl font-bold text-green-mannwork mb-4">
        Oficios principales
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {Object.entries(grouped).map(([categoryId, subcategoryIds], idx) => (
          <View
            key={categoryId + "-" + idx}
            className={`${
              Object.keys(grouped).length === 1 ||
              (Object.keys(grouped).length === 3 && idx === 2)
                ? "w-full"
                : "w-[48%]"
            } bg-green-mannwork-light rounded-lg p-4 mb-3 items-center`}
          >
            <View className="bg-green-mannwork-light rounded-full p-3 mb-3">
              <MaterialIcons
                name={
                  (categoryIcons[getCategoryName(Number(categoryId))] ||
                    "build") as any
                }
                size={28}
                color="#2D7A3E"
              />
            </View>
            <Text className="text-base font-bold text-gray-800 mb-2 text-center">
              {getCategoryName(Number(categoryId))}
            </Text>
            {subcategoryIds.map((subId) => {
              const sub = subcategoriesByCategory?.[Number(categoryId)]?.find(
                (s: { id: string; name: string }) => s.id == subId
              );
              return (
                <Text
                  key={subId}
                  className="text-xs text-gray-600 text-center"
                  style={{ marginBottom: 2 }}
                >
                  • {sub?.name || ""}
                </Text>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProfileActivities;
