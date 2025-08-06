import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface InfoCardProps {
  title: string;
  description: string;
  onClose?: () => void;
  onPress?: () => void;
}

const InfoCard = ({ title, description, onClose, onPress }: InfoCardProps) => (
  <Pressable
    disabled={!onPress}
    onPress={onPress}
    className="mx-4 mt-6 bg-green-mannwork-light border-l-4 border-green-mannwork rounded-lg p-4 flex-row items-start relative"
    style={{ opacity: onPress ? 0.95 : 1 }}
  >
    <View className="bg-green-mannwork rounded-full w-8 h-8 items-center justify-center mr-3 mt-1">
      <MaterialIcons name="error-outline" size={24} color="#fff" />
    </View>
    <View className="flex-1">
      <Text className="text-green-mannwork font-bold text-base mb-1">
        {title}
      </Text>
      <Text className="text-green-mannwork text-xs">{description}</Text>
    </View>
    {onClose && (
      <Pressable
        onPress={onClose}
        style={{ position: "absolute", top: 8, right: 8 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialIcons name="close" size={20} color="#888" />
      </Pressable>
    )}
  </Pressable>
);

export default InfoCard;
