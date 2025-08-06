import { Stack } from "expo-router";

const SignUpLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                title: "Registro",
                presentation: "card",
                headerStyle: {
                    backgroundColor: "#2d7a3e",
                },
                headerTintColor: "#ffffff",
                headerTitleStyle: {
                    color: "#ffffff",
                },
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="rol-select" options={{ headerShown: false }} />
            <Stack.Screen
                name="select-category"
                options={{ headerShown: false }}
            />
            <Stack.Screen name="contact-data" options={{ headerShown: false }} />
            <Stack.Screen name="ubication-data" options={{ headerShown: false }} />
            <Stack.Screen name="personal-data" />
            <Stack.Screen name="review" options={{ headerShown: false }} />
        </Stack>
    );
};

export default SignUpLayout;
