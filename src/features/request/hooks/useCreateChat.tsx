import { useAuth } from "@clerk/clerk-expo";

import { supabase } from "@/common/lib/supabase/supabaseClient";
import { useChatStore } from "@/features/chats/store/chat.store";
import { router } from "expo-router";
import { useState } from "react";
import { RequestItem } from "../interfaces/request.interface";
import { createChatForRequest } from "../services/create-chat-for-request";

interface Props {
    request: RequestItem;
}

export const useCreateChat = ({ request }: Props) => {
    const { userId } = useAuth();
    const { setActualChatData } = useChatStore();

    const [isLoading, setIsLoading] = useState(false);

    const handleCreateChat = async () => {
        setIsLoading(true);
        if (!userId) {
            setIsLoading(false);
            throw new Error("No user ID");
        }

        const clientId = request.client?.id;

        if (!clientId) {
            setIsLoading(false);
            throw new Error("No client ID");
        }

        if (!request.id) {
            setIsLoading(false);
            throw new Error("No request ID");
        }

        try {
            // Si la request está en 'searching', actualizar a 'pending'
            if (request.status === "searching") {
                const { error: updateError } = await supabase
                    .from("requests")
                    .update({ status: "pending" })
                    .eq("id", request.id);
                if (updateError) {
                    console.error(
                        "Error al actualizar status de request:",
                        updateError
                    );
                }
            }

            const createdChat = await createChatForRequest({
                requestId: request.id,
                clientId: clientId,
                professionalId: userId,
            });

            setActualChatData(createdChat);

            router.push(`/chats/${createdChat.chatId}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateChat, isLoading };
};
