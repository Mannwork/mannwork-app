import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { envs } from "@/common/config/envs";

import { ClerkSupabaseProvider } from "@/common/providers/ClerkSupabaseProvider";

import MySlot from "@/common/components/MySlot";

import "@/common/lib/nativewind/global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={envs.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <ClerkSupabaseProvider>
                <QueryClientProvider client={queryClient}>
                    <MySlot />
                </QueryClientProvider>
            </ClerkSupabaseProvider>
        </ClerkProvider>
    );
}
