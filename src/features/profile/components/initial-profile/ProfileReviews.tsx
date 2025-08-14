import { Review } from "@/features/reviews/interfaces/review.interface";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, TouchableOpacity, View } from "react-native";

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function formatDateEs(dateStr: string) {
  let day, month, year;
  if (dateStr.includes("/")) {
    [day, month, year] = dateStr.split("/");
  } else if (dateStr.includes("-")) {
    [year, month, day] = dateStr.split("-");
  }
  if (!day || !month || !year) return dateStr;
  const monthName = MONTHS_ES[parseInt(month, 10) - 1];
  return `${parseInt(day, 10)} de ${monthName} del ${year}`;
}

interface ProfileReviewsProps {
  userName: string;
  reviews: Review[];
  totalReviews: number;
  onViewMoreReviews?: () => void;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

const ProfileReviews = ({
  userName,
  totalReviews,
  reviews,
  onViewMoreReviews,
  averageRating,
  ratingDistribution,
  isLoadingMore = false,
  hasMore = false,
}: ProfileReviewsProps) => {
  // Estado para manejar si se muestran todas las reseñas o solo 3
  const [showAll, setShowAll] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar las reseñas mostradas cuando cambian las reseñas o showAll
  useEffect(() => {
    if (showAll) {
      setDisplayedReviews(reviews);
    } else {
      setDisplayedReviews(reviews.slice(0, 3));
    }
  }, [reviews, showAll]);

  // Cargar más reseñas cuando se muestran todas
  useEffect(() => {
    if (showAll && hasMore && !isLoadingMore) {
      onViewMoreReviews?.();
    }
  }, [showAll, hasMore, isLoadingMore, onViewMoreReviews]);

  // Manejar la carga de todas las reseñas
  const handleLoadAll = async () => {
    if (onViewMoreReviews) {
      setIsLoading(true);
      try {
        await onViewMoreReviews();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStars = (rating: number, size: number = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? "star" : "star-border"}
          size={size}
          color={i <= rating ? "#2D7A3E" : "#ccc"}
        />
      );
    }
    return stars;
  };

  const handleProfilePicPress = (userId: string) => {
    router.push({
      pathname: "/(protected)/users/[userId]",
      params: { userId },
    });
  };

  const getMaxCount = () => {
    return Math.max(...Object.values(ratingDistribution));
  };

  return (
    <View className="bg-white px-4 py-4">
      <View className="flex-row items-center justify-between mb-10">
        <Text className="text-xl font-bold text-green-mannwork">
          Opiniones de {userName}
        </Text>
      </View>

      <View className="mb-10">
        <View className="flex-col items-center mb-10">
          <Text className="text-5xl font-bold text-green-mannwork mb-2">
            {averageRating.toFixed(1)}/5
          </Text>
          <View className="flex-row items-center">
            {renderStars(averageRating, 24)}
          </View>
        </View>
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = ratingDistribution[stars] || 0;
          const maxCount = getMaxCount();
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <View key={stars} className="flex-row items-center mb-2">
              <MaterialIcons name="star" size={18} color="#2D7A3E" />
              <Text className="text-xs text-gray-800 ml-1 w-3 text-center">
                {stars}
              </Text>
              <View className="flex-1 mx-2">
                <View className="bg-gray-200 rounded-full h-2 w-full">
                  <View
                    className="h-2 rounded-full"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: "#2D7A3E",
                    }}
                  />
                </View>
              </View>
              <Text className="text-xs text-gray-800 ml-2 whitespace-nowrap">
                {count} Opiniones
              </Text>
            </View>
          );
        })}
      </View>

      <View className="space-y-6">
        {displayedReviews.map((review) => {
          const [firstName, ...lastNameParts] = review.reviewerName.split(" ");
          const lastInitial = lastNameParts.length > 0 ? lastNameParts[0][0] + "." : "";
          const displayName = `${firstName} ${lastInitial}`;
          
          return (
            <View key={review.id} className="pb-5">
              <View className="flex-row items-start">
                <Pressable
                  onPress={() => handleProfilePicPress(review.reviewerId)}
                  className="w-14 h-14 bg-gray-200 rounded-full mr-4 items-center justify-center"
                >
                  {review.reviewerImage ? (
                    <Image
                      source={{ uri: review.reviewerImage }}
                      className="w-14 h-14 rounded-full"
                    />
                  ) : (
                    <MaterialIcons name="person" size={32} color="#666" />
                  )}
                </Pressable>

                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-base font-semibold text-gray-800 mr-2">
                      {displayName}
                    </Text>
                    {review.reviewerMembershipJson?.isPro && (
                      <FontAwesome name="diamond" size={18} color="#2D7A3E" />
                    )}
                  </View>
                  <Text className="text-xs text-gray-500 mb-2 mt-0.5">
                    {formatDateEs(review.date)}
                  </Text>

                  <View className="flex-row items-center mb-3 mt-1">
                    {renderStars(review.rating, 20)}
                  </View>

                  {review.comment && (
                    <Text className="text-base text-gray-600 leading-5 mt-1">
                      {review.comment}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
        {isLoadingMore && (
          <View className="py-4">
            <ActivityIndicator size="small" color="#3B82F6" />
          </View>
        )}

        {!showAll && totalReviews > 3 && (
          <TouchableOpacity
            onPress={() => setShowAll(true)}
            className="mt-4 py-3 px-4 bg-green-mannwork-light rounded-lg border border-green-mannwork items-center"
            disabled={isLoadingMore}
          >
            <Text className="text-green-mannwork font-semibold">
              Ver las {totalReviews - 3} reseñas restantes
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ProfileReviews;
