import { useCategories } from "@/features/home/hooks/useCategories";
import SubcategoriesModal from "@/features/home/SubcategoriesModal";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SubcategoriesModalScreen = () => {
  const insets = useSafeAreaInsets();
  const { categoryId } = useLocalSearchParams();
  const { data: categories } = useCategories();

  const selectedCategory = categories?.find(
    (cat) => cat.id.toString() === categoryId
  );

  if (!selectedCategory) {
    return null;
  }

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-green-mannwork"
    >
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
      <SubcategoriesModal category={selectedCategory} />
    </View>
  );
};

export default SubcategoriesModalScreen;
