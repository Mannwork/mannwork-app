import { envs } from "@/common/config/envs";
import { Ubication } from "@/common/types/ubication.interface";
import HeaderRegisterSteps from "@/features/auth/sign-up/components/HeaderRegisterSteps";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import AuthButton from "../../../auth/components/AuthButton";
import UserUbicationMap from "../../../auth/sign-up/components/UserUbicationMap";

const ubicationSchema = z.object({
  address: z.string().min(1, "La dirección es requerida"),
  street: z.string().min(1, "La calle es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  province: z.string().min(1, "La provincia es requerida"),
  postalCode: z.string().min(1, "El código postal es requerido"),
  latitude: z.number(),
  longitude: z.number(),
  serviceRange: z.number().min(1, "El rango es requerido"),
});

type UbicationFormData = z.infer<typeof ubicationSchema>;

interface UbicationDataProps {
  initialData?: Ubication;
  onSubmit: (data: Ubication) => void;
}

const EditUbicationData = ({ initialData, onSubmit }: UbicationDataProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UbicationFormData>({
    resolver: zodResolver(ubicationSchema),
    defaultValues: {
      serviceRange: 5,
      ...initialData,
    },
  });

  const [inputKey, setInputKey] = useState(Date.now().toString());

  // Observar valores del formulario para el mapa
  const serviceRange = watch("serviceRange");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const insets = useSafeAreaInsets();
  useFocusEffect(
    useCallback(() => {
      if (initialData) {
        setValue("address", initialData.street);
        setValue("street", initialData.street);
        setValue("city", initialData.city);
        setValue("province", initialData.province);
        setValue("postalCode", initialData.postalCode || "");
        setValue("latitude", initialData.latitude);
        setValue("longitude", initialData.longitude);
        if (initialData.serviceRange) {
          setValue("serviceRange", initialData.serviceRange);
        }
      }
    }, [initialData, setValue])
  );

  const handleLocationChange = async (coords: {
    latitude: number;
    longitude: number;
  }) => {
    setValue("latitude", coords.latitude);
    setValue("longitude", coords.longitude);

    try {
      const addressResponse = await Location.reverseGeocodeAsync(coords);
      if (addressResponse?.[0]) {
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
        setInputKey(Date.now().toString());
      }
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
      const newAddress = `${coords.latitude.toFixed(
        5
      )}, ${coords.longitude.toFixed(5)}`;
      setValue("address", newAddress, { shouldValidate: true });
      setInputKey(Date.now().toString());
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <HeaderRegisterSteps />
        <View className="relative mb-4 bg-green-mannwork h-14">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-2 top-0 z-10 p-2 rounded-full bg-gray-100"
          >
            <MaterialIcons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white text-center">
            EDITAR UBICACIÓN
          </Text>
        </View>
        <View className="flex-1 px-4 pt-4">
          <Text className="text-gray-600 mb-6">
            Actualiza tu ubicación para que los clientes puedan encontrarte
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
                          handleLocationChange({ latitude, longitude });

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
              {errors?.address && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.address.message}
                </Text>
              )}
            </View>
          </View>

          <View className="h-48 rounded-xl overflow-hidden border border-gray-200 mb-6">
            <UserUbicationMap
              role="professional"
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
        </View>

        <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
          <AuthButton
            onPress={handleSubmit(onSubmit as any)}
            className="bg-green-mannwork py-4 rounded-xl shadow-lg"
          >
            <Text className="text-white font-bold text-lg">
              GUARDAR CAMBIOS
            </Text>
          </AuthButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditUbicationData;
