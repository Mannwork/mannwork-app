import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { isClerkAPIResponseError, useAuth, useSignUp } from "@clerk/clerk-expo";

import CustomInput from "@/common/components/CustomInput";
import MyKeyboardAvoidingView from "@/common/components/MyKeyboardAvoidingView";

import AuthButton from "@/features/auth/components/AuthButton";
import { clerkErrorValidator } from "@/features/auth/utils/clerkErrorValidator";

import {
    signUpCredentialsScheme,
    SignUpFields,
} from "@/features/auth/sign-up/validators/signUpCredentials.validator";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignUpForm = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const insets = useSafeAreaInsets();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<SignUpFields>({
        resolver: zodResolver(signUpCredentialsScheme),
    });

    const { signUp, isLoaded, setActive } = useSignUp();
    const { isSignedIn, signOut } = useAuth();

    const onSignUp = async (data: SignUpFields) => {
        if (!isLoaded) return;

        try {
            setLoading(true);

            if (isSignedIn) {
                await signOut();
            }

            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            });

            if (signUp.createdSessionId) {
                await setActive({ session: signUp.createdSessionId });
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

    const goToLogin = () => {
        router.push("/(auth)/sign-in");
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
                        <Text className="text-2xl font-bold text-primary mb-1">¡Crea tu cuenta!</Text>
                        <Text className="text-text-secondary">Completa el formulario para registrarte</Text>
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
                <View className="mb-4">
                    <Text className="text-sm font-medium text-text-primary mb-1">Contraseña</Text>
                    <CustomInput
                        control={control}
                        name="password"
                        placeholder="Crea una contraseña segura"
                        secureTextEntry={!showPassword}
                        autoComplete="password"
                        autoCapitalize="none"
                        inputClassName="h-14 text-base px-4 pr-12"
                        rightIcon={
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-0 bottom-0 justify-center pr-3"
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
                </View>
                <View className="mb-2">
                    <Text className="text-sm font-medium text-text-primary mb-1">Repetir contraseña</Text>
                    <CustomInput
                        control={control}
                        name="repeat-password"
                        placeholder="Vuelve a escribir tu contraseña"
                        secureTextEntry={!showRepeatPassword}
                        autoComplete="password"
                        autoCapitalize="none"
                        inputClassName="h-14 text-base px-4 pr-12"
                        rightIcon={
                            <TouchableOpacity
                                onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                                className="absolute right-0 top-0 bottom-0 justify-center pr-3"
                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                            >
                                <MaterialIcons
                                    name={showRepeatPassword ? "visibility-off" : "visibility"}
                                    size={22}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        }
                    />
                </View>

                {errors.root && (
                    <Text className="text-red-500 text-center mb-4">
                        {errors.root.message}
                    </Text>
                )}

                <AuthButton 
                    onPress={handleSubmit(onSignUp)}
                    className="mb-6 w-full"
                >
                    {loading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text className="text-base font-semibold text-white">Registrarse</Text>
                    )}
                </AuthButton>

                <View className="flex-row justify-center items-center mt-4 mb-6">
                    <Text className="text-text-secondary">
                        ¿Ya tienes una cuenta?{" "}
                    </Text>
                    <Pressable onPress={goToLogin}>
                        <Text className="text-primary font-semibold">
                            Inicia sesión aquí
                        </Text>
                    </Pressable>
                </View>
                </View>
            </View>
        </MyKeyboardAvoidingView>
    );
};

export default SignUpForm;
