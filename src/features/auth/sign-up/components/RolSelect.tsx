import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import MyView from "@/common/components/MyView";
import { useAuthStore } from "../store/auth.store";
import HeaderRegisterSteps from "./HeaderRegisterSteps";

const professionalLogo = require("@/assets/roles/professional-role.png");
const clientLogo = require("@/assets/roles/client-role.png");
const appLogo = require("@/assets/logo_blanco.png");

export const RolSelect = () => {
    const { setData } = useAuthStore();

    const handlePress = (rol: "professional" | "client") => {
        setData("rol", rol);
        if (rol === "professional") {
            router.push("/sign-up/select-category");
        } else {
            router.push("/sign-up/contact-data");
        }
    };

    return (
        <MyView className="flex-1 bg-white">
            <HeaderRegisterSteps />
            
            <View className="flex-1 px-4 pt-8">
                <View className="flex flex-col justify-between gap-y-6 h-full w-full">
                    <Pressable
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 items-center justify-center h-72 w-full"
                        onPress={() => handlePress("professional")}
                    >
                        <Image
                            source={professionalLogo}
                            className="w-48 h-48 mb-6"
                            resizeMode="contain"
                        />
                        <Text className="text-3xl font-black text-primary tracking-wider">
                            SOY
                            <Text className="block text-center text-4xl text-[#2D7A3E] mt-1">
                                PROFESIONAL
                            </Text>
                        </Text>
                    </Pressable>
                    <View className="h-10 flex items-center justify-center mb-2">
                        <View className="flex-row items-center">
                            <View className="h-px bg-gray-200 flex-1"></View>
                            <Text className="px-4 text-text-secondary text-sm font-medium tracking-wider">
                                SELECCIONA TU ROL
                            </Text>
                            <View className="h-px bg-gray-200 flex-1"></View>
                        </View>
                    </View>

                    {/* Tarjeta de Cliente */}
                    <Pressable
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 items-center justify-center h-72 w-full mb-16"
                        onPress={() => handlePress("client")}
                    >
                        <Image
                            source={clientLogo}
                            className="w-48 h-48 mb-6"
                            resizeMode="contain"
                        />
                        <Text className="text-3xl font-black text-primary tracking-wider">
                            SOY
                            <Text className="block text-center text-4xl text-[#2D7A3E] mt-1">
                                CLIENTE
                            </Text>
                        </Text>
                    </Pressable>
                </View>

            </View>
        </MyView>
    );
};
