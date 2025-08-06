import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";

import CustomInput from "@/common/components/CustomInput";
import MyKeyboardAvoidingView from "@/common/components/MyKeyboardAvoidingView";

import AuthButton from "@/features/auth/components/AuthButton";
import { clerkErrorValidator } from "@/features/auth/utils/clerkErrorValidator";

import {
    SignInFields,
    signInCredentialsScheme,
} from "../validators/signInCredentials.validator";

const LoginForm = () => {
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SignInFields>({
        resolver: zodResolver(signInCredentialsScheme),
    });

    const { signIn, isLoaded, setActive } = useSignIn();

    const [loading, setLoading] = useState(!isLoaded);
    const [showPassword, setShowPassword] = useState(false);

    const onSignIn = async (data: SignInFields) => {
        if (!isLoaded) return;

        try {
            setLoading(true);

            const signInAttempt = await signIn.create({
                identifier: data.email,
                password: data.password,
            });

            if (signInAttempt.status === "complete") {
                setActive({ session: signInAttempt.createdSessionId });
            } else {
                setError("root", {
                    message: "Algo salió mal, intentalo de nuevo más tarde",
                });
            }
        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                error.errors.forEach((error) => {
                    const { errorField, displayMessage } =
                        clerkErrorValidator(error);
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

    const goToRegister = () => {
        router.push("/(auth)/sign-up");
    };
    const goToForgotPass = () => {
        router.push("/(auth)/forgot-pass");
    };

    return (
        <MyKeyboardAvoidingView className="flex-1">
            <View className="items-center justify-center h-1/3 bg-[#2D7A3E]">
                <Image 
                    source={require('@/assets/logo_blanco.png')} 
                    className="w-72 h-72"
                    resizeMode="contain"
                />
            </View>
            
            <View className="flex-1 bg-white rounded-t-[40px] -mt-8 w-full px-4 pt-12">
                <View className="bg-white rounded-3xl px-6 w-full">
                    <View className="items-center mb-6">
                        <Text className="text-2xl font-bold text-primary mb-1">Bienvenido!</Text>
                        <Text className="text-text-secondary">Inicia sesión para continuar</Text>
                    </View>
                <View className="mb-4">
                    <Text className="text-sm font-medium text-text-primary mb-1">Correo electrónico</Text>
                    <CustomInput
                        control={control}
                        name="email"
                        placeholder="tucorreo@ejemplo.com"
                        autoFocus
                        keyboardType="email-address"
                        autoComplete="email"
                        autoCapitalize="none"
                        inputClassName="h-14 text-base px-4"
                    />
                </View>
                <View className="mb-2">
                    <Text className="text-sm font-medium text-text-primary mb-1">Contraseña</Text>
                    <CustomInput
                    control={control}
                    name="password"
                    placeholder="Ingrese su contraseña"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    autoCapitalize="none"
                    inputClassName="h-14 text-base px-4 pr-12"
                    rightIcon={
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                            <MaterialIcons
                                name={showPassword ? "visibility-off" : "visibility"}
                                size={22}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    }
                />

                {errors.root && (
                    <Text style={{ color: "crimson" }}>
                        {errors.root.message}
                    </Text>
                )}

                <View className="flex-row justify-end mb-6">
                    <Pressable 
                        onPress={goToForgotPass}
                        className="py-2"
                    >
                        <Text className="text-sm font-medium text-primary">
                            ¿Olvidaste tu contraseña?
                        </Text>
                    </Pressable>
                </View>
                
                <AuthButton 
                    onPress={handleSubmit(onSignIn)}
                    className="mb-6"
                >
                    {loading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className="text-base font-semibold text-white">Iniciar sesión</Text>
                    )}
                </AuthButton>

                <View className="flex-row justify-center items-center mt-4">
                    <Text className="text-text-secondary">
                        ¿No tienes una cuenta?{" "}
                    </Text>
                    <Pressable onPress={goToRegister}>
                        <Text className="text-primary font-semibold">
                            Regístrate aquí
                        </Text>
                    </Pressable>
                </View>
                </View>
            </View>
        </View>
    </MyKeyboardAvoidingView>
    );
};

export default LoginForm;
