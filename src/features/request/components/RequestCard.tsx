import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { categoryIcons } from "@/common/types/categories.interface";
import { useHasUserReviewed } from "@/features/reviews/hooks/useHasUserReviewed";
import { useAuth } from "@clerk/clerk-react";
import { useRouter } from "expo-router";
import {
    RequestItem,
    RequestItemClient,
    RequestItemProfessional,
} from "../interfaces/request.interface";
import RequestImages from "./RequestImages";
import RequestLocation from "./RequestLocation";
import RequestStatusBadge from "./RequestStatusBadge";

interface RequestCardProps {
    request: RequestItem;
    onPress?: (request: RequestItem) => void;
}

const RequestCard = ({ request, onPress }: RequestCardProps) => {
    const { userId } = useAuth();
    const router = useRouter();
    const { hasReviewed, loading: loadingReview } = useHasUserReviewed(
        request.id,
        userId || ""
    );

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getUsersDisplay = () => {
        if (request.client.id === userId) {
            // Cliente ve los profesionales
            const professionals = request.professionals;

            if (professionals.length === 1) {
                const prof = professionals[0];
                return `${prof.name} ${prof.last_name.charAt(0)}.`;
            } else {
                const firstProf = professionals[0];
                return `${firstProf.name} ${firstProf.last_name.charAt(0)}. y ${
                    professionals.length - 1
                } más`;
            }
        } else {
            // Profesional ve el cliente
            const { client } = request;
            if (!client) return null;
            return `${client.name} ${client.last_name.charAt(0)}.`;
        }
    };

    const usersDisplay = getUsersDisplay();

    // Obtener el icono de la categoría
    const getCategoryIcon = (categoryName: string) => {
        return categoryIcons[categoryName] || "category";
    };

    return (
        <View className="pb-4 mb-3">
            <Pressable
                onPress={() => onPress?.(request)}
                className="bg-white rounded-t-lg p-4 shadow-sm border border-gray-100"
            >
                <View className="flex-row items-start justify-between mb-2">
                    <Text className="text-lg font-semibold text-gray-900 flex-1 mr-2">
                        {request.title}
                    </Text>
                    <RequestStatusBadge status={request.status} />
                </View>

                <Text className="text-gray-600 text-sm mb-3" numberOfLines={3}>
                    {request.description}
                </Text>

                <View className="flex-row items-center mb-2">
                    <MaterialIcons
                        name={getCategoryIcon(request.category) as any}
                        size={16}
                        color="#6B7280"
                    />
                    <Text className="text-sm text-gray-600 ml-1">
                        {request.category} • {request.subcategory}
                    </Text>
                </View>

                {usersDisplay && (
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons
                            name={
                                request.client.id === userId
                                    ? "business"
                                    : "person"
                            }
                            size={16}
                            color="#6B7280"
                        />
                        <Text className="text-sm text-gray-600 ml-1">
                            {request.client.id === userId
                                ? "Profesional: "
                                : "Cliente: "}
                            {usersDisplay}
                        </Text>
                    </View>
                )}

                <RequestLocation location={request.location} />

                <RequestImages images={request.images} />

                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <View className="flex-row items-center">
                        <MaterialIcons
                            name="schedule"
                            size={16}
                            color="#6B7280"
                        />
                        <Text className="text-sm text-gray-500 ml-1">
                            Creada el {formatDate(request.createdAt)}
                        </Text>
                    </View>

                    <Pressable className="flex-row items-center">
                        <Text className="text-sm text-green-mannwork font-medium mr-1">
                            Ver detalles
                        </Text>
                        <MaterialIcons
                            name="chevron-right"
                            size={16}
                            color="#2D7A3E"
                        />
                    </Pressable>
                </View>
            </Pressable>
            {/* Sección de calificación */}
            {request.status === "completed" &&
                (!loadingReview && !hasReviewed ? (
                    <View className="mt-0">
                        <Pressable
                            className="bg-amber-400 py-3 rounded-b-2xl items-center justify-center flex-row shadow-lg shadow-amber-300/50"
                            onPress={() => {
                                const isProfessional =
                                    request.professionals[0].id === userId;
                                const userToReview = isProfessional
                                    ? request.client
                                    : request.professionals[0];

                                if (!userToReview) return;

                                router.push({
                                    pathname: "/requests/review-modal",
                                    params: {
                                        requestId: request.id,
                                        id: userToReview.id,
                                        name: userToReview.name,
                                        lastName: isProfessional
                                            ? (
                                                  userToReview as RequestItemProfessional
                                              ).last_name
                                            : (
                                                  userToReview as RequestItemClient
                                              ).last_name,
                                        avatar: isProfessional
                                            ? (
                                                  userToReview as RequestItemProfessional
                                              ).profile_pic
                                            : (
                                                  userToReview as RequestItemClient
                                              ).profile_pic ||
                                              "https://randomuser.me/api/portraits/men/32.jpg",
                                        category: request.category,
                                        subcategory: request.subcategory,
                                    },
                                });
                            }}
                        >
                            <MaterialIcons
                                name="star"
                                size={20}
                                color="#FFFFFF"
                            />
                            <Text className="text-white font-bold text-base ml-2">
                                Calificar
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <View className="mt-0">
                        <Pressable className="bg-green-mannwork py-3 rounded-b-2xl items-center justify-center flex-row shadow-lg shadow-amber-300/50">
                            <MaterialIcons
                                name="star"
                                size={20}
                                color="#FFFFFF"
                            />
                            <Text className="text-white font-bold text-base ml-2">
                                Calificado
                            </Text>
                        </Pressable>
                    </View>
                ))}
        </View>
    );
};

export default RequestCard;
