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
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

const UserProfileScreen = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    allReviews,          // Todas las reseñas (para estadísticas)
    paginatedReviews,    // Reseñas paginadas (para la lista)
    loading: loadingReviews, 
    loadingMore, 
    hasMore, 
    totalReviews,
    loadMoreReviews,
    refreshReviews
  } = useUserReviews(userId as string);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Trae los datos básicos del usuario
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (userError) {
          throw userError;
        }

        // Trae las profesiones del usuario
        const { data: professionsData, error: professionsError } = await supabase
          .from("user_professional_services")
          .select("category_id, subcategory_id")
          .eq("user_id", userId);

        if (professionsError) {
          throw professionsError;
        }

        // Combina los datos del usuario con sus profesiones
        const userWithProfessions = {
          ...user,
          professions: professionsData || [],
        };

        setUser(userWithProfessions as any);
      } catch (error) {
        setError("No se pudo cargar el perfil del usuario");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

 // Calcular estadísticas con todas las reseñas
 const { averageRating, ratingDistribution } = useMemo(() => {
  const avg = allReviews.length > 0
    ? allReviews.reduce((sum: number, r: any) => sum + (r.calification || 0), 0) / allReviews.length
    : 0;

  const dist = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] = allReviews.filter((r: any) => Math.round(r.calification) === star).length;
    return acc;
  }, {} as { [key: number]: number });

  return { averageRating: avg, ratingDistribution: dist };
}, [allReviews]);


  const mappedReviews = useMemo(() => paginatedReviews.map((r) => {
    // Si es una respuesta de Supabase con la estructura reviewer
    if ('reviewer' in r && r.reviewer) {
      return {
        id: r.id,
        reviewerId: r.reviewer_id,
        reviewerName: `${r.reviewer.name} ${r.reviewer.last_name || ''}`.trim() || "Usuario",
        reviewerImage: r.reviewer.profile_pic,
        rating: r.calification,
        comment: r.commentary,
        date: r.created_at,
        reviewerMembershipJson: r.reviewer.membership_json,
      };
    }
    
    // Si es un objeto plano con las propiedades directamente
    return {
      id: r.id,
      reviewerId: r.reviewer_id,
      reviewerName: r.reviewer_name || "Usuario",
      reviewerImage: r.reviewer_image,
      rating: r.calification,
      comment: r.commentary,
      date: r.created_at,
      reviewerMembershipJson: r.reviewer_membership_json,
    };
  }), [paginatedReviews]);


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
    reviewCount: allReviews.length,
    role: user.rol as "professional" | "client",
    membership_json: user.membership_json || undefined,
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
          totalReviews={totalReviews}
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
            userData?.lastName
              ? `${userData?.firstName || ''} ${userData.lastName.charAt(0)}.`
              : userData?.firstName || 'Usuario'
          }
          averageRating={averageRating}
          totalReviews={totalReviews}
          ratingDistribution={ratingDistribution}
          reviews={mappedReviews}
          onViewMoreReviews={hasMore ? loadMoreReviews : undefined}
          hasMore={hasMore}
          isLoadingMore={loadingMore}
        />
      </ScrollView>
    </View>
  );
};


export default UserProfileScreen;

