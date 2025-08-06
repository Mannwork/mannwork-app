import { useState } from "react";

import {
    ActivityIndicator,
    Keyboard,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import { isClerkAPIResponseError /*useUser*/ } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomInput from "@/common/components/CustomInput";

import AuthButton from "@/features/auth/components/AuthButton";
import { useAuthStore } from "@/features/auth/sign-up/store/auth.store";
import { clerkErrorValidator } from "@/features/auth/utils/clerkErrorValidator";

import MyKeyboardAvoidingView from "@/common/components/MyKeyboardAvoidingView";
import {
    celPhoneSchema,
    CelPhoneSchema,
} from "../validators/celPhone.validator";
import HeaderRegisterSteps from "./HeaderRegisterSteps";

const ContactData = () => {
    // const { isLoaded, user } = useUser();
    const { setData } = useAuthStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<CelPhoneSchema>({
        resolver: zodResolver(celPhoneSchema),
    });

    const [loading, setLoading] = useState(false);

    const sendCode = async (data: CelPhoneSchema) => {
        setLoading(true);

        // if (!isLoaded) return;

        try {
            // const createdPhone = await user?.createPhoneNumber({
            //   phoneNumber: `+54${data.phoneNumber}`,
            // });

            // await createdPhone?.prepareVerification();

            setData("cel_phone", data.phoneNumber);

            router.push("/(auth)/sign-up/ubication-data");
        } catch (error) {
            console.log("error", error);

            if (isClerkAPIResponseError(error)) {
                error.errors.forEach((error) => {
                    const { errorField, displayMessage } =
                        clerkErrorValidator(error);
                    setError(errorField as "phoneNumber", {
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
        <View className="flex-1 bg-white pt-14">
            <HeaderRegisterSteps />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <MyKeyboardAvoidingView className="flex-1">
                    <View className="px-4 pt-8 pb-6">
                        <Text className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                            Información de
                            <Text className="text-green-mannwork"> Contacto</Text>
                        </Text>
                        <View className="h-1 w-20 bg-green-mannwork rounded-full mb-4"></View>
                        <Text className="text-lg text-gray-600">
                            Necesitamos tu número de celular para continuar
                        </Text>
                    </View>

                    <View className="px-8 flex-1">
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-3">
                                Número de celular
                            </Text>
                            <View className="relative">
                                <View className="absolute left-4 top-0 bottom-7 justify-center z-10">
                                    <MaterialIcons
                                        name="phone"
                                        size={24}
                                        color={errors.phoneNumber ? "#ef4444" : "#6b7280"}
                                    />
                                </View>
                                <CustomInput
                                    name="phoneNumber"
                                    control={control}
                                    placeholder="+56 9 1234 5678"
                                    keyboardType="phone-pad"
                                    inputClassName={`h-14 pl-12 pr-4 text-base bg-gray-50 border-2 ${errors.phoneNumber ? 'border-red-400' : 'border-gray-200'} rounded-xl`}
                                />
                            </View>
                            {errors.phoneNumber && (
                                <Text className="text-red-500 text-sm mt-2 ml-1">
                                    {errors.phoneNumber.message}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View className="px-8 pb-8 pt-4 bg-white border-t border-gray-100">
                        <AuthButton
                            onPress={handleSubmit(sendCode)}
                            className="bg-green-mannwork py-4 rounded-xl shadow-lg"
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text className="text-white font-bold text-lg">
                                    CONTINUAR
                                </Text>
                            )}
                        </AuthButton>
                    </View>

                    {errors.root && (
                        <View className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
                            <Text className="text-red-700 font-medium">
                                {errors.root.message}
                            </Text>
                        </View>
                    )}
                </MyKeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default ContactData;
