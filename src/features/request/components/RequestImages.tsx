import { Image, Pressable, Text, View } from "react-native";

interface RequestImagesProps {
  images: string[];
  onImagePress?: (imageUrl: string, index: number) => void;
}

const RequestImages = ({ images, onImagePress }: RequestImagesProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  const displayImages = images.slice(0, 3);
  const remainingCount = images.length - 3;

  return (
    <View className="flex-row mt-3 space-x-2">
      {displayImages.map((image, index) => (
        <Pressable
          key={index}
          onPress={() => onImagePress?.(image, index)}
          className="relative"
        >
          <Image
            source={{ uri: image }}
            className="w-16 h-16 rounded-lg"
            resizeMode="cover"
          />
          {index === 2 && remainingCount > 0 && (
            <View className="absolute inset-0 bg-black bg-opacity-50 rounded-lg items-center justify-center">
              <Text className="text-white text-xs font-bold">
                +{remainingCount}
              </Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
};

export default RequestImages;
