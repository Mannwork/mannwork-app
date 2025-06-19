import { Text, View } from "react-native";

import { router } from "expo-router";

import AuthButton from "@/features/auth/components/AuthButton";
import SignInWith from "@/features/auth/sign-in/components/SignInWith";

import LogoWithText from "@/common/components/LogoWithText";
import MyView from "@/common/components/MyView";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const SignIn = () => {
  const openSignInModal = () => {
    router.push("/(auth)/sign-in-modal");
  };

  return (
    <MyView className="items-center justify-evenly p-8">
      <View className="flex-1 items-center gap-12">
        <LogoWithText className="h-56 w-56" />
        <Text className="max-w-[75%] font-semibold text-5xl text-center leading-tight">
          Encontra a profesionales que resuelven.
        </Text>
      </View>
      <View className="flex-[2] justify-end gap-y-4 w-full">
        <SignInWith strategy="oauth_google" />
        <SignInWith strategy="oauth_facebook" />
        <AuthButton onPress={openSignInModal}>
          <MaterialIcons
            name="alternate-email"
            size={24}
            color="black"
            className="absolute left-4"
          />
          <Text className="font-bold">Acceda con correo electrónico</Text>
        </AuthButton>
      </View>
    </MyView>
  );
};

export default SignIn;
