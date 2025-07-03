import MyView from "@/common/components/MyView";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import MapView, { Circle, Marker, Region } from "react-native-maps";

interface UserUbicationMapProps {
    role: "client" | "professional";
    latitude?: number;
    longitude?: number;
    onLocationChange: (coords: { latitude: number; longitude: number }) => void;
    serviceRange?: number;
}

const UserUbicationMap = ({
    role,
    latitude,
    longitude,
    onLocationChange,
    serviceRange,
}: UserUbicationMapProps) => {
    const [region, setRegion] = useState<Region | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeLocation = async () => {
            if (latitude && longitude) {
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                setIsInitialized(true);
            } else {
                let { status } =
                    await Location.requestForegroundPermissionsAsync();
                let coords;
                if (status !== "granted") {
                    setErrorMsg("Permission to access location was denied");
                    coords = { latitude: -34.6037, longitude: -58.3816 }; // Buenos Aires
                } else {
                    try {
                        const currentLocation =
                            await Location.getCurrentPositionAsync({});
                        coords = currentLocation.coords;
                    } catch (error) {
                        console.error("Failed to get current position", error);
                        setErrorMsg("Failed to get current location.");
                        coords = { latitude: -34.6037, longitude: -58.3816 }; // Buenos Aires
                    }
                }
                onLocationChange(coords);
            }
        };

        if (!isInitialized) {
            initializeLocation();
        }
    }, [latitude, longitude, isInitialized, onLocationChange]);

    useEffect(() => {
        if (latitude && longitude) {
            setRegion((prevRegion) => ({
                ...(prevRegion || {
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }),
                latitude,
                longitude,
            }));
        }
    }, [latitude, longitude]);

    const handleMapPress = (event: any) => {
        const newCoords = event.nativeEvent.coordinate;
        onLocationChange(newCoords);
    };

    if (errorMsg) {
        return (
            <MyView className="flex-1 justify-center items-center">
                <Text>{errorMsg}</Text>
            </MyView>
        );
    }

    if (!latitude || !longitude) {
        return (
            <MyView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </MyView>
        );
    }

    return (
        <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            zoomControlEnabled={true}
            initialRegion={{
                latitude: latitude || -34.6037,
                longitude: longitude || -58.3816,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            <Marker
                coordinate={{ latitude, longitude }}
                draggable
                onDragEnd={handleMapPress}
            />
            {role === "professional" &&
                serviceRange &&
                latitude &&
                longitude && (
                    <Circle
                        center={{ latitude, longitude }}
                        radius={serviceRange * 1000}
                        strokeColor="rgba(0, 150, 255, 0.5)"
                        fillColor="rgba(0, 150, 255, 0.2)"
                    />
                )}
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: "100%",
        marginBottom: 10,
    },
});

export default UserUbicationMap;
