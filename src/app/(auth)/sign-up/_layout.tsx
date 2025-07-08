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
            <Stack.Screen name="select-category" />
            <Stack.Screen name="contact-data" />
            <Stack.Screen name="ubication-data" />
            <Stack.Screen name="personal-data" />
            <Stack.Screen name="review" />
        </Stack>
    );
};

export default SignUpLayout;
