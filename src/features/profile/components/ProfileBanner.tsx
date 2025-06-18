import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ProfileBannerProps {
  user: {
    firstName: string;
    lastName: string;
    profileImage?: string;
    rating: number;
    reviewCount: number;
    role: "professional" | "client";
  };
  onRequestQuote?: () => void;
}

const ProfileBanner = ({ user, onRequestQuote }: ProfileBannerProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? "star" : "star-border"}
          size={24}
          color={i <= rating ? "#FFFFFF" : "#FFFFFF"}
        />
      );
    }
    return stars;
  };
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-green-mannwork px-4 py-8"
      style={{ paddingTop: insets.top + 20 }}
    >
      <View className="flex-col justify-center items-center">
        <View className="w-36 h-36 bg-white rounded-full items-center justify-center mb-4 overflow-hidden border-2 border-white">
          {user.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <MaterialIcons name="person" size={40} color="#2D7A3E" />
          )}
        </View>

        <View className="items-center">
          <Text className="text-white text-xl font-bold mb-2 text-center">
            {user.firstName} {user.lastName}
          </Text>

          <View className="flex-row items-center mb-4">
            {renderStars(user.rating)}
            <Text className="text-white text-sm ml-2">
              ({user.reviewCount} valoraciones)
            </Text>
          </View>

          {user.role === "professional" && onRequestQuote && (
            <Pressable
              onPress={onRequestQuote}
              className="bg-white rounded-lg px-6 py-3"
            >
              <Text className="text-green-mannwork font-bold">
                Pedir cotización
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileBanner;
