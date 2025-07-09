import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="settings-modal" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="update-data-modal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="modal-professions-edit"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};

export default ProfileLayout;
