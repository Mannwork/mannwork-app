import { Stack } from 'expo-router'

const SignUpLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="rol-select" options={{ headerShown: false }} />
      <Stack.Screen name="contact-data" options={{ headerShown: false }} />
      <Stack.Screen name="code-validation-modal" options={{ presentation: "modal"}} />
      <Stack.Screen name="personal-data" options={{ headerShown: false }} />
      <Stack.Screen name="review" options={{ headerShown: false }} />
    </Stack>
  )
}

export default SignUpLayout