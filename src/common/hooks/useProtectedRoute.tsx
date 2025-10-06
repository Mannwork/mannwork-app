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

    const { data: isOnboardingComplete, isLoading: isOnboardingLoading } =
        useQuery({
            queryKey: ["onboarding-status", userId],
            queryFn: () => getOnboardingStatus(userId!),
            enabled: isClerkLoaded && !!userId,
        });

    useEffect(() => {
        // Si Clerk o la consulta de onboarding están cargando, no hagas nada todavía.
        if (!isClerkLoaded || isOnboardingLoading) {
            return;
        }

        const inAuthGroup = segments[0] === "(auth)";
        const inProtectedRouteGroup = segments[0] === "(protected)";
        const inHomeRoute =
            inProtectedRouteGroup &&
            segments[1] === "(mainTabs)" &&
            segments[2] === "home";

        // Caso 1: El usuario ESTÁ autenticado.
        if (isSignedIn) {
            // Y ha completado el onboarding...
            if (isOnboardingComplete) {
                // ... entonces DEBE estar en el grupo protegido. Si no lo está, redirígelo.
                if (!inProtectedRouteGroup) {
                    router.replace("/(protected)/(mainTabs)/home");
                }
                // O no ha completado el onboarding...
            } else {
                // ... entonces DEBE estar en el flujo de onboarding. Si no, redirígelo.
                const inOnboardingFlow =
                    inAuthGroup && segments[1] === "sign-up";
                if (!inOnboardingFlow) {
                    router.replace("/(auth)/sign-up/rol-select");
                }
            }
            // Caso 2: El usuario NO ESTÁ autenticado.
        } else {
            // Si está en la ruta home o en el grupo de autenticación, permitir acceso
            if (inHomeRoute || inAuthGroup) {
                return;
            }
            // ... si no está en home ni en auth, redirígelo a home (acceso público por defecto)
            router.replace("/(auth)/sign-in");
        }
    }, [
        isClerkLoaded,
        isSignedIn,
        isOnboardingLoading,
        isOnboardingComplete,
        segmentsStr, // Mantén segmentsStr para re-evaluar si la ruta cambia manualmente
    ]);

    const isReady = isClerkLoaded && (!isSignedIn || !isOnboardingLoading);

    return { isLoaded: isReady };
};
