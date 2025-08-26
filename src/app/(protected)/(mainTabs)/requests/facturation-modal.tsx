import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useCurrentUser } from "@/features/profile";
import useFacturation from "@/features/request/hooks/useFacturation";

const FacturationModal = () => {
    const insets = useSafeAreaInsets();
    const { data: user } = useCurrentUser();
    const isPro = user?.membership_json?.isPro;

    const { requestId, requestStatus } = useLocalSearchParams<{
        requestId: string;
        requestStatus: string;
    }>();

    const { data, isLoading, isError } = useFacturation(requestId);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    if (isError || !data) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Error al cargar la información de facturación.</Text>
            </View>
        );
    }

    const handleDownload = async () => {
        // Verificar si el enlace se puede abrir
        const supported = await Linking.canOpenURL(data.invoice_url);

        if (supported) {
            await Linking.openURL(data.invoice_url);
        } else {
            Alert.alert(`No se puede abrir el enlace: ${data.invoice_url}`);
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Aquí puedes agregar el contenido del modal de facturación */}
            <View
                className="bg-green-mannwork flex-row items-center justify-between px-4 py-4"
                style={{ paddingTop: insets.top + 16 }}
            >
                <Pressable onPress={() => router.back()} className="p-2">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </Pressable>

                <Text className="text-xl font-semibold text-white">
                    Facturación de la solicitud
                </Text>

                <View className="w-10" />
            </View>

            <View className="my-4 px-4 py-4 bg-gray-50">
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Detalle
                </Text>

                <View className="space-y-3">
                    {/* Estado del servicio */}
                    <View className="flex-row items-center justify-between bg-white p-3 rounded-lg">
                        <View className="w-full flex flex-row items-center justify-between">
                            <Text className="text-gray-700 ml-2">Montos:</Text>
                            <View>
                                <View className="flex-row items-center justify-between pb-2 mb-2">
                                    <Text className="text-gray-500 mr-2">
                                        Monto total:
                                    </Text>
                                    <Text className="text-gray-500 mr-2">
                                        {`$${data.amount} ARS`}
                                    </Text>
                                </View>
                                <View className="flex-row items-center justify-between border-b border-gray-200 pb-2 mb-2">
                                    <Text className="text-gray-500 mr-2">
                                        Comisión:
                                    </Text>
                                    <Text className="text-gray-500 mr-2">
                                        {`$${
                                            data.amount * (isPro ? 0.01 : 0.05)
                                        } ARS`}
                                    </Text>
                                </View>
                                <View className="flex-row items-center justify-between pb-2 mb-2">
                                    <Text className="text-gray-500 mr-2">
                                        A cobrar:
                                    </Text>
                                    <Text className="text-gray-500 mr-2">
                                        {`$${
                                            data.amount - data.amount * 0.05
                                        } ARS`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Estado del pago */}
                    <View className="flex-row items-center justify-between bg-white p-3 rounded-lg">
                        <View className="flex-row items-center">
                            <MaterialIcons
                                name="payment"
                                size={20}
                                color="#6B7280"
                            />
                            <Text className="text-gray-700 ml-2">
                                Estado del pago
                            </Text>
                        </View>
                        <Text className={`font-medium`}>
                            {requestStatus === "completed"
                                ? "Pago enviado"
                                : "Retenido hasta completar el servicio"}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="my-4 px-4 py-4 bg-gray-50">
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Acciones
                </Text>

                <Text className="text-gray-500 text-center">
                    Recuerda que el monto final que veas reflejado en tu cuenta
                    puede variar si Mercado Pago cobra comisiones en tu zona.
                </Text>
            </View>
        </View>
    );
};

export default FacturationModal;
