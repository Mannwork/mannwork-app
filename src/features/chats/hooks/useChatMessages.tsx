import { supabase } from "@/common/lib/supabase/supabaseClient";
import { Message } from "@/common/types/message.type";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { getChatMessages } from "../services/get-chat-messages";

const MESSAGES_PER_PAGE = 20;

export const useChatMessages = (chatId: string) => {
    // 1. Obtené la instancia del QueryClient
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ["chat-messages", chatId], [chatId]);

    const { data, isLoading, error, fetchNextPage, hasNextPage, refetch } =
        useInfiniteQuery({
            queryKey: queryKey,
            queryFn: ({ pageParam = 1 }) =>
                getChatMessages({ chatId, pageParam }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) => {
                if (!lastPage || lastPage.length < MESSAGES_PER_PAGE) {
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

                        // Creá una nueva copia de los datos para no mutar el original
                        const newData = {
                            ...oldData,
                            pages: [...oldData.pages],
                        };

                        // Agregá el nuevo mensaje al principio de la primera página
                        // Esto funciona porque tus mensajes se cargan en orden descendente
                        newData.pages[0] = [newMessage, ...newData.pages[0]];

                        return newData;
                    });
                }
            )
            .subscribe();

        // 4. Limpiá la suscripción cuando el componente se desmonte
        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId, queryClient, queryKey]);

    return {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        refetch,
    };
};
