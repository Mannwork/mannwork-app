import { StatusBar } from "react-native";

import { Slot } from "expo-router";

import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/common/lib/nativewind/global.css";
import { ClerkSupabaseProvider } from "@/common/providers/ClerkSupabaseProvider";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache}>
        <ClerkSupabaseProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#2D7A3E"
            translucent={true}
          />
          <Slot />
        </ClerkSupabaseProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}
