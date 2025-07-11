import { User } from "@/common/types/user.interface";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface ProfessionalsMapProps {
  professionals: User[];
  clientLocation: { latitude: number; longitude: number } | null;
  selectedProfessionals: string[];
  onProfessionalSelect?: (professionalId: string) => void;
  onClose?: () => void;
}

export default function ProfessionalsMap({
  professionals,
  clientLocation,
  selectedProfessionals,
  onProfessionalSelect,
  onClose,
}: ProfessionalsMapProps) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: clientLocation?.latitude || 0,
    longitude: clientLocation?.longitude || 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    if (clientLocation) {
      setRegion({
        latitude: clientLocation.latitude,
        longitude: clientLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [clientLocation]);

  const handleMarkerPress = (professional: User) => {
    if (onProfessionalSelect) {
      onProfessionalSelect(professional.id);
    }
  };

  const isProfessionalSelected = (professionalId: string) => {
    return selectedProfessionals.includes(professionalId);
  };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Marcador del cliente */}
        {clientLocation && (
          <Marker
            coordinate={{
              latitude: clientLocation.latitude,
              longitude: clientLocation.longitude,
            }}
            title="Tu ubicación"
            description="Ubicación actual"
          >
            <View className="bg-blue-500 rounded-full p-1 border-2 border-white">
              <MaterialIcons name="my-location" size={16} color="white" />
            </View>
          </Marker>
        )}

        {/* Marcadores de profesionales */}
        {professionals.map((professional) => (
          <Marker
            key={professional.id}
            coordinate={{
              latitude: professional.ubication_json?.latitude || 0,
              longitude: professional.ubication_json?.longitude || 0,
            }}
            title={`${professional.name} ${professional.last_name}`}
            description={
              professional.professions
                ?.map((p) => p.subcategory_name)
                .join(", ") || "Profesional"
            }
            onPress={() => handleMarkerPress(professional)}
          >
            <View
              className={`rounded-full border-2 border-white ${
                isProfessionalSelected(professional.id)
                  ? "ring-2 ring-green-mannwork"
                  : ""
              }`}
            >
              {professional.profile_pic ? (
                <Image
                  source={{ uri: professional.profile_pic }}
                  className="w-8 h-8 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isProfessionalSelected(professional.id)
                      ? "bg-green-mannwork"
                      : "bg-gray-500"
                  }`}
                >
                  <MaterialIcons name="person" size={16} color="white" />
                </View>
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Información de profesionales seleccionados */}
      {selectedProfessionals.length > 0 && (
        <View className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 shadow-lg">
          <Text className="text-lg font-bold mb-2">
            Profesionales seleccionados: {selectedProfessionals.length}
          </Text>
          <Text className="text-gray-600">
            {professionals
              .filter((p) => selectedProfessionals.includes(p.id))
              .map((p) => `${p.name} ${p.last_name}`)
              .join(", ")}
          </Text>
        </View>
      )}
    </View>
  );
}
