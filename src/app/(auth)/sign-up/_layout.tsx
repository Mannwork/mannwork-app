import { Stack } from 'expo-router';

const SignUpLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index"
       options={{
        headerShown: true,

        title: "Registro", 
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
      <Stack.Screen name="rol-select" />
      <Stack.Screen name="contact-data" />
      <Stack.Screen name="code-validation-modal" options={{ presentation: "modal"}} />
      <Stack.Screen name="personal-data" />
      <Stack.Screen name="review" />
    </Stack>
  )
};

export default SignUpLayout;