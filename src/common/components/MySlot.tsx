import { ActivityIndicator, StatusBar } from "react-native";

import { Slot } from "expo-router";

import { useProtectedRoute } from "../hooks/useProtectedRoute";

import MyView from "./MyView";

const MySlot = () => {
  const { isLoaded } = useProtectedRoute();

  return isLoaded ? (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2D7A3E"
        translucent={true}
      />
      <Slot />
    </>
  ) : (
    <MyView className="items-center justify-center">
      <ActivityIndicator size="large" />
    </MyView>
  );
};

export default MySlot;
