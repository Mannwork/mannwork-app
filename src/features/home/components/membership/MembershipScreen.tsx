import { getSubscriptionUrl } from "@/common/utils/mp-subscription-redirect";
import { useCurrentUser } from "@/features/profile";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const benefits = [
  { icon: "star", label: "Aparecé primero en las búsquedas" },
  { icon: "percent", label: "Comisión reducida en trabajos" },
  { icon: "repeat", label: "Más postulaciones diarias" },
  { icon: "verified", label: "Medalla PRO en tu perfil" },
  { icon: "bar-chart", label: "Estadísticas avanzadas" },
  { icon: "support-agent", label: "Soporte prioritario" },
  { icon: "attach-file", label: "Poder enviar fotos y archivos" },
];

const MembershipScreen = () => {
  const { data: user } = useCurrentUser();
  const router = useRouter();

  // Función para obtener el email de la cuenta de Mercado Pago
  const getMpUserEmail = async (mpAccessToken: string) => {
    try {
      const response = await fetch("https://api.mercadopago.com/users/me", {
        headers: {
          Authorization: `Bearer ${mpAccessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData.email;
      }
    } catch (e) {
      console.error("Error obteniendo email de MP:", e);
    }
    return null;
  };

  const handleSubscription = async () => {
    try {
      let payerEmail = user?.email as string; // Email por defecto (registrado en la app)

      // Si el usuario tiene access token de MP, obtener su email de MP
      if (user?.mp_access_token) {
        const mpEmail = await getMpUserEmail(user.mp_access_token);

        if (mpEmail) {
          payerEmail = mpEmail; // Usar el email de la cuenta de MP
          console.log("Usando email de MP:", mpEmail);
        } else {
          console.warn(
            "No se pudo obtener email de MP, usando email registrado"
          );
        }
      } else {
        console.log(
          "Usuario no tiene access token de MP, usando email registrado"
        );
      }

      const url = await getSubscriptionUrl(
        10,
        payerEmail, // Usar el email correcto (MP o registrado)
        user?.id as string
      );

      if (url) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "No se pudo generar el enlace de pago");
      }
    } catch (error) {
      console.error("Error en handleSubscription:", error);
      Alert.alert("Error", "Hubo un problema al procesar la suscripción");
    }
  };

  const handleClose = () => {
    router.replace("/(protected)/(mainTabs)/home");
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="bg-green-mannwork flex-row items-center justify-between px-4 py-4">
        <View className="w-10" />
        <Text className="text-xl font-bold text-white">
          Activa tu membresía
        </Text>
        <Pressable onPress={handleClose} className="w-10">
          <MaterialIcons name="close" size={24} color="white" />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado en una sola línea */}
        <View className="items-center mt-10 mb-6 flex-row justify-center">
          <Text className="text-3xl font-extrabold text-green-mannwork tracking-widest uppercase mr-2">
            MANNWORK
          </Text>
          <Text
            className="text-3xl font-extrabold tracking-widest uppercase"
            style={{
              color: "#4BBE7F",
            }}
          >
            PREMIUM
          </Text>
        </View>

        {/* Tarjeta central NEGRA */}
        <View className="mx-5 rounded-3xl bg-neutral-900 border-2 border-green-mannwork shadow-2xl p-7 mb-5">
          <Text className="text-white text-xl font-bold mb-2 text-center">
            ¡Llevá tus trabajos al siguiente nivel!
          </Text>
          <View className="flex-col gap-y-3 mt-4 mb-4">
            {benefits.map((b) => (
              <View key={b.label} className="flex-row items-center mb-1">
                <View className="bg-green-400/20 rounded-full p-2 mr-4">
                  <MaterialIcons
                    name={b.icon as any}
                    size={24}
                    color="#4BBE7F"
                  />
                </View>
                <Text className="text-white text-base font-medium">
                  {b.label}
                </Text>
              </View>
            ))}
          </View>
          <View className="flex-row items-center justify-center mt-6 mb-2">
            <Text className="text-green-400 text-3xl font-extrabold mr-2">
              $10
            </Text>
            <Text className="text-white text-lg font-bold">USD/mes</Text>
          </View>
          <View className="flex-row items-center justify-center mb-2">
            <Text className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold mr-2">
              Incluye 30 días
            </Text>
            <Text className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
              Cancelá cuando quieras
            </Text>
          </View>
        </View>

        {/* Botón */}
        <Pressable
          className="mx-10 rounded-full bg-green-mannwork py-4 items-center shadow-lg"
          onPress={() => {
            handleSubscription();
          }}
        >
          <Text className="text-white font-extrabold text-lg tracking-wide">
            ¡Quiero ser Premium!
          </Text>
        </Pressable>
        {/* Espacio extra para que el botón nunca quede pegado abajo */}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

export default MembershipScreen;
