import { useQuery } from "@tanstack/react-query";

import { getRequestFacturation } from "../services/get-request-facturation";

const useFacturation = (requestId: string) => {
    return useQuery({
        queryKey: ["facturation", requestId],
        queryFn: async () => {
            const response = await getRequestFacturation(requestId);

            return response;
        },
        enabled: !!requestId,
    });
};

export default useFacturation;
