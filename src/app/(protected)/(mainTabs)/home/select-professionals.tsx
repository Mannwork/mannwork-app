import useSupabaseStorage from "@/common/hooks/useSupabaseStorage";
import LoadingState from "@/features/create/components/LoadingState";
import ProfessionalsList from "@/features/create/components/ProfessionalsList";
import SelectProfessionalsHeader from "@/features/create/components/SelectProfessionalsHeader";
import SendRequestButton from "@/features/create/components/SendRequestButton";
import { useCreateRequest } from "@/features/create/hooks/useCreateRequest";
import { useNearbyProfessionals } from "@/features/home/hooks/useNearbyProfessionals";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function SelectProfessionalsScreen() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const router = useRouter();
    const params = useLocalSearchParams();
    const { userId } = useAuth();
    const { createRequest, loading, error } = useCreateRequest();
    const [isLoading, setIsLoading] = useState(false);

    const { handleUploadImages } = useSupabaseStorage("request-images");

    // Leer datos del formulario
    const formData = {
        title: params.title as string,
        description: params.description as string,
        category: params.categoryId
            ? Number(params.categoryId)
            : params.category
            ? Number(params.category)
            : undefined,
        subcategory:
            (params.subcategoryId as string) ||
            (params.subcategory as string) ||
            "",
        categoryName: params.categoryName as string,
        subcategoryName: params.subcategoryName as string,
        locationData: params.locationData
            ? JSON.parse(params.locationData as string)
            : null,
        images: params.images ? JSON.parse(params.images as string) : [],
    };

    // Obtener profesionales cercanos usando el hook
    const { data: professionals, isLoading: isLoadingProfessionals } =
        useNearbyProfessionals({
            location: formData.locationData,
            categoryId: formData.category || 0,
            subcategoryId: formData.subcategory || "",
            maxDistance: 50, // 50km máximo
            enabled: formData,
        });

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        } else if (selectedIds.length < 4) {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSend = async () => {
        if (selectedIds.length === 0 || loading) return;
        if (!userId || !formData.category) return;

        try {
            setIsLoading(true);
            const images = await handleUploadImages(userId, formData.images);

            const success = await createRequest({
                name: formData.title,
                description: formData.description,
                location: formData.locationData,
                photos: images as string[],
                client: userId,
                category: formData.category,
                subCategory: formData.subcategory,
                professionals: selectedIds,
                status: "searching",
            });

            if (success) {
                router.push("/(protected)/(mainTabs)/home/request-sent");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Transformar datos para el componente SelectProfessionalCard
    const transformedProfessionals =
        (professionals as any[])?.map((prof) => ({
            id: prof.id,
            name: `${prof.name} ${prof.last_name}`,
            lastInitial: prof.last_name.charAt(0),
            rating: prof.calification,
            reviews: 0, // TODO: Implementar reviews
            category: `${params.categoryName} • ${params.subcategoryName}`,
            address: prof.ubication_json.address || "Ubicación no disponible",
            verified: true, // TODO: Implementar verificación
            membership_json: prof.membership_json, // TODO: Implementar premium
            avatar: prof.profile_pic,
            distance: prof.distance,
        })) || [];

    // Función para navegar al mapa
    const handleMapPress = () => {
        if (professionals && professionals.length > 0) {
            router.push({
                pathname: "/(protected)/(mainTabs)/home/professionals-map",
                params: {
                    professionals: JSON.stringify(professionals),
                    clientLocation: JSON.stringify(formData.locationData),
                    selectedProfessionals: JSON.stringify(selectedIds),
                },
            });
        }
    };

    // Función para volver al modal de creación
    const handleBack = () => {
        const navigationParams = {
            category: params.category as string,
            subcategory: params.subcategory as string,
            categoryId: params.categoryId as string,
            subcategoryId: params.subcategoryId as string,
            icon: params.icon as string,
            title: params.title as string,
            description: params.description as string,
            locationData: params.locationData as string,
            images: params.images as string,
        };

        router.push({
            pathname: "/(protected)/(mainTabs)/home/create",
            params: navigationParams,
        });
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <SelectProfessionalsHeader
                onBack={handleBack}
                onMapPress={handleMapPress}
                isMapDisabled={
                    isLoadingProfessionals ||
                    !professionals ||
                    professionals.length === 0
                }
            />

            {/* Loading state */}
            {isLoadingProfessionals ? (
                <LoadingState />
            ) : (
                <>
                    {/* Lista de profesionales */}
                    <ProfessionalsList
                        professionals={transformedProfessionals}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        categoryName={
                            (params.categoryName as string) || undefined
                        }
                        subcategoryName={
                            (params.subcategoryName as string) || undefined
                        }
                    />
                </>
            )}

            {/* Botón de enviar */}
            <SendRequestButton
                selectedCount={selectedIds.length}
                loading={isLoading}
                error={error || undefined}
                onPress={handleSend}
            />
        </View>
    );
}
