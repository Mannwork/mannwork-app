import QuoteModalComponent from "@/features/chats/components/QuoteModal";

import { router, Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const QuoteModal = () => {
    const insets = useSafeAreaInsets();

    // Puedes obtener datos del cliente desde params si los pasas por la navegación

    const handleClose = () => {
        router.back();
    };

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            <Stack.Screen
                options={{
                    headerShown: false,
                    presentation: "fullScreenModal",
                    animation: "slide_from_bottom",
                    gestureEnabled: true,
                    gestureDirection: "vertical",
                }}
            />
            <QuoteModalComponent onClose={handleClose} />
        </View>
    );
};

export default QuoteModal;
