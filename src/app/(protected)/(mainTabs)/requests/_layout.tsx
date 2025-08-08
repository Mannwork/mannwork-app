import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Stack } from "expo-router";

export default function RequestsLayout() {
    return (
        <ActionSheetProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                    name="[requestId]"
                    options={{
                        headerShown: false,
                        presentation: "card",
                        animation: "slide_from_right",
                    }}
                />
                <Stack.Screen
                    name="reselect-professionals"
                    options={{
                        headerShown: false,
                        presentation: "card",
                        animation: "slide_from_right",
                    }}
                />
                <Stack.Screen
                    name="review-modal"
                    options={{
                        headerShown: false,
                        presentation: "fullScreenModal",
                        animation: "slide_from_right",
                    }}
                />
                <Stack.Screen
                    name="facturation-modal"
                    options={{
                        headerShown: false,
                        presentation: "fullScreenModal",
                        animation: "slide_from_right",
                    }}
                />
            </Stack>
        </ActionSheetProvider>
    );
}
