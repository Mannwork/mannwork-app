import { Image, Pressable, Text, View } from "react-native";

import { router } from "expo-router";

import MyView from "@/common/components/MyView";

import { useAuthStore } from "../store/auth.store";

const professionalLogo = require("@/assets/roles/professional-role.png");
const clientLogo = require("@/assets/roles/client-role.png");

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
        <MyView className="flex flex-col items-center p-8">
            <Text className="text-4xl font-bold mb-6">Elige tu rol</Text>

            <View className="flex-1 justify-center">
                <Pressable
                    className="flex flex-col items-center mb-6"
                    onPress={() => handlePress("professional")}
                >
                    <Image
                        source={professionalLogo}
                        className="w-80 h-80 mb-2"
                        resizeMode="contain"
                    />
                    <Text className="text-xl font-semibold">
                        Soy profesional
                    </Text>
                </Pressable>

                <Pressable
                    className="flex flex-col items-center"
                    onPress={() => handlePress("client")}
                >
                    <Image
                        source={clientLogo}
                        className="w-80 h-80 mb-2"
                        resizeMode="contain"
                    />
                    <Text className="text-xl font-semibold">Soy cliente</Text>
                </Pressable>
            </View>
        </MyView>
    );
};
