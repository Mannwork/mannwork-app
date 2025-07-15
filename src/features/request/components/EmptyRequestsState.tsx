import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface EmptyRequestsStateProps {
  userRole: "client" | "professional";
  activeTab: string;
  onCreateRequest?: () => void;
  onBrowseRequests?: () => void;
}

const EmptyRequestsState = ({
  userRole,
  activeTab,
  onCreateRequest,
  onBrowseRequests,
}: EmptyRequestsStateProps) => {
  const getTitle = () => {
    if (
      userRole === "client" ||
      (userRole === "professional" && activeTab === "sent")
    ) {
      return activeTab === "sent"
        ? "No tienes solicitudes enviadas"
        : activeTab === "completed"
        ? "No tienes solicitudes completadas"
        : "No tienes solicitudes recibidas";
    } else {
      return activeTab === "received"
        ? "No tienes solicitudes recibidas"
        : "No tienes solicitudes completadas";
    }
  };

  const getSubtitle = () => {
    if (userRole === "client") {
      return activeTab === "sent"
        ? "Cuando crees una solicitud de trabajo, aparecerá aquí"
        : "Las solicitudes completadas aparecerán aquí";
    } else {
      return activeTab === "received"
        ? "Las solicitudes que recibas aparecerán aquí"
        : "Las solicitudes completadas aparecerán aquí";
    }
  };

  const getButtonText = () => {
    if (userRole === "client") {
      return activeTab === "sent" ? "Crear solicitud" : "Buscar trabajos";
    } else {
      return activeTab === "received"
        ? "Buscar solicitudes"
        : "Ver trabajos activos";
    }
  };

  const handleButtonPress = () => {
    if (userRole === "client") {
      if (activeTab === "sent") {
        onCreateRequest?.();
      } else {
        onBrowseRequests?.();
      }
    } else {
      if (activeTab === "received") {
        onBrowseRequests?.();
      } else {
        onBrowseRequests?.();
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
        <MaterialIcons name="assignment" size={48} color="#9CA3AF" />
      </View>

      <Text className="text-gray-900 text-xl font-bold text-center mb-3">
        {getTitle()}
      </Text>

      <Text className="text-gray-600 text-base text-center leading-6 mb-8">
        {getSubtitle()}
      </Text>

      <Pressable
        onPress={handleButtonPress}
        className="bg-green-mannwork rounded-lg px-6 py-3"
      >
        <Text className="text-white font-semibold text-base">
          {getButtonText()}
        </Text>
      </Pressable>
    </View>
  );
};

export default EmptyRequestsState;
