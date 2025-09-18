import { useSignIn } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { z } from "zod";

import MyKeyboardAvoidingView from "@/common/components/MyKeyboardAvoidingView";
import MyView from "@/common/components/MyView";

const styles = StyleSheet.create({
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: "white",
    },
    button: {
        backgroundColor: "#2d7a3e",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
    backButton: {
        marginTop: 20,
        padding: 10,
        alignItems: "center",
    },
    backButtonText: {
        color: "#2d7a3e",
        fontWeight: "600",
    },
});

const forgotPasswordSchema = z
    .object({
        email: z.string().email("Ingrese un correo electrónico válido"),
        code: z.string().min(1, "El código es requerido"),
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres"),
        confirmPassword: z.string().min(8, "La confirmación es requerida"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;

type ResetStep = "email" | "code" | "reset" | "success";

const ForgotPass = () => {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<ResetStep>("email");
    const [email, setEmail] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFields>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
            code: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onRequestReset = async (data: ForgotPasswordFields) => {
        if (!isLoaded) return;

        try {
            setIsLoading(true);

            // Start the password reset flow
            await setActive({ session: null });

            // Create a password reset request
            const { supportedFirstFactors } = await signIn.create({
                identifier: data.email,
                strategy: "reset_password_email_code",
            });

            if (!supportedFirstFactors) {
                throw new Error(
                    "No se pudo iniciar el proceso de recuperación"
                );
            }

            // Find the password reset factor
            const resetPasswordFactor = supportedFirstFactors.find(
                (factor) => factor.strategy === "reset_password_email_code"
            ) as { strategy: string; emailAddressId: string } | undefined;

            if (!resetPasswordFactor?.emailAddressId) {
                throw new Error(
                    "No se pudo encontrar el método de restablecimiento de contraseña"
                );
            }

            // Send the password reset email
            await signIn.prepareFirstFactor({
                strategy: "reset_password_email_code",
                emailAddressId: resetPasswordFactor.emailAddressId,
            });

            setEmail(data.email);
            setCurrentStep("code");
        } catch (err: any) {
            console.error("Password reset error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyCode = async (data: ForgotPasswordFields) => {
        if (!isLoaded) return;

        try {
            setIsLoading(true);

            // Verify the reset code
            await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: data.code,
            });

            // If verification is successful, move to password reset step
            setCurrentStep("reset");
        } catch (err: any) {
            console.error("Verification error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const onResetPassword = async (data: ForgotPasswordFields) => {
        if (!isLoaded) return;

        try {
            setIsLoading(true);

            // Complete the password reset
            await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: data.code,
                password: data.password,
            });

            setCurrentStep("success");
        } catch (err: any) {
            console.error("Password reset error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (data: ForgotPasswordFields) => {
        if (currentStep === "email") {
            return onRequestReset(data);
        } else if (currentStep === "code") {
            return onVerifyCode(data);
        } else if (currentStep === "reset") {
            return onResetPassword(data);
        }
    };

    const goBackToSignIn = () => {
        router.back();
    };

    // Success view after password reset
    if (currentStep === "success") {
        return (
            <MyView className="flex-1 justify-center p-8">
                <View className="mb-8">
                    <Text className="text-2xl font-bold mb-4 text-center text-green-600">
                        ¡Contraseña restablecida!
                    </Text>
                    <Text className="text-center text-gray-600 mb-8">
                        Tu contraseña ha sido actualizada exitosamente. Ahora
                        puedes iniciar sesión con tu nueva contraseña.
                    </Text>
                    <Pressable onPress={goBackToSignIn} style={styles.button}>
                        <Text style={styles.buttonText}>
                            Volver al inicio de sesión
                        </Text>
                    </Pressable>
                </View>
            </MyView>
        );
    }

    return (
        <MyKeyboardAvoidingView className="justify-between p-8">
            <View>
                <Text className="text-2xl font-bold mb-2">
                    {currentStep === "email"
                        ? "Recuperar contraseña"
                        : currentStep === "code"
                        ? "Verificar código"
                        : "Nueva contraseña"}
                </Text>

                <Text className="text-gray-600 mb-8">
                    {currentStep === "email" &&
                        "Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña."}
                    {currentStep === "code" &&
                        `Hemos enviado un código a ${email}. Por favor ingrésalo a continuación.`}
                    {currentStep === "reset" &&
                        "Crea una nueva contraseña segura para tu cuenta."}
                </Text>

                {/* Email Input (Step 1) */}
                {currentStep === "email" && (
                    <View style={{ marginBottom: 16 }}>
                        <Controller
                            control={control}
                            name="email"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        errors.email && { borderColor: "red" },
                                    ]}
                                    placeholder="Correo electrónico"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    keyboardType="email-address"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.email && (
                            <Text
                                style={{
                                    color: "red",
                                    fontSize: 12,
                                    marginTop: -10,
                                    marginBottom: 10,
                                }}
                            >
                                {errors.email.message}
                            </Text>
                        )}
                    </View>
                )}

                {/* Verification Code Input (Step 2) */}
                {currentStep === "code" && (
                    <View style={{ marginBottom: 16 }}>
                        <Controller
                            control={control}
                            name="code"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        errors.code && { borderColor: "red" },
                                    ]}
                                    placeholder="Código de verificación"
                                    autoCapitalize="none"
                                    keyboardType="number-pad"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.code && (
                            <Text
                                style={{
                                    color: "red",
                                    fontSize: 12,
                                    marginTop: -10,
                                    marginBottom: 10,
                                }}
                            >
                                {errors.code.message}
                            </Text>
                        )}
                    </View>
                )}

                {/* New Password Input (Step 3) */}
                {currentStep === "reset" && (
                    <>
                        <View style={{ marginBottom: 16 }}>
                            <Controller
                                control={control}
                                name="password"
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <TextInput
                                        style={[
                                            styles.input,
                                            errors.password && {
                                                borderColor: "red",
                                            },
                                        ]}
                                        placeholder="Nueva contraseña"
                                        secureTextEntry
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                )}
                            />
                            {errors.password && (
                                <Text
                                    style={{
                                        color: "red",
                                        fontSize: 12,
                                        marginTop: -10,
                                        marginBottom: 10,
                                    }}
                                >
                                    {errors.password.message}
                                </Text>
                            )}
                        </View>

                        <View style={{ marginBottom: 16 }}>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <TextInput
                                        style={[
                                            styles.input,
                                            errors.confirmPassword && {
                                                borderColor: "red",
                                            },
                                        ]}
                                        placeholder="Confirmar nueva contraseña"
                                        secureTextEntry
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                )}
                            />
                            {errors.confirmPassword && (
                                <Text
                                    style={{
                                        color: "red",
                                        fontSize: 12,
                                        marginTop: -10,
                                        marginBottom: 10,
                                    }}
                                >
                                    {errors.confirmPassword.message}
                                </Text>
                            )}
                        </View>
                    </>
                )}
            </View>

            <View>
                <Pressable
                    style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
                    onPress={handleSubmit(handleFormSubmit)}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {currentStep === "email"
                                ? "Enviar código"
                                : currentStep === "code"
                                ? "Verificar código"
                                : "Restablecer contraseña"}
                        </Text>
                    )}
                </Pressable>

                {(currentStep === "code" || currentStep === "reset") && (
                    <Pressable
                        onPress={() => setCurrentStep("email")}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>
                            <MaterialIcons
                                name="arrow-back"
                                size={16}
                                color="#2d7a3e"
                            />
                            Cambiar correo electrónico
                        </Text>
                    </Pressable>
                )}

                <Pressable
                    onPress={goBackToSignIn}
                    style={[styles.backButton, { marginTop: 8 }]}
                >
                    <Text style={styles.backButtonText}>
                        <MaterialIcons
                            name="arrow-back"
                            size={16}
                            color="#2d7a3e"
                        />
                        Volver al inicio de sesión
                    </Text>
                </Pressable>
            </View>
        </MyKeyboardAvoidingView>
    );
};

export default ForgotPass;
