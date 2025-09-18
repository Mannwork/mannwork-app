import PaymentModal from "@/features/chats/components/PaymentModal";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SeeQuoteModal = () => {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const requestId = params.requestId as string | undefined;
    const quoteId = params.quoteId as string | undefined;

    const handleClose = () => {
        router.back();
    };

    return (
        <View
            className="flex-1 bg-green-mannwork"
            style={{ paddingTop: insets.top }}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                    presentation: "fullScreenModal",
                    animation: "slide_from_bottom",
                    gestureEnabled: true,
                    gestureDirection: "vertical",
                }}
            />
            <PaymentModal
                onClose={handleClose}
                requestId={requestId || ""}
                quoteId={quoteId || ""}
            />
        </View>
    );
};

export default SeeQuoteModal;
