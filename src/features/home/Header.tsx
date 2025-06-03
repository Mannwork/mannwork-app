import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="w-full bg-green-mannwork items-center justify-center"
      style={{ paddingTop: insets.top + 4, paddingBottom: 12 }}
    >
      <Image
        source={require("../../assets/logo_letras.png")}
        style={{ width: 180, height: 30 }}
      />
    </View>
  );
};

export default Header;
