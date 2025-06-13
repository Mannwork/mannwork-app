import { Redirect, Stack } from "expo-router";

import { useAuth } from "@clerk/clerk-expo";

const ProtectedLayout = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(mainTabs)" options={{ headerShown: false }} />
      <Stack.Screen name="membership" />
      <Stack.Screen name="users" />
    </Stack>
  );
};

export default ProtectedLayout;
