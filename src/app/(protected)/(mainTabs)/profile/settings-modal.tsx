import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SettingsModal from "../../../../features/profile/components/settings/SettingsModal";

const SettingsModalScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const handleCustomerSupport = () => {
    // Navegar a la pantalla de soporte al cliente
    // router.push("/(protected)/support");
    console.log("Atención al cliente");
  };

  const handleShare = () => {
    // Lógica para compartir la aplicación
    console.log("Compartir aplicación");
  };

  const handleAboutMannwork = () => {
    // Navegar a la pantalla de información sobre Mannwork
    // router.push("/(protected)/about");
    console.log("Acerca de Mannwork");
  };

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
      <SettingsModal
        visible={true}
        onClose={handleClose}
        onCustomerSupport={handleCustomerSupport}
        onShare={handleShare}
        onAboutMannwork={handleAboutMannwork}
      />
    </View>
  );
};

export default SettingsModalScreen;
