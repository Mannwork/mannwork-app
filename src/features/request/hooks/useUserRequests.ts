import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { RequestItem } from "../interfaces/request.interface";
import { getClientRequests } from "../services/get-client-request";
import { getProfessionalRequest } from "../services/get-professional-request";

interface UseUserRequestsOptions {
  userRole: "client" | "professional";
  status: "received" | "sent" | "completed";
}

export const useUserRequests = ({ userRole, status }: UseUserRequestsOptions) => {
  const { userId } = useAuth();

  const getStatus = () => {
    if (status === "sent" || status === "received") {
      return ["searching", "pending", "payed", "working"];
    } else {
      return ["cancelled", "refunded", "completed"]
    }
  };

  const requestQuery = useQuery<RequestItem[], Error>({
    queryKey: ["user-requests", userId, userRole, status],
    queryFn: async () => {
      if (!userId) throw new Error("No user ID");

      if (userRole === "client") {
        // Cliente: obtener solicitudes que él creó con información de categorías
        return await getClientRequests(userId, getStatus());
      } else {
        return await getProfessionalRequest(userId, getStatus());
      }
    },
    enabled: !!userId && !!status,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });


  return requestQuery
}; 