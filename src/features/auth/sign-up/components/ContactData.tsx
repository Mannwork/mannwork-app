import { useState } from "react";

import {
  ActivityIndicator,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { router } from "expo-router";

import { isClerkAPIResponseError /*useUser*/ } from "@clerk/clerk-expo";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomInput from "@/common/components/CustomInput";
import MyView from "@/common/components/MyView";

import AuthButton from "@/features/auth/components/AuthButton";
import { useAuthStore } from "@/features/auth/sign-up/store/auth.store";
import { clerkErrorValidator } from "@/features/auth/utils/clerkErrorValidator";

import {
  celPhoneSchema,
  CelPhoneSchema,
} from "../validators/celPhone.validator";

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
          const { errorField, displayMessage } = clerkErrorValidator(error);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <MyView className="flex-1 p-6">
        <Text className="text-3xl font-bold">Información de Contacto</Text>
        <Text className="text-lg mt-2 text-gray-600">
          Ingresa un número de celular donde podamos contactarte.
        </Text>

        {errors.root && (
          <Text style={{ color: "crimson" }}>{errors.root.message}</Text>
        )}

        <View className="mt-8">
          <CustomInput
            name="phoneNumber"
            control={control}
            placeholder="Ingresa tu numero de celular"
            keyboardType="phone-pad"
          />
        </View>

        <View className="mt-auto">
          <AuthButton
            onPress={handleSubmit(sendCode)}
            className="bg-green-mannwork"
          >
            {loading ? (
              <ActivityIndicator color="#FDFDFB" size="small" />
            ) : (
              <Text className="font-semibold text-background-white">
                Siguiente
              </Text>
            )}
          </AuthButton>
        </View>
      </MyView>
    </TouchableWithoutFeedback>
  );
};

export default ContactData;
