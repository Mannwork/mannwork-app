import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HeaderRegisterSteps() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top }}
      className="items-center max-h-36 justify-center bg-[#2D7A3E]"
    >
      <Image
        source={require("@/assets/logo_letras.png")}
        className="w-96 h-60"
        resizeMode="contain"
      />
    </View>
  );
}
