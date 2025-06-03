import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const SignIn = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Pressable onPress={() => router.push("/(protected)/(mainTabs)/home")}>
        <Text>sign-in</Text>
      </Pressable>
    </View>
  );
};

export default SignIn;
