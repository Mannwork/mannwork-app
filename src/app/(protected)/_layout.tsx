import { useEffect } from "react";

import { Redirect, Stack } from 'expo-router';

import { useAuth } from "@clerk/clerk-expo";

import { supabase } from "@/common/lib/supabase/supabaseClient";

const ProtectedLayout = () => {
  const { isSignedIn, getToken } = useAuth();

  useEffect(()=> {
    const syncSupabaseAuth = async () =>{
      if(isSignedIn) {
        try {
          const supabaseAccessToken = await getToken({ template: 'supabase' });
  
          if (supabaseAccessToken) {
            await supabase.auth.setSession({
              access_token: supabaseAccessToken,
              refresh_token: '',
            })
          } else {
            console.warn("Failed to get Supabase token from Clerk.");
          }
        } catch (error) {
          console.error("Error synchronizing Supabase auth with Clerk:", error);
        }
      } else {
        await supabase.auth.signOut();
      }
    }

    syncSupabaseAuth();
  },[isSignedIn, getToken]);

  if(!isSignedIn) {
    return (
      <Redirect href="/(auth)/sign-in" />
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(mainTabs)" options={{ headerShown: false }} />
      <Stack.Screen name="membership" />
      <Stack.Screen name="users" />
    </Stack>
  );
};

export default ProtectedLayout;
