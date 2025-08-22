import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { envs } from "@/common/config/envs";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelected: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
}

interface PlacePrediction {
  place_id: string;
  description: string;
}

const LocationPickerModal = ({
  visible,
  onClose,
  onLocationSelected,
}: LocationPickerModalProps) => {
  const insets = useSafeAreaInsets();
  const [region, setRegion] = useState({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    if (visible) {
      (async () => {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let loc = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          setMarker({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          handleReverseGeocode(loc.coords.latitude, loc.coords.longitude);
        }
        setLoading(false);
      })();
    }
  }, [visible]);

  const searchPlaces = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${
          envs.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY
        }&types=geocode&language=es&components=country:ar`
      );
      const data = await response.json();

      if (data.predictions) {
        setPredictions(data.predictions);
        setShowPredictions(true);
      }
    } catch (error) {
      console.error("Error searching places:", error);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    searchPlaces(text);
  };

  const selectPlace = async (prediction: PlacePrediction) => {
    setSearchQuery(prediction.description);
    setShowPredictions(false);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${envs.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}&fields=geometry,formatted_address`
      );
      const data = await response.json();

      if (data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setMarker({ latitude: lat, longitude: lng });
        setAddress(data.result.formatted_address || prediction.description);
      }
    } catch (error) {
      console.error("Error getting place details:", error);
    }
  };

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    handleReverseGeocode(latitude, longitude);
  };

  const handleReverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const res = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (res.length > 0) {
        const { street, name, city, region, postalCode } = res[0];
        setAddress(
          `${street || name || ""}, ${city || region || ""} ${postalCode || ""}`
        );
      } else {
        setAddress("");
      }
    } catch {
      setAddress("");
    }
  };

  const handleUseMyLocation = async () => {
    setLoading(true);
    let loc = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setMarker({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    handleReverseGeocode(loc.coords.latitude, loc.coords.longitude);
    setLoading(false);
  };

  const handleSelect = () => {
    if (marker) {
      onLocationSelected({ ...marker, address });
    }
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setSearchQuery("");
      setPredictions([]);
      setShowPredictions(false);
    }, 150);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setSearchQuery("");
      setPredictions([]);
      setShowPredictions(false);
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View
            className="bg-green-mannwork"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderBottomWidth: 1,
            }}
          >
            <Pressable onPress={handleClose} style={{ width: 32 }}>
              <MaterialIcons name="close" size={28} color="#fff" />
            </Pressable>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              Seleccionar ubicación
            </Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Barra de búsqueda */}
          <View style={{ padding: 16, paddingBottom: 8 }}>
            <View
              style={{
                backgroundColor: "#F3F4F6",
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                height: 44,
              }}
            >
              <MaterialIcons name="search" size={22} color="#888" />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 16,
                  color: "#222",
                }}
                placeholder="Buscar dirección..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearchChange}
                onFocus={() => setShowPredictions(true)}
              />
            </View>

            {/* Predictions */}
            {showPredictions && predictions.length > 0 && (
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  marginTop: 4,
                  maxHeight: 200,
                  borderWidth: 1,
                  borderColor: "#eee",
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                <FlatList
                  data={predictions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => selectPlace(item)}
                      style={{
                        padding: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "#f0f0f0",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#222",
                        }}
                      >
                        {item.description}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>

          {/* Mapa */}
          {!isClosing && (
            <View
              style={{
                flex: 1,
                marginHorizontal: 16,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <MapView
                provider={
                  Platform.OS === "android" ? PROVIDER_GOOGLE : undefined
                }
                style={{ width: "100%", height: "100%" }}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={handleMapPress}
              >
                {marker && (
                  <Marker
                    coordinate={marker}
                    draggable
                    onDragEnd={handleMapPress}
                  />
                )}
              </MapView>
            </View>
          )}

          {/* Dirección seleccionada */}
          <View style={{ padding: 16, paddingTop: 8 }}>
            <Text
              style={{
                color: "#2D7A3E",
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              {address ? address : "Selecciona una ubicación en el mapa"}
            </Text>
          </View>

          {/* Botones */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}
          >
            <Pressable
              onPress={handleUseMyLocation}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderColor: "#2D7A3E",
                borderWidth: 2,
                borderRadius: 24,
                paddingVertical: 12,
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: "#2D7A3E",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                Mi ubicación
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSelect}
              style={{
                flex: 1,
                backgroundColor: "#2D7A3E",
                borderRadius: 24,
                paddingVertical: 12,
                alignItems: "center",
                marginLeft: 8,
              }}
              disabled={!marker}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                Seleccionar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocationPickerModal;
