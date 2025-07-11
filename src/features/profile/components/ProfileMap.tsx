import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";

interface ProfileMapProps {
  coverageRadius: number; // en km
  latitude: number;
  longitude: number;
  onPress?: () => void;
}

function getDeltaFromRadius(radiusKm: number) {
  // Aproximación: 1 grado de latitud son ~111km
  const delta = radiusKm / 80; // Un poco más de zoom para que se vea el círculo
  return delta;
}

const ProfileMap = ({
  coverageRadius,
  latitude,
  longitude,
  onPress,
}: ProfileMapProps) => {
  const { width } = useWindowDimensions();
  const mapHeight = 260;
  const delta = getDeltaFromRadius(coverageRadius);

  return (
    <View className="bg-white px-4 py-4">
      <Text className="text-xl font-bold text-green-mannwork mb-3">
        Ubicación
      </Text>

      <View className="flex-row items-center my-1 mb-5">
        <MaterialIcons name="location-on" size={24} color="#2D7A3E" />
        <Text className="text-base text-gray-600 ml-2">
          Radio de cobertura:{" "}
          <Text className="font-semibold text-green-mannwork">
            {coverageRadius}km
          </Text>
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          height: mapHeight,
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <MapView
          style={{ width: "100%", height: "100%", borderRadius: 16 }}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: delta,
            longitudeDelta: delta,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} />
          <Circle
            center={{ latitude, longitude }}
            radius={coverageRadius * 1000}
            strokeColor="#2D7A3E"
            fillColor="rgba(45, 122, 62, 0.15)"
          />
        </MapView>
      </View>
      {onPress && (
        <Pressable
          onPress={onPress}
          className="bg-gray-100 rounded-lg h-10 items-center justify-center mt-2"
        >
          <MaterialIcons name="map" size={24} color="#2D7A3E" />
          <Text className="text-sm text-gray-600 mt-1">
            Ver mapa de cobertura
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default ProfileMap;
