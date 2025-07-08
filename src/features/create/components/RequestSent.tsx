import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
// Si tienes una animación de confeti, podrías importarla aquí (ejemplo: react-native-confetti-cannon)
// import ConfettiCannon from 'react-native-confetti-cannon';

export default function RequestSent() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={["#e9fbe5", "#f6fff9", "#ffffff"]}
      className="flex-1 items-center justify-center px-8 relative"
      style={{ minHeight: "100%" }}
    >
      <Pressable
        className="absolute right-6 top-6 z-10"
        onPress={() => router.back()}
      >
        <MaterialIcons name="close" size={32} color="#2d7a3e" />
      </Pressable>
      <View className="bg-green-mannwork rounded-full p-6 mb-6 shadow-lg border-4 border-white">
        <MaterialIcons name="check-circle" size={90} color="#fff" />
      </View>
      <Text className="text-3xl font-extrabold text-green-mannwork mb-2 text-center drop-shadow-lg">
        ¡Solicitud enviada!
      </Text>
      <Text className="text-lg text-gray-700 text-center mb-8">
        Un profesional se comunicará con usted pronto.
      </Text>
      <TouchableOpacity
        className="bg-green-mannwork rounded-xl px-8 py-3 mt-2 shadow"
        onPress={() => router.replace("/(protected)/(mainTabs)/requests")}
      >
        <Text className="text-white font-bold text-base">
          Volver a mis solicitudes
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
