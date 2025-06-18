import {
  ProfileActivities,
  ProfileBanner,
  ProfileInfo,
  ProfileMap,
  ProfileReviews,
} from "@/features/profile";
import SectionDivider from "@/features/profile/components/SectionDivider";
import { ScrollView, View } from "react-native";

const ProfileScreen = () => {
  const mockUser = {
    firstName: "Lautaro",
    lastName: "Kaufmann",
    profileImage:
      "https://lh3.googleusercontent.com/a/ACg8ocLBmFkmrG8wGLtAKm7K-DrK7QGEF5qe94XSfgoSraQFSg6P3Z64nw=s288-c-no",
    rating: 4.5,
    reviewCount: 23,
    role: "professional" as const,
  };

  const mockProfileInfo = {
    description:
      "Profesional con más de 10 años de experiencia en plomería y electricidad. Especializado en instalaciones residenciales y comerciales. Trabajo con garantía y materiales de primera calidad.",
    coverageRadius: 15,
  };

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

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileBanner user={mockUser} onRequestQuote={handleRequestQuote} />
        <SectionDivider />
        <ProfileInfo description={mockProfileInfo.description} />
        <SectionDivider />
        <ProfileMap
          coverageRadius={mockProfileInfo.coverageRadius}
          onPress={handleMapPress}
        />
        <SectionDivider />
        <ProfileActivities
          activities={mockActivities}
          userRole={mockUser.role}
        />
        <SectionDivider />
        <ProfileReviews
          userName={`${mockUser.firstName} ${mockUser.lastName}`}
          averageRating={mockUser.rating}
          totalReviews={mockUser.reviewCount}
          ratingDistribution={mockRatingDistribution}
          reviews={mockReviews}
          onViewMoreReviews={handleViewMoreReviews}
        />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
