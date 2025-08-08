import { Stack } from "expo-router";

const ProtectedLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(mainTabs)" options={{ headerShown: false }} />
      <Stack.Screen name="users/[userId]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ProtectedLayout;
