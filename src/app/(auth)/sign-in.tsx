import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
    Animated,
    Keyboard,
    SafeAreaView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import AnimatedLogo from "@/common/components/AnimatedLogo";
import AuthButton from "@/features/auth/components/AuthButton";
import SignInWith from "@/features/auth/sign-in/components/SignInWith";

const SignIn = () => {
    const openSignInModal = () => {
        router.push("/(auth)/sign-in-modal");
    };

    const slideUpAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        Animated.spring(slideUpAnim, {
            toValue: 0,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-green-mannwork">
                <StatusBar style="light" />
                {/* Logos animados centrados */}
                <View className="flex-1 justify-center items-center">
                    <View className="items-center mt-24 ">
                        <AnimatedLogo
                            source={require("@/assets/logo_blanco.png")}
                            size={450}
                        />
                    </View>
                </View>

                <View className="flex-1 justify-center items-center mb-10">
                    <View className="items-center mb-96 ">
                        <AnimatedLogo
                            source={require("@/assets/logo_letras.png")}
                            size={300}
                            className="opacity-90"
                        />
                    </View>
                </View>

                <Animated.View
                    className="bg-white rounded-t-3xl p-6 pt-6 absolute bottom-0 left-0 right-0"
                    style={{
                        transform: [{ translateY: slideUpAnim }],
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 20,
                        elevation: 10,
                    }}
                >
                    <View className="flex-1 gap-y-2">
                        <SignInWith strategy="oauth_google" variant="outline" />

                        <View className="flex-row items-center my-4">
                            <View className="flex-1 h-px bg-gray-200" />
                            <Text className="px-3 text-gray-400 text-sm">
                                o continúa con
                            </Text>
                            <View className="flex-1 h-px bg-gray-200" />
                        </View>

                        <AuthButton
                            onPress={openSignInModal}
                            variant="outline"
                            className="border-green-600"
                        >
                            <MaterialIcons
                                name="alternate-email"
                                size={20}
                                color="#2D7A3E"
                            />
                            <Text className="font-semibold text-green-600 ml-2">
                                Correo Electrónico
                            </Text>
                        </AuthButton>
                    </View>

                    <View className="mt-8 mb-4">
                        <Text className="text-center text-gray-400 text-xs">
                            Al continuar, aceptas nuestros{" "}
                            <Text className="text-green-600 font-medium">
                                Términos de Servicio
                            </Text>{" "}
                            y{" "}
                            <Text className="text-green-600 font-medium">
                                Política de Privacidad
                            </Text>
                        </Text>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default SignIn;
