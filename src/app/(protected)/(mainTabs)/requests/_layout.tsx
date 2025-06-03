import { Stack } from "expo-router";

const RequestsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create-request" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RequestsLayout;
