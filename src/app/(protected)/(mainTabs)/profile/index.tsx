import {
  ProfileActivities,
  ProfileBanner,
  ProfileInfo,
  ProfileMap,
  ProfileReviews,
  useCurrentUser,
} from "@/features/profile";
import SectionDivider from "@/features/profile/components/SectionDivider";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const ProfileScreen = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  // Datos mock para actividades (esto se puede expandir más adelante)
  const mockActivities = [
    {
      id: "1",
      name: "Plomería",
      icon: "build",
      subcategories: ["Filtraciones", "Cañerías", "Instalaciones"],
    },
    {
      id: "2",
      name: "Electricidad",
      icon: "build",
      subcategories: ["Instalaciones", "Reparaciones", "Mantenimiento"],
    },
    {
      id: "3",
      name: "Gas",
      icon: "build",
      subcategories: ["Instalaciones", "Reparaciones", "Mantenimiento"],
    },
  ];

  // Datos mock para reviews (esto se puede expandir más adelante)
  const mockRatingDistribution = {
    5: 12,
    4: 8,
    3: 2,
    2: 1,
    1: 0,
  };

  const mockReviews = [
    {
      id: "1",
      reviewerName: "María González",
      reviewerImage: undefined,
      rating: 5,
      comment:
        "Excelente trabajo, muy profesional y puntual. Resolvió el problema rápidamente y con mucha calidad.",
      date: "15/12/2023",
    },
    {
      id: "2",
      reviewerName: "Carlos Rodríguez",
      reviewerImage: undefined,
      rating: 4,
      comment: "Buen trabajo, llegó a tiempo y el resultado fue satisfactorio.",
      date: "10/12/2023",
    },
    {
      id: "3",
      reviewerName: "Ana Martínez",
      reviewerImage: undefined,
      rating: 5,
      comment: "Muy recomendable, trabajo impecable y precios justos.",
      date: "05/12/2023",
    },
    {
      id: "4",
      reviewerName: "Luis Fernández",
      reviewerImage: undefined,
      rating: 4,
      comment: "Profesional y confiable, lo recomiendo.",
      date: "01/12/2023",
    },
  ];

  const handleRequestQuote = () => {
    console.log("Solicitar cotización");
  };

  const handleViewMoreReviews = () => {
    console.log("Ver más opiniones");
  };

  const handleMapPress = () => {
    console.log("Ver mapa");
  };

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2D7A3E" />
        <Text className="text-gray-600 mt-4">Cargando perfil...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-4">
        <Text className="text-red-500 text-center text-lg mb-2">
          Error al cargar el perfil
        </Text>
        <Text className="text-gray-600 text-center">
          No se pudieron cargar los datos del usuario
        </Text>
      </View>
    );
  }

  // Si no hay usuario
  if (!user) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-4">
        <Text className="text-gray-600 text-center text-lg">
          No se encontró información del usuario
        </Text>
      </View>
    );
  }

  // Preparar datos del usuario para los componentes
  const userData = {
    firstName: user.name,
    lastName: user.last_name,
    profileImage: user.profile_pic || undefined,
    rating: user.calification || 0,
    reviewCount: 0, // Esto se puede obtener de una tabla de reviews más adelante
    role: user.rol as "professional" | "client",
  };

  const profileInfo = {
    description: user.description || "Este usuario no tiene descripción aún.",
    coverageRadius: user.service_radius || 15,
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileBanner user={userData} onRequestQuote={handleRequestQuote} />
        <SectionDivider />
        <ProfileInfo description={profileInfo.description} />
        <SectionDivider />
        {user.rol === "professional" && (
          <>
            <ProfileMap
              coverageRadius={profileInfo.coverageRadius}
              onPress={handleMapPress}
            />
            <SectionDivider />
            <ProfileActivities
              activities={mockActivities}
              userRole={userData.role}
            />
            <SectionDivider />
          </>
        )}

        <ProfileReviews
          userName={`${userData.firstName} ${userData.lastName}`}
          averageRating={userData.rating}
          totalReviews={userData.reviewCount}
          ratingDistribution={mockRatingDistribution}
          reviews={mockReviews}
          onViewMoreReviews={handleViewMoreReviews}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
