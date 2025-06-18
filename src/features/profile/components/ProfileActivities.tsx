import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface Activity {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

interface ProfileActivitiesProps {
  activities: Activity[];
  userRole: "professional" | "client";
}

const ProfileActivities = ({
  activities,
  userRole,
}: ProfileActivitiesProps) => {
  if (userRole !== "professional") {
    return null;
  }

  if (!activities || !Array.isArray(activities) || activities.length === 0) {
    return null;
  }

  return (
    <View className="bg-white px-4 py-4">
      <Text className="text-xl font-bold text-green-mannwork mb-4">
        Actividades principales
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {activities.map((activity, index) => {
          const isThirdActivity = index === 2 && activities.length === 3;

          return (
            <View
              key={`activity-${index}`}
              className={`${
                isThirdActivity ? "w-full" : "w-[48%]"
              } bg-green-mannwork-light rounded-lg p-4 mb-3 items-center`}
            >
              <View className="bg-green-mannwork-light rounded-full p-3 mb-3">
                <MaterialIcons name="build" size={28} color="#2D7A3E" />
              </View>
              <Text className="text-base font-bold text-gray-800 mb-2 text-center">
                {activity.name}
              </Text>
              <View className="w-full">
                {activity.subcategories &&
                  activity.subcategories
                    .slice(0, 3)
                    .map((subcategory, subIndex) => (
                      <View
                        key={`subcategory-${index}-${subIndex}`}
                        className="flex-row items-center justify-center mb-1"
                      >
                        <View className="w-1.5 h-1.5 bg-green-mannwork rounded-full mr-1.5" />
                        <Text className="text-xs text-gray-600 text-center">
                          {subcategory}
                        </Text>
                      </View>
                    ))}
                {activity.subcategories &&
                  activity.subcategories.length > 3 && (
                    <Text className="text-xs text-green-mannwork text-center mt-1">
                      +{activity.subcategories.length - 3} más
                    </Text>
                  )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ProfileActivities;
