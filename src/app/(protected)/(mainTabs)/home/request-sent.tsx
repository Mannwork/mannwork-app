import RequestSent from "@/features/create/components/RequestSent";
import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RequestSentScreen() {
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    // Navegar a requests para ver la solicitud creada
    router.replace("/(protected)/(mainTabs)/requests?tab=sent");
  };

  return (
    <View
      className="flex-1 bg-green-mannwork"
      style={{ paddingTop: insets.top + 10 }}
    >
      <RequestSent />
    </View>
  );
}
