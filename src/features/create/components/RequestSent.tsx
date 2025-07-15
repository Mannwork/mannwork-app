import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function RequestSent() {
  const router = useRouter();

  const handleClose = () => {
    router.replace("/(protected)/(mainTabs)/home");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-green-mannwork flex-row items-center justify-between px-4 py-4">
        <View className="w-10" />
        <Text className="text-xl font-bold text-white">¡Éxito!</Text>
        <Pressable onPress={handleClose} className="w-10">
          <MaterialIcons name="close" size={24} color="white" />
        </Pressable>
      </View>

      {/* Contenido principal */}
      <View className="flex-1 ">
        <LinearGradient
          colors={["#f0fdf4", "#dcfce7", "#bbf7d0"]}
          className="flex-1 rounded-3xl p-8 items-center justify-center"
        >
          {/* Icono de éxito con animación */}
          <View className="flex-row justify-center mb-8">
            <View className="bg-green-mannwork w-28 h-28 rounded-full items-center justify-center shadow-xl border-4 border-white">
              <MaterialIcons name="check-circle" size={70} color="#fff" />
            </View>
          </View>

          {/* Título */}
          <Text className="text-4xl font-bold text-green-mannwork mb-3 text-center">
            ¡Perfecto!
          </Text>

          {/* Subtítulo */}
          <Text className="text-xl text-gray-700 text-center mb-6 font-medium">
            Tu solicitud ha sido enviada
          </Text>

          {/* Descripción */}
          <Text className="text-base text-gray-600 text-center mb-8 leading-6 px-4">
            Los profesionales cercanos ya pueden ver tu solicitud y se pondrán
            en contacto contigo pronto.
          </Text>

          {/* Tarjeta de información */}
          <View className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-green-100 w-full">
            <View className="flex-row items-center mb-4">
              <View className="bg-green-100 rounded-full p-2 mr-3">
                <MaterialIcons name="notifications" size={20} color="#2D7A3E" />
              </View>
              <Text className="text-gray-800 font-bold text-lg">
                ¿Qué sigue?
              </Text>
            </View>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <View className="bg-green-mannwork rounded-full w-2 h-2 mt-2 mr-3" />
                <Text className="text-gray-700 text-sm flex-1">
                  Recibirás notificaciones cuando un profesional se interese
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="bg-green-mannwork rounded-full w-2 h-2 mt-2 mr-3" />
                <Text className="text-gray-700 text-sm flex-1">
                  Podrás ver el progreso en &quot;Mis Solicitudes&quot;
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="bg-green-mannwork rounded-full w-2 h-2 mt-2 mr-3" />
                <Text className="text-gray-700 text-sm flex-1">
                  Los profesionales te contactarán por chat
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
