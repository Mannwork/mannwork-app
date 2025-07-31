import { useQuery } from "@tanstack/react-query";
import { getQuote } from "../services/get-quote";

export interface Quote {
    id: string;
    price: number;
    descriptionservice: string;
    durationestimate?: string;
    validuntil?: Date;
    professional_id: string;
    request_id: string;
    client_id: string;
    status:
        | "pending"
        | "accepted"
        | "rejected"
        | "paid"
        | "completed"
        | "cancelled";
    createdat: string;
    updatedat: string;
    professionalAvatar: string;
    professionalName: string;
    professionalAccessToken: string;    
}

export const useQuote = (quoteId: string | undefined) => {
    return useQuery<Quote, Error>({
        queryKey: ["quote", quoteId],
        queryFn: () => {
            if (!quoteId) throw new Error("Quote ID is required");
            return getQuote(quoteId);
        },
        enabled: !!quoteId, // Only run the query if quoteId exists
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};
