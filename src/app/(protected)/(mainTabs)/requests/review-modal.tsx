import Review from "@/features/reviews/components/Review";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReviewModal() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-green-mannwork"
      style={{ paddingTop: insets.top }}
    >
      <Review />
    </View>
  );
}
