import { Redirect, Stack } from "expo-router";

import { useAuth } from "@clerk/clerk-expo";

export default function RootLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/(protected)/(mainTabs)/home" />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{headerShown: false}} />
      <Stack.Screen 
        name="sign-in-modal" 
        options={{
          title: "Iniciar sesión", 
          presentation: "modal",
          headerStyle: {
            backgroundColor: '#2d7a3e',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            color: '#ffffff',
          },
        }}  
      />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
}
