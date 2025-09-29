import { useCallback, useEffect } from "react";
import { Image, Text } from "react-native";

import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { useSSO } from "@clerk/clerk-expo";

import AuthButton from "@/features/auth/components/AuthButton";

import Apple from "@/assets/social/icon-apple.png";
import Facebook from "@/assets/social/icon-fb.png";
import Google from "@/assets/social/icon-google.png";

const strategyIcons = {
    oauth_google: Google,
    oauth_facebook: Facebook,
    oauth_apple: Apple,
};

export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();

        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface SignInWithProps {
    strategy: "oauth_google" | "oauth_facebook" | "oauth_apple";
    variant?: Variant;
}

const SignInWith = ({ strategy, variant = "primary" }: SignInWithProps) => {
    useWarmUpBrowser();

    const { startSSOFlow } = useSSO();

    const onPress = useCallback(async () => {
        try {
            const redirectUrl = AuthSession.makeRedirectUri({
                path: "home",
            });

            const { createdSessionId, setActive } = await startSSOFlow({
                strategy:
                    strategy === "oauth_google"
                        ? "oauth_google"
                        : strategy === "oauth_apple"
                        ? "oauth_apple"
                        : "oauth_facebook",
                redirectUrl: redirectUrl,
            });

            if (createdSessionId) {
                setActive!({ session: createdSessionId });
            }
        } catch (error) {
            console.error("Error during OAuth flow:", error);
        }
    }, [startSSOFlow, strategy]);

    return (
        <AuthButton onPress={onPress} variant={variant}>
            <Image
                source={strategyIcons[strategy]}
                className="w-8 h-8 absolute left-4"
                resizeMode="contain"
            />
            <Text className="font-bold">
                {strategy === "oauth_google"
                    ? "Acceda con Google"
                    : strategy === "oauth_facebook"
                    ? "Acceda con Facebook"
                    : strategy === "oauth_apple"
                    ? "Acceda con Apple"
                    : "Acceda con correo electrónico"}
            </Text>
        </AuthButton>
    );
};

export default SignInWith;
