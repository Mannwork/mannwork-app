import { useState } from "react";

import { ActivityIndicator, Text, View } from "react-native";

import { isClerkAPIResponseError, useUser } from "@clerk/clerk-expo";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomInput from "@/common/components/CustomInput";

import AuthButton from "@/features/auth/components/AuthButton";
import { useAuthStore } from "@/features/auth/sign-up/store/auth.store";
import {
    confirmationCodeSchema,
    ConfirmationCodeSchema,
} from "@/features/auth/sign-up/validators/confirmationCode.validation";
import { clerkErrorValidator } from "@/features/auth/utils/clerkErrorValidator";

const CodeValidation = () => {
    const { isLoaded, user } = useUser();
    const { cel_phone } = useAuthStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ConfirmationCodeSchema>({
        resolver: zodResolver(confirmationCodeSchema),
    });

    const [loading, setLoading] = useState(false);

    const verifyCode = async (data: ConfirmationCodeSchema) => {
        setLoading(true);

        if (!isLoaded) return;

        try {
            const phoneNumber = user?.phoneNumbers.find(
                (p) => p.phoneNumber === `+54${cel_phone}`
            );

            if (!phoneNumber) {
                setError("root", {
                    message:
                        "No se encontró el número de teléfono para verificar.",
                });
                return;
            }

            const result = await phoneNumber.attemptVerification({
                code: data.code,
            });

            if (result.verification.status === "verified") {
                console.log(
                    "Éxito",
                    "Número de teléfono verificado correctamente."
                );

                //router.push("/(auth)/sign-up/review");
            } else {
                setError("root", {
                    message: `La verificación está en estado: ${result.verification.status}`,
                });
            }
        } catch (error) {
            if (isClerkAPIResponseError(error)) {
                error.errors.forEach((error) => {
                    const { errorField, displayMessage } =
                        clerkErrorValidator(error);
                    setError(errorField as "code", {
                        message: displayMessage,
                    });
                });
            } else {
                setError("root", {
                    message: "Algo salió mal, intentalo de nuevo más tarde",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 p-8">
            <Text className="text-3xl font-bold">Verificar Código</Text>
            <Text className="text-lg mt-2 text-gray-600">
                Ingresa el código de 6 dígitos que enviamos a tu celular.
            </Text>

            <View className="mt-8">
                <CustomInput
                    name="code"
                    control={control}
                    placeholder="Código de verificación"
                    keyboardType="number-pad"
                    maxLength={6}
                />
            </View>

            {errors.root && (
                <Text style={{ color: "crimson" }}>{errors.root.message}</Text>
            )}

            <View className="mt-auto">
                <AuthButton onPress={handleSubmit(verifyCode)}>
                    {loading ? (
                        <ActivityIndicator color="#2d7a3e" size="small" />
                    ) : (
                        <Text className="font-semibold">Verificar código</Text>
                    )}
                </AuthButton>
            </View>
        </View>
    );
};

export default CodeValidation;
