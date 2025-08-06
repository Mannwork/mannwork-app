import { Pressable, Text, View } from "react-native";

interface RequestsTabsProps {
  userRole: "client" | "professional";
  activeTab: string;
  onTabChange: (tab: "received" | "sent" | "completed") => void;
}

interface Tab {
  id: "received" | "sent" | "completed";
  label: string;
}

const RequestsTabs = ({
  userRole,
  activeTab,
  onTabChange,
}: RequestsTabsProps) => {
  const getTabs = (): Tab[] => {

    if (userRole === "client") {
      return [
        { id: "sent", label: "Enviadas" },
        { id: "completed", label: "Completadas" },
      ];
    } else {
      return [
        { id: "sent", label: "Enviadas" },
        { id: "received", label: "Recibidas" },
        { id: "completed", label: "Completadas" },
      ];
    }
  };

  const tabs = getTabs();

  return (
    <View className="bg-white border-b border-gray-200">
      <View className="flex-row px-4">
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className={`flex-1 py-4 border-b-2 ${
              activeTab === tab.id
                ? "border-green-mannwork"
                : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === tab.id ? "text-green-mannwork" : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default RequestsTabs;
