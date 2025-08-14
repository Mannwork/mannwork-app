import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Platform } from "react-native";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { useAuth } from "@clerk/clerk-expo";

import { supabase } from "@/common/lib/supabase/supabaseClient";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

type NotificationContextType = {
    expoPushToken?: string;
    lastNotification?: Notifications.Notification;
    requestPermission: () => Promise<boolean>;
    refreshToken: () => Promise<string | undefined>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx)
        throw new Error(
            "useNotifications must be used within NotificationProvider"
        );
    return ctx;
}

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            handleRegistrationError(
                "Permission not granted to get push token for push notification!"
            );
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError("Project ID not found");
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;

            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError(
            "Must use physical device for push notifications"
        );
    }
}

export default function NotificationProvider({ children }: PropsWithChildren) {
    const { userId, isSignedIn } = useAuth();
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >(undefined);

    const requestPermission = useCallback(async () => {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();

        if (existingStatus === "granted") return true;

        const { status } = await Notifications.requestPermissionsAsync();

        return status === "granted";
    }, []);

    const refreshToken = useCallback(async () => {
        const token = await registerForPushNotificationsAsync();

        setExpoPushToken(token);

        if (token && isSignedIn && userId) {
            const { data: user, error: fetchError } = await supabase
                .from("users")
                .select("push_token")
                .eq("id", userId)
                .single();

            if (fetchError) {
                console.error("Error fetching user data:", fetchError);
                return;
            }

            if (user && user.push_token !== token) {
                const { error } = await supabase
                    .from("users")
                    .update({ push_token: token })
                    .eq("id", userId);

                if (error) console.error("Error updating push_token:", error);
            }
        }

        return token;
    }, [isSignedIn, userId]);

    useEffect(() => {
        (async () => {
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                });
            }
        })();

        const notificationListener =
            Notifications.addNotificationReceivedListener((n) =>
                setNotification(n)
            );

        const responseListener =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log("Notification response:", response);
                }
            );

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    useEffect(() => {
        // When user signs in, register and persist token
        if (!isSignedIn) return;
        refreshToken();
    }, [isSignedIn, refreshToken]);

    const value: NotificationContextType = useMemo(() => {
        return {
            expoPushToken,
            lastNotification: notification,
            requestPermission,
            refreshToken,
        };
    }, [expoPushToken, notification, requestPermission, refreshToken]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}
