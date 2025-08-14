import { getAuthMpUrl } from "@/common/utils/mp";
import Categories from "@/features/home/components/initial-home/Categories";
import Header from "@/features/home/components/initial-home/Header";
import InfoCardSwiper from "@/features/home/components/initial-home/InfoCardSwiper";
import LoadingState from "@/features/home/components/initial-home/LoadingState";
import MpLinkCard from "@/features/home/components/initial-home/MpLinkCard";
import RecentSearches from "@/features/home/components/initial-home/RecentSearches";
import SearchBarInput from "@/features/home/components/initial-home/SearchbarInput";
import StatsLinkCard from "@/features/home/components/initial-home/StatsLinkCard";
import SubcategoryCarrousel from "@/features/home/components/initial-home/SubcategoryCarrousel";
import { useCurrentUser } from "@/features/profile";
import { useUserRole } from "@/features/request";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { Linking, RefreshControl, ScrollView, View } from "react-native";

const HomeScreen = () => {
    const { data: userRole, isLoading: isLoadingRole } = useUserRole();
    const [refreshing, setRefreshing] = useState(false);
    const { userId } = useAuth();
    const { data: user } = useCurrentUser();

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            // Simular recarga de datos
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Aquí podrías recargar datos reales de la API
            console.log("Refrescando datos de la home...");
        } catch (error) {
            console.error("Error al refrescar:", error);
        } finally {
            setRefreshing(false);
        }
    };

    // Mostrar loading mientras se carga el rol del usuario
    if (isLoadingRole || !userRole) {
        return (
            <View className="flex-1 bg-gray-50">
                <Header />
                <LoadingState />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <Header />
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#2D7A3E"]}
                        tintColor="#2D7A3E"
                    />
                }
            >
                <SearchBarInput />
                <RecentSearches />
                <Categories />
                {user?.membership_json?.isPro && <StatsLinkCard />}
                {userRole === "professional" && !user?.mp_access_token && (
                    <MpLinkCard
                        onPress={async () => {
                            try {
                                const url = await getAuthMpUrl(
                                    userId as string
                                );
                                Linking.openURL(url);
                            } catch (error) {
                                console.error("Error al abrir la URL:", error);
                            }
                        }}
                    />
                )}
                <InfoCardSwiper />
                <SubcategoryCarrousel />
                <View className="h-8" />
            </ScrollView>
        </View>
    );
};

export default HomeScreen;
