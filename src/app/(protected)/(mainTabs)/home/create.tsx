import CreateRequestModal from "@/features/create/CreateRequestModal";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateRequestScreen() {
  const { category, subcategory } = useLocalSearchParams<{
    category: string;
    subcategory: string;
  }>();
  const insets = useSafeAreaInsets();

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
          gestureEnabled: true,
          gestureDirection: "vertical",
        }}
      />
      <CreateRequestModal
        category={category || ""}
        subcategory={subcategory || ""}
      />
    </View>
  );
}
