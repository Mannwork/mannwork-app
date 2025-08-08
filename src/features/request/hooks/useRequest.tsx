import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../services/get-request";

export const useRequest = (requestId: string) => {
    const requestQuery = useQuery({
        queryKey: ["request", requestId],
        queryFn: async () => {
            return await getRequest(requestId);
        },
        enabled: !!requestId,
    });

    return requestQuery;
};
