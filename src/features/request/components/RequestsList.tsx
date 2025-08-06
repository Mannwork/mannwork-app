import { RefreshControl, ScrollView, View } from "react-native";

import { RequestItem } from "../interfaces/request.interface";
import EmptyRequestsState from "./EmptyRequestsState";
import RequestCard from "./RequestCard";

interface RequestsListProps {
  requests: RequestItem[];
  userRole: "client" | "professional";
  activeTab: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  onRequestPress?: (request: RequestItem) => void;

  onCreateRequest?: () => void;
  onBrowseRequests?: () => void;
}

const RequestsList = ({
  requests,
  userRole,
  activeTab,
  isLoading = false,
  onRefresh,
  onRequestPress,
  onCreateRequest,
  onBrowseRequests,
}: RequestsListProps) => {
  if (requests.length === 0) {
    return (
      <EmptyRequestsState
        userRole={userRole}
        activeTab={activeTab}
        onCreateRequest={onCreateRequest}
        onBrowseRequests={onBrowseRequests}
      />
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor="#2D7A3E"
          colors={["#2D7A3E"]}
        />
      }
    >
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onPress={onRequestPress}
          currentUserRole={userRole}
        />
      ))}
      <View className="h-4" />
    </ScrollView>
  );
};

export default RequestsList;
