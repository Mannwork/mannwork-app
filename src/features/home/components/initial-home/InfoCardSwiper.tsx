import { useCurrentUser } from "@/features/profile";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import InfoCard from "./InfoCard";

const infoCards = [
  {
    id: "perfil",
    title: "¡Completa tu perfil!",
    description:
      "Completa tu perfil para acceder a más funciones y oportunidades. Así otros usuarios podrán confiar más en ti y tendrás acceso a más servicios.",
    type: "perfil",
  },
  {
    id: "membresia",
    title: "¡Activa tu membresía!",
    description:
      "Obtén beneficios exclusivos activando tu membresía y disfruta de todos los beneficios de la app.",
    type: "membresia",
  },
];

// Componente skeleton para mostrar mientras se carga
const InfoCardSkeleton = () => (
  <View className="mx-4 mb-4">
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Skeleton para el título */}
      <View className="h-6 bg-gray-200 rounded-lg mb-3 w-3/4" />

      {/* Skeleton para la descripción */}
      <View className="space-y-2 mb-4">
        <View className="h-4 bg-gray-200 rounded w-full" />
        <View className="h-4 bg-gray-200 rounded w-5/6" />
        <View className="h-4 bg-gray-200 rounded w-4/5" />
      </View>

      {/* Skeleton para los botones */}
      <View className="flex-row justify-between items-center">
        <View className="h-8 w-8 bg-gray-200 rounded-full" />
        <View className="h-10 bg-gray-200 rounded-lg w-24" />
      </View>
    </View>
  </View>
);

const InfoCardSwiper = () => {
  const { data: user, isLoading: isLoadingUser } = useCurrentUser();
  const [visibleCards, setVisibleCards] = useState(infoCards);
  const router = useRouter();

  // Filtrar cards cuando cambie el usuario
  useEffect(() => {
    let filteredCards = [...infoCards];

    // Si el usuario es PRO, es cliente, O la plataforma es iOS, filtra la card de membresía
    if (
      user?.membership_json?.isPro ||
      user?.rol === "client" ||
      Platform.OS === "ios"
    ) {
      filteredCards = filteredCards.filter((card) => card.type !== "membresia");
    }

    // Si la URL de la foto de perfil NO contiene 'https://img.clerk.com', filtra la card de perfil
    if (
      user?.profile_pic &&
      !user.profile_pic.includes("https://img.clerk.com")
    ) {
      filteredCards = filteredCards.filter((card) => card.type !== "perfil");
    }

    setVisibleCards(filteredCards);
  }, [user]);

  const dismissCard = () => {
    setVisibleCards((cards) => cards.slice(1));
  };

  const handleCardPress = () => {
    if (visibleCards[0].type === "membresia") {
      router.push("/(protected)/(mainTabs)/home/membership");
    } else {
      dismissCard();
    }
  };

  // No mostrar nada si no hay cards visibles después del filtrado
  if (!isLoadingUser && !visibleCards[0]) return null;

  return (
    <View>
      {isLoadingUser ? (
        <InfoCardSkeleton />
      ) : (
        <InfoCard
          title={visibleCards[0].title}
          description={visibleCards[0].description}
          onClose={dismissCard}
          onPress={handleCardPress}
        />
      )}
    </View>
  );
};

export default InfoCardSwiper;
