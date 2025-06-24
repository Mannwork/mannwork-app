import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";

import CustomInput from "@/common/components/CustomInput";
import MyKeyboardAvoidingView from "@/common/components/MyKeyboardAvoidingView";

import AuthButton from "@/features/auth/components/AuthButton";
import { clerkErrorValidator } from "@/features/auth/utils/clerkErrorValidator";

import {
  signUpCredentialsScheme,
  SignUpFields,
} from "@/features/auth/sign-up/validators/signUpCredentials.validator";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpCredentialsScheme),
  });

  const { signUp, isLoaded } = useSignUp();

  const onSignUp = async (data: SignUpFields) => {
    if (!isLoaded) return;

    try {
      setLoading(true);

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      router.push("/(auth)/sign-up/rol-select");
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        error.errors.forEach((error) => {
          const { errorField, displayMessage } = clerkErrorValidator(error);
          setError(errorField as "email" | "password" | "root", {
            message: displayMessage,
          });
        });
      } else {
        setError("root", {
          message: "Algo salió mal, intentalo de nuevo más tarde",
        });
      }

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push("/(auth)/sign-in");
  };

  return (
    <MyKeyboardAvoidingView className="justify-between p-8">
      <View>
        <CustomInput
          control={control}
          name="email"
          placeholder="Ingrese su correo electrónico"
          autoFocus
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
        />
        <CustomInput
          control={control}
          name="password"
          placeholder="Ingrese su contraseña"
          secureTextEntry
          autoComplete="password"
          autoCapitalize="none"
        />
        <CustomInput
          control={control}
          name="repeat-password"
          placeholder="Ingrese su contraseña nuevamente"
          secureTextEntry
          autoComplete="password"
          autoCapitalize="none"
        />

        {errors.root && (
          <Text style={{ color: "crimson" }}>{errors.root.message}</Text>
        )}

        <Pressable onPress={goToLogin}>
          <Text className="text-sm text-text-secondary">
            ¿Ya tienes una cuenta?{" "}
            <Text className="font-semibold">Inicia sesión</Text>
          </Text>
        </Pressable>
      </View>

      <AuthButton onPress={handleSubmit(onSignUp)}>
        {loading ? (
          <ActivityIndicator color="#2d7a3e" size="small" />
        ) : (
          <Text className="font-semibold">Registrarse</Text>
        )}
      </AuthButton>
    </MyKeyboardAvoidingView>
  );
};

export default SignUpForm;
