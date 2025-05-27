import { Stack } from 'expo-router'

const ProtectedLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(mainTabs)" />
      <Stack.Screen name="membership" />
      <Stack.Screen name="users" />
    </Stack>
  )
}

export default ProtectedLayout