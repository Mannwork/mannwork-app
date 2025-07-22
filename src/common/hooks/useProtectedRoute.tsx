import { useEffect, useMemo } from "react";

import { useRouter, useSegments } from "expo-router";

import { useAuth } from "@clerk/clerk-expo";

import { useQuery } from "@tanstack/react-query";

import { getOnboardingStatus } from "../services/get-onboarding-status";

export const useProtectedRoute = () => {
    const { isLoaded: isClerkLoaded, isSignedIn, userId } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    const segmentsStr = useMemo(() => segments.join("/"), [segments]);

    const {
        data: isOnboardingComplete,
        isLoading: isOnboardingLoading,
        isError,
    } = useQuery({
        queryKey: ["onboarding-status", userId],
        queryFn: () => getOnboardingStatus(userId!),
        enabled: isClerkLoaded && !!userId,
    });

    useEffect(() => {
        if (!isClerkLoaded) {
            return;
        }

        const inAuthGroup = segments[0] === "(auth)";
        const inSignInModalGroup =
            segments[0] === "(auth)" && segments[1] === "sign-in-modal";
        const inSignUpIndex =
            segments.length === 2 &&
            segments[0] === "(auth)" &&
            segments[1] === "sign-up";
        const inForgotPassIndex =
            segments.length === 2 &&
            segments[0] === "(auth)" &&
            segments[1] === "forgot-pass";

        if (
            !isSignedIn &&
            !inSignInModalGroup &&
            !inSignUpIndex &&
            !inForgotPassIndex
        ) {
            router.replace("/(auth)/sign-in");
            return;
        }

        if (isOnboardingLoading) {
            return;
        }

        if (isError) {
            router.replace("/(auth)/sign-in");
            return;
        }

        if (isOnboardingComplete === false) {
            const inOnboardingFlow =
                segments[0] === "(auth)" && segments[1] === "sign-up";

            if (!inOnboardingFlow) {
                router.replace("/(auth)/sign-up/rol-select");
                return;
            }
        } else if (isOnboardingComplete === true && inAuthGroup) {
            router.replace("/(protected)/(mainTabs)/home");
            return;
        }
    }, [
        isClerkLoaded,
        isSignedIn,
        isOnboardingLoading,
        isOnboardingComplete,
        isError,
        segmentsStr,
    ]);

    // El layout principal está listo para mostrarse solo cuando Clerk ha cargado
    // y, si el usuario está autenticado, la consulta de onboarding también ha finalizado.
    const isReady = isClerkLoaded && (!isSignedIn || !isOnboardingLoading);

    return { isLoaded: isReady };
};
