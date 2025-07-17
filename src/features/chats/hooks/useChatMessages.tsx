import { useInfiniteQuery } from "@tanstack/react-query";
import { getChatMessages } from "../services/get-chat-messages";

const MESSAGES_PER_PAGE = 20;

export const useChatMessages = (chatId: string) => {
    const { data, isLoading, error, fetchNextPage, hasNextPage, refetch } =
        useInfiniteQuery({
            queryKey: ["chat-messages", chatId],
            queryFn: ({ pageParam = 1 }) =>
                getChatMessages({ chatId, pageParam }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) => {
                if (!lastPage || lastPage.length < MESSAGES_PER_PAGE) {
                    return undefined; // No more pages
                }
                return allPages.length + 1;
            },
        });

    return {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        refetch,
    };
};
