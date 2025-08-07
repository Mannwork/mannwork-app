import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { categoryIcons } from "@/common/types/categories.interface";
import { router } from "expo-router";
import { useCreateChat } from "../hooks/useCreateChat";
import { RequestItem } from "../interfaces/request.interface";
import { updateRefuseRequest } from "../services/update-refuse-request";
import { updateRequestStatus } from "../services/update-request-status";
import RequestStatusBadge from "./RequestStatusBadge";

interface RequestDetailModalProps {
    request: RequestItem;
    currentUserRole: "client" | "professional";
    isVisible: boolean;
    onClose: () => void;
    onProfessionalPress?: (userId: string) => void; // Nueva prop
    activeTab?: string; // Nueva prop para distinguir entre enviada y recibida
}

const RequestDetailModal = ({
    request,
    currentUserRole,
    isVisible,
    onClose,
    onProfessionalPress, // Nueva prop
}: RequestDetailModalProps) => {
    const insets = useSafeAreaInsets();
    const { userId } = useAuth();

    const { handleCreateChat, isLoading } = useCreateChat({ request });

    // Determinar si es una solicitud enviada por profesional (no soy destinatario)
    const isProSent =
        currentUserRole === "professional" && userId === request.client.id;

    if (!isVisible) return null;

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getUsersDisplay = () => {
        if (currentUserRole === "client") {
            return request.professionals;
        } else {
            if (isProSent) {
                // Profesional viendo su propia solicitud enviada: mostrar solo destinatarios
                return request.professionals;
            }
            // Profesional destinatario: mostrar al cliente
            const client = request.client;
            return client ? [client] : [];
        }
    };

    const users = getUsersDisplay();

    // Obtener el icono de la categoría
    const getCategoryIcon = (categoryName: string) => {
        return categoryIcons[categoryName] || "category";
    };

    const getPaymentStatus = () => {
        // Mock payment status - esto vendría de la API
        switch (request.status) {
            case "searching":
                return {
                    status: "searching",
                    label: "Esperando presupuestos",
                    color: "text-blue-600",
                };
            case "pending":
                return {
                    status: "pending",
                    label: "Pendiente de pago",
                    color: "text-yellow-600",
                };
            case "payed":
                return {
                    status: "payed",
                    label: "Pagado",
                    color: "text-green-600",
                };
            case "working":
                return {
                    status: "working",
                    label: "Trabajo en progreso",
                    color: "text-blue-600",
                };
            case "completed":
                return {
                    status: "completed",
                    label: "Trabajo completado",
                    color: "text-green-600",
                };
            case "cancelled":
                return {
                    status: "cancelled",
                    label: "Cancelado",
                    color: "text-red-600",
                };
            case "refunded":
                return {
                    status: "refunded",
                    label: "Reembolsado",
                    color: "text-red-600",
                };
            default:
                return {
                    status: "pending",
                    label: "Pendiente",
                    color: "text-gray-600",
                };
        }
    };

    const paymentStatus = getPaymentStatus();

    // Determinar qué acciones mostrar según el rol y estado
    const getAvailableActions = () => {
        const actions = [];

        if (
            request.status === "cancelled" ||
            request.status === "refunded" ||
            request.status === "completed"
        ) {
            return [];
        }

        if (userId !== request.client.id) {
            // Profesionales pueden iniciar trabajo (solo si está pendiente) y cancelar
            actions.push({
                id: "start_work",
                label: "Ir al chat",
                color: "bg-green-mannwork",
                onPress: handleCreateChat,
            });

            if (
                request.status === "pending" ||
                request.status === "searching"
            ) {
                actions.push({
                    id: "cancel",
                    label: "Rechazar solicitud",
                    color: "bg-red-500",
                    onPress: async () => {
                        await updateRefuseRequest(request.id, userId as string);

                        router.replace("/(protected)/(mainTabs)/requests");
                    },
                });
            }
        } else {
            if (
                request.status === "searching" ||
                request.status === "pending"
            ) {
                actions.push({
                    id: "cancel",
                    label: "Cancelar solicitud",
                    color: "bg-red-500",
                    onPress: async () => {
                        await updateRequestStatus("cancelled", request.id);

                        router.replace(
                            "/(protected)/(mainTabs)/requests?activeTab=completed"
                        );
                    },
                });
            }

            if (request.status === "working" || request.status === "payed") {
                actions.push({
                    id: "complete_request",
                    label: "Marcar trabajo como finalizado",
                    color: "bg-green-mannwork",
                    onPress: async () => {
                        await updateRequestStatus("completed", request.id);

                        router.replace("/(protected)/(mainTabs)/requests");
                    },
                });
            }
        }

        return actions;
    };

    const availableActions = getAvailableActions();

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View
                className="bg-green-mannwork flex-row items-center justify-between px-4 py-4"
                style={{ paddingTop: insets.top + 16 }}
            >
                <Pressable onPress={onClose} className="p-2">
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                </Pressable>

                <Text className="text-xl font-semibold text-white">
                    Detalle de Solicitud
                </Text>

                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Imágenes */}
                {request.images && request.images.length > 0 && (
                    <View className="px-4 py-4">
                        <Text className="text-lg font-semibold text-gray-900 mb-3">
                            Fotos del trabajo
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-row space-x-3"
                        >
                            {request.images.map((image, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: image }}
                                    className="w-80 h-60 rounded-lg"
                                    resizeMode="cover"
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Información principal */}
                <View className="px-4 py-4">
                    <View className="flex-row items-start justify-between mb-4">
                        <Text className="text-2xl font-bold text-center text-gray-900 flex-1 mr-4">
                            {request.title}
                        </Text>
                    </View>

                    <Text className="text-gray-700 text-base leading-6 mb-6">
                        {request.description}
                    </Text>

                    {/* Categoría */}
                    <View className="flex-row items-center mb-4">
                        <MaterialIcons
                            name={getCategoryIcon(request.category) as any}
                            size={20}
                            color="#6B7280"
                        />
                        <Text className="text-gray-600 ml-2 text-base">
                            {request.category} • {request.subcategory}
                        </Text>
                    </View>

                    {/* Ubicación */}
                    <View className="flex-row items-start mb-4">
                        <MaterialIcons
                            name="location-on"
                            size={20}
                            color="#6B7280"
                        />
                        <Text className="text-gray-600 ml-2 text-base flex-1">
                            {request.location.address}
                        </Text>
                    </View>

                    {/* Fecha */}
                    <View className="flex-row items-center mb-6">
                        <MaterialIcons
                            name="schedule"
                            size={20}
                            color="#6B7280"
                        />
                        <Text className="text-gray-600 ml-2 text-base">
                            Creada el {formatDate(request.createdAt)}
                        </Text>
                    </View>
                </View>

                {/* Estados */}
                <View className="px-4 py-4 bg-gray-50">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">
                        Estados
                    </Text>

                    <View className="space-y-3">
                        {/* Estado del servicio */}
                        <View className="flex-row items-center justify-between bg-white p-3 rounded-lg">
                            <View className="flex-row items-center">
                                <MaterialIcons
                                    name="build"
                                    size={20}
                                    color="#6B7280"
                                />
                                <Text className="text-gray-700 ml-2">
                                    Estado del servicio
                                </Text>
                            </View>
                            <RequestStatusBadge status={request.status} />
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
                            <Text
                                className={`font-medium ${paymentStatus.color}`}
                            >
                                {paymentStatus.label}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Usuarios involucrados */}
                <View className="px-4 py-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">
                        {currentUserRole === "client"
                            ? "Profesionales"
                            : isProSent
                            ? "Profesionales"
                            : "Cliente"}
                    </Text>

                    {users.map((user, index) => {
                        // Permitir navegar al perfil de cualquier usuario menos a mí mismo
                        const isMyself = userId === user.id;
                        const isPressable = !isMyself && !!onProfessionalPress;
                        const CardWrapper = isPressable ? Pressable : View;
                        const cardProps = isPressable
                            ? {
                                  onPress: () =>
                                      onProfessionalPress &&
                                      onProfessionalPress(user.id),
                                  className: "bg-gray-50 p-4 rounded-lg mb-3",
                              }
                            : { className: "bg-gray-50 p-4 rounded-lg mb-3" };
                        return (
                            <CardWrapper key={user.id} {...cardProps}>
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <View className="w-12 h-12 bg-green-mannwork rounded-full items-center justify-center">
                                            <Text className="text-white font-bold text-lg">
                                                {user.name.charAt(0)}
                                                {user.last_name.charAt(0)}
                                            </Text>
                                        </View>
                                        <View className="ml-3">
                                            <Text className="text-gray-900 font-semibold text-base">
                                                {user.name}{" "}
                                                {user.last_name.charAt(0)}.
                                            </Text>
                                            <Text className="text-gray-600 text-sm">
                                                {isProSent ||
                                                currentUserRole === "client"
                                                    ? "Profesional"
                                                    : "Cliente"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </CardWrapper>
                        );
                    })}
                </View>

                {/* Acciones */}
                {availableActions.length > 0 && (
                    <View className="px-4 py-4 bg-gray-50">
                        <Text className="text-lg font-semibold text-gray-900 mb-4">
                            Acciones
                        </Text>

                        <View className="flex-1 gap-y-3">
                            {availableActions.map((action) => (
                                <Pressable
                                    key={action.id}
                                    onPress={action.onPress}
                                    className={`${action.color} p-4 rounded-lg items-center justify-center disabled:opacity-50`}
                                    disabled={isLoading}
                                >
                                    <Text className="text-white font-semibold text-base">
                                        {isLoading
                                            ? "Cargando..."
                                            : action.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                <View className="h-8" />
            </ScrollView>
        </View>
    );
};

export default RequestDetailModal;
