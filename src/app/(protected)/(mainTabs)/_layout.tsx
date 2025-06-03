import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen name="home"/>
      <Tabs.Screen name="chats" />
      <Tabs.Screen name="requests" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
