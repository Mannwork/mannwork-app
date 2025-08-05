import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useAuth } from "@clerk/clerk-expo";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUserChats } from "../services/get-chat-list";

const PAGE_SIZE = 10; // Number of items per page

interface UseChatListOptions {
    initialPageParam?: number;
    pageSize?: number;
    statusSelected?: string;
}

export function useChatList({
    pageSize = PAGE_SIZE,
    statusSelected = "active",
}: UseChatListOptions) {
    const { userId } = useAuth();
    const queryClient = useQueryClient();

    const query = useInfiniteQuery({
        queryKey: ["chats", userId, statusSelected],
        queryFn: async ({ pageParam = 1 }) => {
            if (!userId) return [];
            const page = typeof pageParam === "number" ? pageParam : 1;

            return await getUserChats({
                userId,
                page,
                pageSize,
                statusSelected,
            });
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

    // Suscripción a cambios en tiempo real
    useEffect(() => {
        if (!userId) return;

        // 1. Suscripción a cambios en la tabla de mensajes
        const messagesSubscription = supabase
            .channel(`messages-updates-${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                () => {
                    queryClient.invalidateQueries({
                        queryKey: ["chats", userId, statusSelected],
                    });
                }
            )
            .subscribe();

        // 2. Suscripción a cambios en la tabla de chats
        const chatsSubscription = supabase
            .channel(`chats-updates-${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "chats",
                    filter: `or(client_id.eq.${userId},professional_id.eq.${userId})`,
                },
                (payload) => {
                    if (payload.new.updated_at !== payload.old?.updated_at) {
                        queryClient.invalidateQueries({
                            queryKey: ["chats", userId, statusSelected],
                        });
                    }
                }
            )
            .subscribe();

        // Limpieza al desmontar
        return () => {
            messagesSubscription.unsubscribe();
            chatsSubscription.unsubscribe();
        };
    }, [userId, statusSelected, queryClient]);

    return query;
}

export default useChatList;
