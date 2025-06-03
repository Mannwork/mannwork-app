import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="search-modal" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default HomeLayout;
