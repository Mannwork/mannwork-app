import Categories from "@/features/home/Categories";
import Header from "@/features/home/Header";
import InfoCardSwiper from "@/features/home/InfoCardSwiper";
import LoadingState from "@/features/home/LoadingState";
import RecentSearches from "@/features/home/RecentSearches";
import SearchBarInput from "@/features/home/SearchbarInput";
import SubcategoryCarrousel from "@/features/home/SubcategoryCarrousel";
import { useUserRole } from "@/features/request";
import { useState } from "react";
import { Button, RefreshControl, ScrollView, View } from "react-native";

const HomeScreen = () => {
    const { data: userRole, isLoading: isLoadingRole } = useUserRole();
    const [refreshing, setRefreshing] = useState(false);

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
                {userRole === "professional" && (
                    <View style={{ padding: 16 }}>
                        <Button
                            title="Conectar con Mercado Pago"
                            color="#2D7A3E"
                            onPress={async () => {
                                // URL de conexión OAuth de Mercado Pago
                                const clientId =
                                    process.env.NEXT_PUBLIC_MP_CLIENT_ID;
                                const redirectUri =
                                    encodeURIComponent("TU_REDIRECT_URL"); // Cambia por tu URL
                                const oauthUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&redirect_uri=${redirectUri}`;
                                // Abre la URL en el navegador
                                import("expo-linking").then((Linking) => {
                                    Linking.openURL(oauthUrl);
                                });
                            }}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default HomeScreen;
