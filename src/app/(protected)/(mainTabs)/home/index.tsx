import { getAuthMpUrl } from "@/common/utils/mp";
import Categories from "@/features/home/Categories";
import Header from "@/features/home/Header";
import InfoCardSwiper from "@/features/home/InfoCardSwiper";
import LoadingState from "@/features/home/LoadingState";
import RecentSearches from "@/features/home/RecentSearches";
import SearchBarInput from "@/features/home/SearchbarInput";
import SubcategoryCarrousel from "@/features/home/SubcategoryCarrousel";
import { useUserRole } from "@/features/request";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import { Button, Linking, RefreshControl, ScrollView, View } from "react-native";

const HomeScreen = () => {
    const { data: userRole, isLoading: isLoadingRole } = useUserRole();
    const [refreshing, setRefreshing] = useState(false);
    const {userId} = useAuth()

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
                <InfoCardSwiper />
                <SubcategoryCarrousel />
                <View className="h-8" />
                <Button 
                            title="Conectar con Mercado Pago"
                            color="#2D7A3E"
                            onPress={async () => {
                                try {
                                    const url = await getAuthMpUrl(userId as string);
                                    Linking.openURL(url);
                                } catch (error) {
                                    console.error(
                                        "Error al abrir la URL:",
                                        error
                                    );
                                }
                            }}
                        />
            </ScrollView>
        </View>
    );
};

export default HomeScreen;
