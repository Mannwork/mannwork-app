import ProfessionalsMap from "@/features/home/components/professional-selecteds/ProfessionalsMap";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfessionalsMapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parsear los datos necesarios
  const professionals = params.professionals
    ? JSON.parse(params.professionals as string)
    : [];
  const clientLocation = params.clientLocation
    ? JSON.parse(params.clientLocation as string)
    : null;
  const selectedProfessionals = params.selectedProfessionals
    ? JSON.parse(params.selectedProfessionals as string)
    : [];

  const handleProfessionalSelect = (professionalId: string) => {
    // Aquí podrías implementar la lógica de selección si es necesario
    console.log("Profesional seleccionado:", professionalId);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-green-mannwork px-4 py-4"
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleClose} className="w-6">
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-xl font-bold text-white">
            Mapa de profesionales
          </Text>
          <View className="w-6" />
        </View>
      </View>

      {/* Mapa */}
      <View className="flex-1">
        <ProfessionalsMap
          professionals={professionals}
          clientLocation={clientLocation}
          selectedProfessionals={selectedProfessionals}
          onProfessionalSelect={handleProfessionalSelect}
          onClose={handleClose}
        />
      </View>
    </View>
  );
}
