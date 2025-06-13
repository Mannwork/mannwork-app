import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_BG = "#2D7A3E";
const ACTIVE_COLOR = "#2D7A3E";
const INACTIVE_COLOR = "#fff";

const TAB_LABELS = {
  home: "Home",
  chats: "Chats",
  requests: "Solicitudes",
  profile: "Perfil",
};

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BG,
          borderTopWidth: 0,
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 4,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof TAB_LABELS = "home";
          if (route.name === "chats") iconName = "chats";
          if (route.name === "requests") iconName = "requests";
          if (route.name === "profile") iconName = "profile";

          let iconMaterial = "home";
          if (iconName === "chats") iconMaterial = "chat";
          if (iconName === "requests") iconMaterial = "inbox";
          if (iconName === "profile") iconMaterial = "person";

          return (
            <View className="items-center justify-center">
              <View
                className={`items-center mt-1 justify-center ${
                  focused ? "bg-white rounded-full" : ""
                }`}
                style={
                  focused
                    ? { minWidth: 56, minHeight: 32 }
                    : { minWidth: 56, minHeight: 32 }
                }
              >
                <MaterialIcons
                  name={iconMaterial as any}
                  size={26}
                  color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
                />
              </View>
              <Text
                className={`text-xs mt-1  font-bold text-white`}
                style={{
                  fontFamily: "System",
                  fontSize: 11,
                  width: 80,
                  textAlign: "center",
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {TAB_LABELS[iconName]}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="chats" />
      <Tabs.Screen name="requests" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
