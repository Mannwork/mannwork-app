import { useState } from "react";
import { View } from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { useNearbyProfessionals } from "@/features/home/hooks/useNearbyProfessionals";
import { useRequest } from "@/features/request/hooks/useRequest";

import { postNewPro } from "@/features/request/services/post-new-pro";

import LoadingState from "@/features/create/components/LoadingState";
import ProfessionalsList from "@/features/create/components/ProfessionalsList";
import SelectProfessionalsHeader from "@/features/create/components/SelectProfessionalsHeader";
import SendRequestButton from "@/features/create/components/SendRequestButton";

const ReselectProfessionalsScreen = () => {
    const { requestId, categoryName, subcategoryName } = useLocalSearchParams();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

    const { data, isLoading } = useRequest(requestId as string);

    const { data: professionals, isLoading: isLoadingProfessionals } =
        useNearbyProfessionals({
            location: data?.location || {
                latitude: 0,
                longitude: 0,
                address: "",
            },
            categoryId: data?.category || 0,
            subcategoryId: data?.subcategory || "",
            maxDistance: 50, // 50km máximo
            enabled: !!data,
        });

    const transformedProfessionals =
        (professionals as any[])?.map((prof) => ({
            id: prof.id,
            name: `${prof.name} ${prof.last_name}`,
            lastInitial: prof.last_name.charAt(0),
            rating: prof.calification,
            reviews: 0, // TODO: Implementar reviews
            category: `${categoryName} • ${subcategoryName}`,
            address: prof.ubication_json.address || "Ubicación no disponible",
            verified: true, // TODO: Implementar verificación
            membership_json: prof.membership_json, // TODO: Implementar premium
            avatar: prof.profile_pic,
            distance: prof.distance,
        })) || [];

    const handleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        } else if (selectedIds.length < 4) {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSend = async () => {
        if (selectedIds.length === 0 || isLoading) return;

        try {
            setIsLoadingUpdate(true);

            await postNewPro(requestId as string, selectedIds);

            router.replace(`/(protected)/(mainTabs)/requests/${requestId}`);
        } catch (error: any) {
            console.error(`Error ${error?.message}`);
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <SelectProfessionalsHeader
                onBack={() => {
                    router.back();
                }}
                onMapPress={() => {}}
                isMapDisabled={true}
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
                        categoryName={(categoryName as string) || undefined}
                        subcategoryName={
                            (subcategoryName as string) || undefined
                        }
                    />
                </>
            )}

            {/* Botón de enviar */}
            <SendRequestButton
                selectedCount={selectedIds.length}
                loading={isLoadingUpdate}
                error={undefined}
                onPress={handleSend}
            />
        </View>
    );
};

export default ReselectProfessionalsScreen;
