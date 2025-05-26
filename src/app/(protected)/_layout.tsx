import { useEffect } from "react";

import { Redirect, Slot } from "expo-router";

import { useAuth } from "@clerk/clerk-expo";

import { supabase } from "@/common/lib/supabase/supabaseClient";

export default function RootLayout() {

  const { isSignedIn, getToken } = useAuth();

  if(!isSignedIn) {
    return (
      <Redirect href="/(auth)/sign-in" />
    );
  }

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

  return <Slot />;
}
