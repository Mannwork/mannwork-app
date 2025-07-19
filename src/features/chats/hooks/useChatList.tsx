import { useAuth } from "@clerk/clerk-expo";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserChats } from "../services/get-chat-list";

const PAGE_SIZE = 10; // Number of items per page

interface UseChatListOptions {
    initialPageParam?: number;
    pageSize?: number;
}

export function useChatList({ pageSize = PAGE_SIZE }: UseChatListOptions) {
    const { userId } = useAuth();

    return useInfiniteQuery({
        queryKey: ["chats", userId],
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];
            // Ensure pageParam is a number
            const page = typeof pageParam === "number" ? pageParam : 1;
            return await getUserChats(userId, page, pageSize);
        },
        getNextPageParam: (lastPage, allPages) => {
            // If the last page is empty or has fewer items than the page size, we've reached the end
            if (lastPage.length < pageSize) return undefined;
            // Return the next page number (1-indexed)
            return allPages.length + 1;
        },
        initialPageParam: 1,
        // Enable the query only when we have a userId
        enabled: !!userId,
        // Use placeholderData to keep previous data while fetching
        placeholderData: (previousData) => previousData,
    });
}

export default useChatList;
