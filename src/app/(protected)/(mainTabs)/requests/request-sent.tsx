import RequestSent from "@/features/create/components/RequestSent";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RequestSentScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-green-mannwork"
      style={{ paddingTop: insets.top + 10 }}
    >
      <RequestSent />
    </View>
  );
}
