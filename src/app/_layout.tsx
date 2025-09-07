import * as Sentry from "@sentry/react-native";

import { SplashScreen } from "expo-router";
import { useEffect } from "react";

import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { envs } from "@/common/config/envs";

import { ClerkSupabaseProvider } from "@/common/providers/ClerkSupabaseProvider";
import NotificationProvider from "@/common/providers/PushNotificationProvider";
import { UsersOnlineProvider } from "@/common/providers/UsersOnlineProvider";

import GlobalAlert from "@/common/components/GlobalAlert";
import MySlot from "@/common/components/MySlot";

import "@/common/lib/nativewind/global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayout() {
    useEffect(() => {
        async function prepare() {
            await SplashScreen.hideAsync();
        }

        const initSentry = async () => {
            try {
                await Sentry.init({
                    dsn: "https://31c4ea1b9764b60404c31a44db09f4df@o4509945560694784.ingest.us.sentry.io/4509945563709440",

                    // Adds more context data to events (IP address, cookies, user, etc.)
                    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
                    sendDefaultPii: true,

                    // Configure Session Replay
                    replaysSessionSampleRate: 0.1,
                    replaysOnErrorSampleRate: 1,
                    integrations: [
                        Sentry.mobileReplayIntegration(),
                        Sentry.feedbackIntegration(),
                    ],

                    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
                    // spotlight: __DEV__,
                });
            } catch (error) {
                console.error("Error al inicializar Sentry:", error);
            } finally {
                prepare();
            }
        };

        initSentry();
    }, []);

    return (
        <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={envs.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <ClerkSupabaseProvider>
                <QueryClientProvider client={queryClient}>
                    <NotificationProvider>
                        <UsersOnlineProvider>
                            <MySlot />
                            <GlobalAlert />
                        </UsersOnlineProvider>
                    </NotificationProvider>
                </QueryClientProvider>
            </ClerkSupabaseProvider>
        </ClerkProvider>
    );
}

export default Sentry.wrap(RootLayout);
