import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface RequestLocationProps {
  location: {
    address: string;
    city: string;
    province: string;
  };
}

const RequestLocation = ({ location }: RequestLocationProps) => {
  return (
    <View className="flex-row items-center mt-2">
      <MaterialIcons name="location-on" size={16} color="#6B7280" />
      <Text className="text-sm text-gray-600 ml-1 flex-1">
        {location.address}, {location.city}, {location.province}
      </Text>
    </View>
  );
};

export default RequestLocation;
