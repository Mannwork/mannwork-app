import { Pressable, Text, View } from "react-native";

interface ChatsTabsProps {
  activeTab: "active" | "pending" | "completed";
  onTabChange: (tab: "active" | "pending" | "completed") => void;
  counts: {
    active: number;
    pending: number;
    completed: number;
  };
}

const ChatsTabs = ({ activeTab, onTabChange, counts }: ChatsTabsProps) => {
  const tabs = [
    { key: "active" as const, label: "Activos", count: counts.active },
    { key: "pending" as const, label: "Pendientes", count: counts.pending },
    {
      key: "completed" as const,
      label: "Completados",
      count: counts.completed,
    },
  ];

  return (
    <View className="bg-white border-b border-gray-200">
      <View className="flex-row px-4">
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            className={`flex-1 py-4 border-b-2 ${
              activeTab === tab.key
                ? "border-green-mannwork"
                : "border-transparent"
            }`}
          >
            <View className="items-center">
              <View className="flex-row items-center">
                <Text
                  className={`font-semibold text-sm ${
                    activeTab === tab.key
                      ? "text-green-mannwork"
                      : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </Text>
                <View
                  className={`ml-2 rounded-full px-2 py-1 min-w-[20px] ${
                    activeTab === tab.key ? "bg-green-mannwork" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium text-center ${
                      activeTab === tab.key ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default ChatsTabs;
