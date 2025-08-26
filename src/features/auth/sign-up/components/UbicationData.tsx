import CustomInput from "@/common/components/CustomInput";
import { envs } from "@/common/config/envs";
import { Ubication } from "@/common/types/ubication.interface";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";
import { z } from "zod";
import AuthButton from "../../components/AuthButton";
import { useAuthStore } from "../store/auth.store";
import HeaderRegisterSteps from "./HeaderRegisterSteps";
import UserUbicationMap from "./UserUbicationMap";

const ubicationSchema = z.object({
  address: z.string().min(1, "La dirección es requerida"),
  street: z.string().min(1, "La calle es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  province: z.string().min(1, "La provincia es requerida"),
  postalCode: z.string().min(1, "El código postal es requerido"),
  latitude: z.number(),
  longitude: z.number(),
  type: z.enum(["house", "apartment"]),
  floor: z.string().nullable().optional(),
  apartmentNumber: z.string().nullable().optional(),
  serviceRange: z.coerce.number().min(1, "El rango es requerido").optional(),
});

type UbicationFormData = z.infer<typeof ubicationSchema>;

interface UbicationDataProps {
  role: "client" | "professional";
  onSubmit: (data: Ubication) => void;
}

const UbicationData = ({ role, onSubmit }: UbicationDataProps) => {
  const { ubication_json } = useAuthStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UbicationFormData>({
    resolver: zodResolver(ubicationSchema),
    defaultValues: {
      type: "house",
      floor: null,
      apartmentNumber: null,
    },
  });

  const [inputKey, setInputKey] = useState(Date.now().toString());

  const serviceRange = useWatch({ control, name: "serviceRange" });
  const latitude = useWatch({ control, name: "latitude" });
  const longitude = useWatch({ control, name: "longitude" });
  const addressType = watch("type");

  useFocusEffect(
    useCallback(() => {
      if (ubication_json) {
        setValue("address", ubication_json.street);
        setValue("street", ubication_json.street);
        setValue("city", ubication_json.city);
        setValue("province", ubication_json.province);
        setValue("postalCode", ubication_json.postalCode || "");
        setValue("latitude", ubication_json.latitude);
        setValue("longitude", ubication_json.longitude);
        if (role === "professional" && ubication_json.serviceRange) {
          setValue("serviceRange", ubication_json.serviceRange);
        }
      }
    }, [ubication_json, setValue, role])
  );

  const handleLocationChange = async (coords: {
    latitude: number;
    longitude: number;
  }) => {
    setValue("latitude", coords.latitude);
    setValue("longitude", coords.longitude);

    try {
      const addressResponse = await Location.reverseGeocodeAsync(coords);
      if (addressResponse && addressResponse.length > 0) {
        const ad = addressResponse[0];
        const streetPart = ad.streetNumber
          ? `${ad.street} ${ad.streetNumber}`
          : ad.street;
        const formattedAddress = [streetPart, ad.city, ad.region, ad.country]
          .filter(Boolean)
          .join(", ");
        setValue("address", formattedAddress, { shouldValidate: true });
        setValue("street", streetPart as string);
        setValue("city", ad.city as string);
        setValue("province", ad.region as string);
        setValue("postalCode", ad.postalCode as string);
        setTimeout(() => setInputKey(Date.now().toString()), 0);
      }
    } catch (error) {
      console.error("Reverse geocoding failed", error);
      const newAddress = `${coords.latitude.toFixed(
        5
      )}, ${coords.longitude.toFixed(5)}`;
      setValue("address", newAddress, {
        shouldValidate: true,
      });
      setTimeout(() => setInputKey(Date.now().toString()), 0);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-white">
        <HeaderRegisterSteps />
        <View className="flex-1">
          <View className="px-6 pt-4">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Tu ubicación
            </Text>
            <Text className="text-gray-600 mb-6">
              Necesitamos saber dónde te encuentras
            </Text>

            <View className="mb-5">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Dirección
              </Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, value } }) => (
                    <View className="relative">
                      <GooglePlacesTextInput
                        key={inputKey}
                        apiKey={envs.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}
                        onPlaceSelect={async (place) => {
                          if (place.details?.location) {
                            const { latitude, longitude } =
                              place.details.location;
                            handleLocationChange({
                              latitude,
                              longitude,
                            });

                            // Actualizar el texto de la dirección
                            try {
                              const addressResponse =
                                await Location.reverseGeocodeAsync({
                                  latitude,
                                  longitude,
                                });
                              if (addressResponse?.[0]) {
                                const ad = addressResponse[0];
                                const streetPart = ad.streetNumber
                                  ? `${ad.street} ${ad.streetNumber}`
                                  : ad.street;
                                const formattedAddress = [
                                  streetPart,
                                  ad.city,
                                  ad.region,
                                  ad.country,
                                ]
                                  .filter(Boolean)
                                  .join(", ");
                                onChange(formattedAddress);
                              }
                            } catch (error) {
                              console.error(
                                "Error al obtener la dirección:",
                                error
                              );
                            } finally {
                              setInputKey(Date.now().toString());
                            }
                          }
                        }}
                        placeHolderText="Escribe tu dirección"
                        fetchDetails={true}
                        onTextChange={onChange}
                        value={value}
                      />
                      <View className="absolute left-4 top-3.5 z-10">
                        <MaterialIcons
                          name="location-on"
                          size={20}
                          color="#6b7280"
                        />
                      </View>
                    </View>
                  )}
                />
                {errors.address && (
                  <Text className="text-red-500 text-xs mt-1 ml-1">
                    {errors.address.message}
                  </Text>
                )}
              </View>
            </View>

            <View className="h-48 rounded-xl overflow-hidden border border-gray-200 mb-6">
              <UserUbicationMap
                role={role}
                onLocationChange={handleLocationChange}
                serviceRange={serviceRange}
                latitude={latitude}
                longitude={longitude}
              />
              <View className="absolute bottom-3 left-0 right-0 items-center">
                <View className="bg-white/90 px-4 py-2 rounded-full shadow-md border border-gray-200">
                  <Text className="text-sm text-gray-700 font-medium">
                    Mueve el mapa para ajustar tu ubicación
                  </Text>
                </View>
              </View>
            </View>

            {role === "client" && (
              <View className="mb-5">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Tipo de domicilio
                </Text>
                <View className="flex flex-row space-x-3">
                  <Pressable
                    className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                      addressType === "house"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onPress={() => setValue("type", "house")}
                  >
                    <Text
                      className={`text-center font-medium ${
                        addressType === "house"
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      Casa
                    </Text>
                  </Pressable>
                  <Pressable
                    className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                      addressType === "apartment"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200"
                    }`}
                    onPress={() => setValue("type", "apartment")}
                  >
                    <Text
                      className={`text-center font-medium ${
                        addressType === "apartment"
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      Departamento
                    </Text>
                  </Pressable>
                </View>

                {addressType === "apartment" && (
                  <View className="mt-4 grid grid-cols-2 gap-4">
                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-1">
                        Piso
                      </Text>
                      <CustomInput
                        control={control}
                        name="floor"
                        placeholder="Ej: 5"
                        inputClassName={`h-12 ${
                          errors.floor ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.floor && (
                        <Text className="text-red-500 text-xs mt-1">
                          {errors.floor.message}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-1">
                        Número
                      </Text>
                      <CustomInput
                        control={control}
                        name="apartmentNumber"
                        placeholder="Ej: B"
                        inputClassName={`h-12 ${
                          errors.apartmentNumber
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                      />
                      {errors.apartmentNumber && (
                        <Text className="text-red-500 text-xs mt-1">
                          {errors.apartmentNumber.message}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            )}

            {role === "professional" && (
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Rango de servicio (km)
                </Text>
                <CustomInput
                  control={control}
                  name="serviceRange"
                  placeholder="Ej: 5"
                  keyboardType="numeric"
                  inputClassName={`h-12 ${
                    errors.serviceRange ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.serviceRange && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.serviceRange.message}
                  </Text>
                )}
                <Text className="text-xs text-gray-500 mt-1">
                  Establece el radio máximo de distancia para tus servicios
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
          <AuthButton
            onPress={handleSubmit(onSubmit as any)}
            className="bg-green-mannwork py-4 rounded-xl shadow-lg"
          >
            <Text className="text-white font-bold text-lg">CONTINUAR</Text>
          </AuthButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    marginBottom: 10,
  },
  mapContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 10,
  },
  addressTypeContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  addressTypeButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  addressTypeButtonSelected: {
    backgroundColor: "#e0e0e0",
  },
});

export default UbicationData;
