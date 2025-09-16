import SettingsModal from "@/features/profile/components/settings/SettingsModal";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsModalScreen = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    const handleShare = () => {
        // Lógica para compartir la aplicación
        console.log("Compartir aplicación");
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
            <SettingsModal onClose={handleClose} onShare={handleShare} />
        </View>
    );
};

export default SettingsModalScreen;
