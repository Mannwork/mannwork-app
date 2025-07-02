import CustomInput from "@/common/components/CustomInput";
import MyView from "@/common/components/MyView";
import { envs } from "@/common/config/envs";
import { Ubication } from "@/common/types/ubication.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";
import { z } from "zod";
import AuthButton from "../../components/AuthButton";
import { useAuthStore } from "../store/auth.store";
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

    const { control, handleSubmit, setValue, watch } =
        useForm<UbicationFormData>({
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
                const formattedAddress = [
                    streetPart,
                    ad.city,
                    ad.region,
                    ad.country,
                ]
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
        <MyView className="flex-1 p-6">
            <Text>Ingresa tu ubicación</Text>

            <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                    <GooglePlacesTextInput
                        key={inputKey}
                        apiKey={envs.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}
                        onPlaceSelect={async (place) => {
                            if (place.details?.location) {
                                const { latitude, longitude } =
                                    place.details.location;
                                handleLocationChange({ latitude, longitude });

                                // This logic is now in handleLocationChange, but we still need to update the input text.
                                try {
                                    const addressResponse =
                                        await Location.reverseGeocodeAsync({
                                            latitude,
                                            longitude,
                                        });
                                    if (
                                        addressResponse &&
                                        addressResponse.length > 0
                                    ) {
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
                                        "Reverse geocoding failed",
                                        error
                                    );
                                } finally {
                                    setInputKey(Date.now().toString());
                                }
                            }
                        }}
                        placeHolderText="Busca tu dirección"
                        fetchDetails={true}
                        onTextChange={onChange}
                        value={value}
                    />
                )}
            />

            {role === "client" && (
                <>
                    <Text>Tipo de domicilio</Text>
                    <View style={styles.addressTypeContainer}>
                        <Pressable
                            style={[
                                styles.addressTypeButton,
                                addressType === "house" &&
                                    styles.addressTypeButtonSelected,
                            ]}
                            onPress={() => setValue("type", "house")}
                        >
                            <Text>Casa</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.addressTypeButton,
                                addressType === "apartment" &&
                                    styles.addressTypeButtonSelected,
                            ]}
                            onPress={() => setValue("type", "apartment")}
                        >
                            <Text>Departamento</Text>
                        </Pressable>
                    </View>

                    {addressType === "apartment" && (
                        <>
                            <Text>Piso</Text>
                            <CustomInput
                                control={control}
                                name="floor"
                                placeholder="5"
                            />
                            <Text>Departamento</Text>
                            <CustomInput
                                control={control}
                                name="apartmentNumber"
                                placeholder="B"
                            />
                        </>
                    )}
                </>
            )}

            {role === "professional" && (
                <>
                    <Text>Rango de servicio (km)</Text>
                    <CustomInput
                        control={control}
                        name="serviceRange"
                        placeholder="5"
                        keyboardType="numeric"
                    />
                </>
            )}

            <View style={styles.mapContainer}>
                <UserUbicationMap
                    role={role}
                    onLocationChange={handleLocationChange}
                    serviceRange={serviceRange}
                    latitude={latitude}
                    longitude={longitude}
                />
            </View>

            <AuthButton
                onPress={handleSubmit(onSubmit as any)}
                className="bg-green-mannwork"
            >
                <Text className="font-semibold text-background-white">
                    Siguiente
                </Text>
            </AuthButton>
        </MyView>
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
