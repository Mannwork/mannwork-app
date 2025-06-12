import SearchModalComponent from "@/features/home/search/SearchModal";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SearchModal = () => {
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
        }}
      />
      <SearchModalComponent />
    </View>
  );
};

export default SearchModal;
