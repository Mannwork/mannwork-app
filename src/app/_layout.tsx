import { Slot } from "expo-router";

import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/common/lib/nativewind/global.css";
import { StatusBar } from "react-native";

export default function RootLayout() {

  const queryClient = new QueryClient();

  return (
      <QueryClientProvider client={queryClient}>
        <ClerkProvider tokenCache={tokenCache}>
         <StatusBar
            barStyle="light-content"
            backgroundColor="#2D7A3E"
            translucent={true}
          />
          <Slot />
        </ClerkProvider>
      </QueryClientProvider>
  )
}
