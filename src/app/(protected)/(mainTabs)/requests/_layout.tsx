import { Stack } from "expo-router";

export default function RequestsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="create"
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
