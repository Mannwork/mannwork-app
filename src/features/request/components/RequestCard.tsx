import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { categoryIcons } from "@/common/types/categories.interface";
import { RequestItem } from "../interfaces/request.interface";
import RequestImages from "./RequestImages";
import RequestLocation from "./RequestLocation";
import RequestStatusBadge from "./RequestStatusBadge";

interface RequestCardProps {
    request: RequestItem;
    onPress?: (request: RequestItem) => void;
    currentUserRole: "client" | "professional";
}

const RequestCard = ({
    request,
    onPress,
    currentUserRole,
}: RequestCardProps) => {
    const formatDate = (dateString: Date) => {

        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getUsersDisplay = () => {
        if (currentUserRole === "client") {
            // Cliente ve los profesionales
            const professionals = request.professionals

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
        <Pressable
            onPress={() => onPress?.(request)}
            className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
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
                            currentUserRole === "client" ? "person" : "business"
                        }
                        size={16}
                        color="#6B7280"
                    />
                    <Text className="text-sm text-gray-600 ml-1">
                        {currentUserRole === "client"
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
                    <MaterialIcons name="schedule" size={16} color="#6B7280" />
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
    );
};

export default RequestCard;
