import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

// Componente Skeleton para elementos
const SkeletonItem = ({
  width,
  height,
  borderRadius = 8,
}: {
  width: number;
  height: number;
  borderRadius?: number;
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#E5E7EB",
        opacity,
      }}
    />
  );
};

const LoadingState = () => {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar Skeleton */}
      <View className="px-4 py-3">
        <SkeletonItem width={400} height={48} borderRadius={12} />
      </View>

      {/* Recent Searches Skeleton */}
      <View className="px-4 mb-4">
        <View className="flex-col mt-2 gap-y-2">
          <SkeletonItem width={400} height={48} borderRadius={16} />
          <SkeletonItem width={400} height={48} borderRadius={16} />
        </View>
      </View>

      {/* Categories Skeleton */}
      <View className="px-4 mb-6">
        <View className="flex-row mt-3 gap-x-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} className="items-center">
              <SkeletonItem width={60} height={60} borderRadius={30} />
              <SkeletonItem width={50} height={12} />
            </View>
          ))}
        </View>
      </View>

      {/* Stats Card Skeleton */}
      <View className="px-4 mb-4">
        <SkeletonItem width={400} height={100} borderRadius={12} />
      </View>

      {/* Subcategories Skeleton - Usando el mismo que SubcategoryCarrousel.tsx */}
      <View className="mt-4">
        {[1, 2, 3, 4].map((categoryIndex) => (
          <View key={categoryIndex} className="mb-6">
            <View className="flex-row ">
              {[...Array(3)].map((_, i) => (
                <View
                  key={i}
                  className="flex-row items-center bg-gray-200/60 rounded-2xl px-6 mr-4  h-20"
                >
                  <View
                    className="bg-white rounded-full p-2 mr-3"
                    style={{ width: 36, height: 36 }}
                  />
                  <View className="bg-gray-300 rounded w-24 h-4" />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LoadingState;
