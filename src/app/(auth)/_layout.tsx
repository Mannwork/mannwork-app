import { Redirect, Stack } from "expo-router";

import { useAuth } from "@clerk/clerk-expo";

export default function RootLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/(protected)/home/index" />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
