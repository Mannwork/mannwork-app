import { Stack } from "expo-router";

const ProtectedLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(mainTabs)" options={{ headerShown: false }} />
      <Stack.Screen name="membership" />
      <Stack.Screen name="users" />
    </Stack>
  );
};

export default ProtectedLayout;
