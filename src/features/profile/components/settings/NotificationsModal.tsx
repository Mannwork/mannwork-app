import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NotificationsModal = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View
        className="flex-row items-center bg-green-mannwork justify-between px-4 py-4 border-b border-gray-200 shadow-md"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-1" />
        <Text className="text-2xl font-bold text-white text-center">
          Notificaciones
        </Text>
        <View className="flex-1 items-end">
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Opciones de notificación */}
      <View className="px-4 pt-8 pb-2 flex-1">
        <View className="flex-1 w-full items-center gap-y-6">
          {/* Tarjeta Push */}
          <View
            className="w-11/12 bg-white rounded-3xl p-5 flex-row items-center justify-between shadow-lg"
            style={{ elevation: 4 }}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-14 h-14 bg-green-mannwork/10 rounded-2xl items-center justify-center mr-5">
                <MaterialIcons
                  name="notifications-active"
                  size={32}
                  color="#2D7A3E"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base mb-1">
                  Notificaciones push
                </Text>
                <Text className="text-gray-500 text-sm leading-5">
                  Recibe alertas importantes directamente en tu dispositivo
                  móvil.
                </Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: "#d1d5db", true: "#2D7A3E" }}
              thumbColor={pushEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>

          {/* Tarjeta Email */}
          <View
            className="w-11/12 bg-white rounded-3xl p-5 flex-row items-center justify-between shadow-lg"
            style={{ elevation: 4 }}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-14 h-14 bg-green-mannwork/10 rounded-2xl items-center justify-center mr-5">
                <MaterialIcons name="email" size={32} color="#2D7A3E" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base mb-1">
                  Notificaciones por email
                </Text>
                <Text className="text-gray-500 text-sm leading-5">
                  Recibe avisos y novedades en tu correo electrónico registrado.
                </Text>
              </View>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: "#d1d5db", true: "#2D7A3E" }}
              thumbColor={emailEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>
        <View className="h-12" />
      </View>
    </View>
  );
};

export default NotificationsModal;
