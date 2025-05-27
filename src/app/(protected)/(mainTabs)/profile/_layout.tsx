import { Stack } from "expo-router"


const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="update-data-modal" options={{ presentation: "modal" }}  />
    </Stack>
  )
}

export default ProfileLayout