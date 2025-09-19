import { supabase } from "@/common/lib/supabase/supabaseClient";
import { Message } from "@/common/types/message.type";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { getChatData } from "../services/get-chat-messages";

const MESSAGES_PER_PAGE = 20;

export const useChatMessages = (chatId: string) => {
    // 1. Obtené la instancia del QueryClient
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ["chat-messages", chatId], [chatId]);

    const { data, isLoading, error, fetchNextPage, hasNextPage, refetch } =
        useInfiniteQuery({
            queryKey: queryKey,
            queryFn: ({ pageParam = 1 }) => getChatData({ chatId, pageParam }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) => {
                if (!lastPage || lastPage.messages.length < MESSAGES_PER_PAGE) {
                    return undefined; // No hay más páginas
                }
                return allPages.length + 1;
            },
        });

    // 2. Usá useEffect para manejar la suscripción a Realtime
    useEffect(() => {
        // Definí el canal específico para este chat
        const channel = supabase
            .channel(`chat_${chatId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `chat_id=eq.${chatId}`, // Escuchar solo mensajes de este chat
                },
                (payload) => {
                    const newMessage = payload.new as Message;

                    // 3. Actualizá el caché de la query con el nuevo mensaje
                    queryClient.setQueryData(queryKey, (oldData: any) => {
                        // Si el caché está vacío, no hagas nada
                        if (!oldData) return oldData;

                        if (newMessage.type === "quote") {
                            refetch();
                        } else {
                            // Creá una nueva copia de los datos actualizando solo la primera página
                            const newData = {
                                ...oldData,
                                pages: oldData.pages.map(
                                    (page: any, index: number) =>
                                        index === 0
                                            ? {
                                                  ...page,
                                                  messages: [
                                                      newMessage,
                                                      ...page.messages,
                                                  ],
                                              }
                                            : page
                                ),
                            };

                            return newData;
                        }
                    });
                }
            )
            .subscribe();

        // 4. Limpiá la suscripción cuando el componente se desmonte
        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId, queryClient, queryKey, refetch]);

    return {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        refetch,
    };
};
