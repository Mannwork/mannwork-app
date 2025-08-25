import MembershipScreen from "@/features/home/components/membership/MembershipScreen";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MembershipRouteScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-green-mannwork"
      style={{ paddingTop: insets.top }}
    >
      <MembershipScreen />
    </View>
  );
}
