import React, { useEffect } from "react";

import { useAuth } from "@clerk/clerk-expo";

import { setClerkTokenProvider } from "../lib/clerk/clerkTokenManager";

interface ClerkSupabaseProviderProps {
  children: React.ReactNode;
}

export function ClerkSupabaseProvider({
  children,
}: ClerkSupabaseProviderProps) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    // Configurar el proveedor de tokens de Clerk para Supabase
    const tokenProvider = async (): Promise<string | null> => {
      if (!isSignedIn) {
        return null;
      }

      try {
        // Usar el token estándar de Clerk sin template personalizado
        const token = await getToken();
        return token;
      } catch (error) {
        console.error("Error obteniendo token de Clerk:", error);
        return null;
      }
    };

    setClerkTokenProvider(tokenProvider);
  }, [getToken, isSignedIn]);

  return <>{children}</>;
}

export function useClerkSupabase() {
  const { isSignedIn, getToken } = useAuth();

  const getSupabaseToken = async (): Promise<string | null> => {
    if (!isSignedIn) {
      return null;
    }

    try {
      return await getToken();
    } catch (error) {
      console.error("Error obteniendo token para Supabase:", error);
      return null;
    }
  };

  return {
    isSignedIn,
    getSupabaseToken,
  };
}
