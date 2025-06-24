import CustomInput from "@/common/components/CustomInput";
import MyView from "@/common/components/MyView";
import { Ubication } from "@/common/types/ubication.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, StyleSheet, Text } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { z } from "zod";

const ubicationSchema = z.object({
    province: z.string().min(1, "La provincia es requerida"),
    city: z.string().min(1, "La ciudad es requerida"),
    street: z.string().min(1, "La calle es requerida"),
    type: z.enum(["house", "apartment", "other"]),
    floor: z.string().nullable().optional(),
    apartmentNumber: z.string().nullable().optional(),
    postalCode: z.string().min(1, "El código postal es requerido"),
    latitude: z.number(),
    longitude: z.number(),
    serviceRange: z.coerce.number().min(1, "El rango es requerido").optional(),
});

type UbicationFormData = z.infer<typeof ubicationSchema>;

interface UbicationDataProps {
    role: "client" | "professional";
    onSubmit: (data: Ubication) => void;
}

const UbicationData = ({ role, onSubmit }: UbicationDataProps) => {
    const { control, handleSubmit, setValue, getValues } =
        useForm<UbicationFormData>({
            resolver: zodResolver(ubicationSchema),
            defaultValues: {
                type: "house",
                floor: null,
                apartmentNumber: null,
            },
        });

    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const serviceRange = useWatch({ control, name: "serviceRange" });
    const latitude = useWatch({ control, name: "latitude" });
    const longitude = useWatch({ control, name: "longitude" });

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                // Set a default location (e.g., center of a city)
                const defaultLocation = {
                    latitude: -34.6037,
                    longitude: -58.3816,
                };
                setLocation(defaultLocation);
                setValue("latitude", defaultLocation.latitude);
                setValue("longitude", defaultLocation.longitude);
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);
            setValue("latitude", currentLocation.coords.latitude);
            setValue("longitude", currentLocation.coords.longitude);
            // Automatically fetch address for current location
            handleReverseGeocode(currentLocation.coords);
        })();
    }, [setValue]);

    const handleReverseGeocode = async (coords: {
        latitude: number;
        longitude: number;
    }) => {
        const address = await Location.reverseGeocodeAsync(coords);
        if (address.length > 0) {
            const { city, region, street, postalCode } = address[0];
            setValue("city", city ?? "");
            setValue("province", region ?? "");
            setValue("street", street ?? "");
            setValue("postalCode", postalCode ?? "");
        }
    };

    const handleMapPress = async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const newCoords = { latitude, longitude };
        setLocation(newCoords);
        setValue("latitude", latitude);
        setValue("longitude", longitude);
        handleReverseGeocode(newCoords);
    };

    return (
        <MyView>
            <Text>Ingresa tu ubicación</Text>

            <Text>Provincia</Text>
            <CustomInput
                control={control}
                name="province"
                placeholder="Buenos Aires"
            />

            <Text>Ciudad</Text>
            <CustomInput control={control} name="city" placeholder="La Plata" />

            <Text>Calle y número</Text>
            <CustomInput
                control={control}
                name="street"
                placeholder="Calle Falsa 123"
            />

            <Text>Código Postal</Text>
            <CustomInput
                control={control}
                name="postalCode"
                placeholder="B1900"
            />

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

            <Text>O selecciona en el mapa</Text>

            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={handleMapPress}
                >
                    <Marker
                        coordinate={location}
                        draggable
                        onDragEnd={handleMapPress}
                    />
                    {role === "professional" &&
                        serviceRange &&
                        latitude &&
                        longitude && (
                            <Circle
                                center={{ latitude, longitude }}
                                radius={serviceRange * 1000} // radius in meters
                                strokeColor="rgba(0, 150, 255, 0.5)"
                                fillColor="rgba(0, 150, 255, 0.2)"
                            />
                        )}
                </MapView>
            )}
            {errorMsg && <Text>{errorMsg}</Text>}

            <Button title="Continuar" onPress={handleSubmit(onSubmit as any)} />
        </MyView>
    );
};

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: 300,
        marginVertical: 20,
    },
});

export default UbicationData;
