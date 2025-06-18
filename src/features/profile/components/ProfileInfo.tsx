import { Text, View } from "react-native";

interface ProfileInfoProps {
  description: string;
}

const ProfileInfo = ({ description }: ProfileInfoProps) => {
  return (
    <View className="bg-white px-4 py-4">
      <View>
        <Text className="text-xl font-bold text-green-mannwork mb-2">
          Descripción
        </Text>
        <Text className="text-md text-gray-600 leading-7">{description}</Text>
      </View>
    </View>
  );
};

export default ProfileInfo;
