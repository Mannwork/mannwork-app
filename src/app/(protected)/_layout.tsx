import { Redirect, Slot } from "expo-router";

import { useAuth } from "@clerk/clerk-expo";

export default function RootLayout() {

  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}
