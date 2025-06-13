import { useCallback, useEffect } from "react";
import { Image, Text } from "react-native";

import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { useSSO } from "@clerk/clerk-expo";

import Facebook from "@/assets/social/icon-fb.png";
import Google from "@/assets/social/icon-google.png";
import AuthButton from "../../components.tsx/AuthButton";

const strategyIcons = {
  oauth_google: Google,

  oauth_facebook: Facebook,
};

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();

    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

console.log("Facebook", Facebook);

WebBrowser.maybeCompleteAuthSession();

interface SignInWithProps {
  strategy: "oauth_google" | "oauth_facebook";
}

const SignInWith = ({ strategy }: SignInWithProps) => {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  }, []);

  return (
    <AuthButton onPress={onPress}>
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
          : "Acceda con correo electrónico"}
      </Text>
    </AuthButton>
  );
};

export default SignInWith;
