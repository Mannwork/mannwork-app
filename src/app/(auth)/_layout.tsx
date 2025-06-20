import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen
        name="sign-in-modal"
        options={{
          headerShown: true,

          title: "Iniciar sesión",
          presentation: "modal",
          headerStyle: {
            backgroundColor: "#2d7a3e",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            color: "#ffffff",
          },
        }}
      />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
