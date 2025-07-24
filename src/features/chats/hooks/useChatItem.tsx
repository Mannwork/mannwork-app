import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import {
    LastMessageData,
    getLastMessageData,
} from "../services/get-last-message-data";

export const useChatItem = (chatId: string, userId: string) => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(
        () => ["chat-message-data", chatId, userId],
        [chatId, userId]
    );

    // Fetch initial data and set up real-time subscription
    const { data, isLoading, error } = useQuery<LastMessageData, Error>({
        queryKey,
        queryFn: () => getLastMessageData(chatId, userId),
        enabled: !!chatId && !!userId,
    });

    // Set up real-time subscription for new messages
    useEffect(() => {
        if (!chatId) return;

        const subscription = supabase
            .channel(`chat-${chatId}-messages`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    // When a new message is inserted, refetch the last message data
                    queryClient.invalidateQueries({ queryKey });
                }
            )
            .subscribe();

        // Set up subscription for message read status updates
        const readStatusSubscription = supabase
            .channel(`chat-${chatId}-read-status`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "messages",
                    filter: `chat_id=eq.${chatId}`,  // More specific filter can be added if needed
                },
                (payload) => {
                    // Only refetch if is_read was actually changed
                    if (payload.new.is_read !== payload.old?.is_read) {
                        // Invalidate the query to update the unread count
                        queryClient.invalidateQueries({ queryKey });
                    }
                }
            )
            .subscribe((status, err) => {
                if (err) {
                    console.error('Error subscribing to read status changes:', err);
                }
            });

        // Cleanup subscriptions on unmount
        return () => {
            subscription.unsubscribe();
            readStatusSubscription.unsubscribe();
        };
    }, [chatId, queryClient, queryKey]);

    // Mark messages as read when the chat is active
    const markAsRead = async () => {
        if (!chatId || !userId) return;

        try {
            await supabase
                .from("messages")
                .update({ is_read: true })
                .eq("chat_id", chatId)
                .eq("is_read", false)
                .neq("sender_id", userId);

            // Invalidate the query to update the unread count
            queryClient.invalidateQueries({ queryKey });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    return {
        lastMessage: data?.lastMessage || "No hay mensajes",
        lastMessageType: data?.lastMessageType || "text",
        lastMessageTime: data?.lastMessageTime || "",
        unreadCount: data?.unreadCount || 0,
        isLoading,
        error,
        markAsRead,
    };
};
