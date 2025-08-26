import PaymentModal from "@/features/chats/components/PaymentModal";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SeeQuoteModal = () => {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const requestId = params.requestId as string | undefined;
    const quoteAmount = params.quoteAmount as string | undefined;
    const quoteDescription = params.quoteDescription as string | undefined;
    const quoteProfessionalName = params.quoteProfessionalName as
        | string
        | undefined;
    const quoteProfessionalAvatar =
        (params.quoteProfessionalAvatar as string | undefined) ||
        "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no";
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
                quote={{
                    quoteId: quoteId || "",
                    chatId: (params.chatId as string) || "",
                    amount: parseInt(quoteAmount || "0"),
                    description: quoteDescription || "",
                    professionalName: quoteProfessionalName || "",
                    professionalAvatar: quoteProfessionalAvatar,
                }}
            />
        </View>
    );
};

export default SeeQuoteModal;
