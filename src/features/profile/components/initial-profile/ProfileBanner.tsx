import OptionsMenu from "@/common/components/OptionsMenu";
import ReportModal from "@/common/components/ReportModal";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ProfileBannerProps {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        profileImage?: string;
        rating: number;
        reviewCount: number;
        role: "professional" | "client";
        membership_json?: {
            isPro: boolean;
            endDate: Date | null;
            startingDate: Date | null;
        };
    };
    totalReviews?: number;
    isOwnProfile?: boolean;
}

const ProfileBanner = ({
    user,
    totalReviews,
    isOwnProfile = false,
}: ProfileBannerProps) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { userId } = useAuth();
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isReportModalVisible, setReportModalVisible] = useState(false);
    const params = useLocalSearchParams();
    const reportedUserId = params.userId as string;

    const handleReportSubmit = useCallback(
        async (reason: string, details: string) => {
            if (!userId) {
                console.error(
                    "Error",
                    "Debes estar autenticado para reportar un perfil."
                );
                return;
            }

            try {
                const response = await fetch(
                    "https://iuufdqgudfrkisywsnuc.supabase.co/functions/v1/create-report", // Reemplaza con tu URL si es diferente
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-user-id": userId,
                        },
                        body: JSON.stringify({
                            reportedUserId: reportedUserId, // El ID del perfil que se está viendo
                            reason: reason,
                            details: details.trim() || null,
                            reportedContentId: reportedUserId, // Para un perfil, el contenido es el perfil mismo
                            reportedContentType: "user_profile", // Tipo de contenido para perfiles
                        }),
                    }
                );

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(
                        result.error || "Error al enviar el reporte."
                    );
                }
                alert("Reporte Enviado");
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Algo salió mal.";
                console.error("Error", errorMessage);
            }
        },
        [userId, user]
    );

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <MaterialIcons
                    key={i}
                    name={i <= rating ? "star" : "star-border"}
                    size={24}
                    color={i <= rating ? "#FFFFFF" : "#FFFFFF"}
                />
            );
        }
        return stars;
    };

    const handleSettingsPress = () => {
        router.push("/(protected)/(mainTabs)/profile/settings-modal");
    };

    const menuActions = [
        {
            title: "Reportar Perfil",
            icon: "alert-circle-outline" as const,
            isDestructive: true,
            onPress: () => {
                setMenuVisible(false);
                setReportModalVisible(true);
            },
        },
    ];

    return (
        <>
            <View
                className="bg-green-mannwork px-4 py-8"
                style={{ paddingTop: insets.top + 20 }}
            >
                {!isOwnProfile && (
                    <View
                        className="absolute top-0 left-4"
                        style={{ top: insets.top + 20 }}
                    >
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        >
                            <MaterialIcons
                                name="arrow-back"
                                size={24}
                                color="#FFFFFF"
                            />
                        </Pressable>
                    </View>
                )}
                {isOwnProfile ? (
                    <View
                        className="absolute top-0 right-4"
                        style={{ top: insets.top + 20 }}
                    >
                        <Pressable
                            onPress={handleSettingsPress}
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        >
                            <MaterialIcons
                                name="settings"
                                size={24}
                                color="#FFFFFF"
                            />
                        </Pressable>
                    </View>
                ) : (
                    <View
                        className="absolute top-0 right-4"
                        style={{ top: insets.top + 20 }}
                    >
                        <Pressable
                            onPress={() => setMenuVisible(true)}
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        >
                            <MaterialIcons
                                name="more-vert"
                                size={24}
                                color="#FFFFFF"
                            />
                        </Pressable>
                    </View>
                )}

                <View className="flex-col justify-center items-center">
                    <View className="w-36 h-36 bg-white rounded-full items-center justify-center mb-4 overflow-hidden border-2 border-white">
                        {user.profileImage ? (
                            <Image
                                source={{ uri: user.profileImage }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <MaterialIcons
                                name="person"
                                size={40}
                                color="#2D7A3E"
                            />
                        )}
                    </View>

                    <View className="items-center">
                        <Text className="text-white text-xl font-bold mb-2 text-center">
                            {user.firstName}{" "}
                            {isOwnProfile
                                ? user.lastName
                                : user.lastName.charAt(0) + "."}
                        </Text>

                        <View className="flex-row items-center mb-4">
                            {renderStars(user.rating)}
                            <Text className="text-white text-sm ml-2">
                                ({totalReviews} valoraciones)
                            </Text>
                        </View>
                        {user.membership_json?.isPro &&
                            user.role === "professional" && (
                                <View className="flex-row items-center bg-white rounded-full px-2 py-1">
                                    <FontAwesome
                                        name="diamond"
                                        size={18}
                                        color="#2D7A3E"
                                    />
                                    <Text className="ml-1 text-xs text-green-mannwork font-semibold">
                                        Premium
                                    </Text>
                                </View>
                            )}
                    </View>
                </View>
            </View>
            {!isOwnProfile && (
                <>
                    <OptionsMenu
                        isVisible={isMenuVisible}
                        onClose={() => setMenuVisible(false)}
                        actions={menuActions}
                        title="Opciones del Perfil"
                    />
                    <ReportModal
                        isVisible={isReportModalVisible}
                        onClose={() => setReportModalVisible(false)}
                        onSubmit={handleReportSubmit}
                    />
                </>
            )}
        </>
    );
};

export default ProfileBanner;
