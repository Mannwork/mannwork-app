import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="search-modal"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="membership"
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "#2D7A3E" },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          presentation: "card",
          animation: "slide_from_bottom",
          gestureEnabled: true,
          gestureDirection: "vertical",
        }}
      />
      <Stack.Screen
        name="select-professionals"
        options={{
          headerShown: false,
          presentation: "card",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="request-sent"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="professional-stats"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
