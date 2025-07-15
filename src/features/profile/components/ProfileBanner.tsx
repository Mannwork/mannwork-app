import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  isOwnProfile?: boolean;
}

const ProfileBanner = ({
  user,
  onRequestQuote,
  isOwnProfile = false,
}: ProfileBannerProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

  const handleSettingsPress = () => {
    router.push("/(protected)/(mainTabs)/profile/settings-modal");
  };

  return (
    <View
      className="bg-green-mannwork px-4 py-8"
      style={{ paddingTop: insets.top + 20 }}
    >
      {isOwnProfile && (
        <View
          className="absolute top-0 right-4"
          style={{ top: insets.top + 20 }}
        >
          <Pressable
            onPress={handleSettingsPress}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <MaterialIcons name="settings" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

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
            {user.firstName}{" "}
            {isOwnProfile ? user.lastName : user.lastName.charAt(0) + "."}
          </Text>

          <View className="flex-row items-center mb-4">
            {renderStars(user.rating)}
            <Text className="text-white text-sm ml-2">
              ({user.reviewCount} valoraciones)
            </Text>
          </View>

          {user.role === "professional" && onRequestQuote && !isOwnProfile && (
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
