import { supabase } from "@/common/lib/supabase/supabaseClient";
import {
  ProfileActivities,
  ProfileBanner,
  ProfileInfo,
  ProfileMap,
  ProfileReviews,
} from "@/features/profile";
import SectionDivider from "@/features/profile/components/initial-profile/SectionDivider";
import { useUserReviews } from "@/features/profile/hooks/useUserReviews";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const UserProfileScreen = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Traer reviews reales del usuario visitado
  const { reviews, loading: loadingReviews } = useUserReviews(userId as string);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        setError("No se pudo cargar el usuario");
        setUser(null);
      } else {
        setUser(data);
      }
      setIsLoading(false);
    };
    if (userId) fetchUser();
  }, [userId]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.calification || 0), 0) /
        reviews.length
      : 0;

  const ratingDistribution = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] = reviews.filter(
      (r) => Math.round(r.calification) === star
    ).length;
    return acc;
  }, {} as { [key: number]: number });

  const mappedReviews = reviews.map((r) => ({
    id: r.id,
    reviewerName: r.reviewer_name || "Usuario",
    reviewerImage: r.reviewer_image,
    rating: r.calification,
    comment: r.commentary,
    reviewerMembershipJson: r.reviewer_membership_json,
    date: r.created_at,
  }));

  // Loading state
  if (isLoading || loadingReviews) {
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
    rating: averageRating,
    reviewCount: reviews.length,
    role: user.rol as "professional" | "client",
  };

  const profileInfo = {
    description: user.description || "Este usuario no tiene descripción aún.",
    coverageRadius: user.service_radius || 15,
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileBanner
          user={userData}

          isOwnProfile={false}
        />
        <SectionDivider />
        <ProfileInfo description={profileInfo.description} />
        <SectionDivider />
        {user.rol === "professional" &&
          user.ubication_json?.latitude != null &&
          user.ubication_json?.longitude != null && (
            <>
              <ProfileMap
                coverageRadius={profileInfo.coverageRadius}
                latitude={user.ubication_json.latitude}
                longitude={user.ubication_json.longitude}
              />
              <SectionDivider />
              <ProfileActivities
                professions={user.professions || []}
                userRole={userData.role}
              />
              <SectionDivider />
            </>
          )}

        <ProfileReviews
          userName={
            userData.lastName
              ? `${userData.firstName} ${userData.lastName.charAt(0)}.`
              : userData.firstName
          }
          averageRating={averageRating}
          totalReviews={reviews.length}
          ratingDistribution={ratingDistribution}
          reviews={mappedReviews}
          onViewMoreReviews={() => {}}
        />
      </ScrollView>
    </View>
  );
};

export default UserProfileScreen;
