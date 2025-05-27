import { Stack } from "expo-router"


const ChatsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[chatId]" options={{ headerShown: false }} />
      <Stack.Screen name="quote-modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="see-quote-modal" options={{ presentation: "modal" }} />
    </Stack>
  )
}

export default ChatsLayout