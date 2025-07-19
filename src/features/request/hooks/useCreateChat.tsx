import { useAuth } from "@clerk/clerk-expo";

import { router } from "expo-router";
import { useState } from "react";
import { Request } from "../components/RequestCard";
import { createChatForRequest } from "../services/create-chat-for-request";

interface Props {
    request: Request;
}

export const useCreateChat = ({ request }: Props) => {
    const { userId } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    const handleCreateChat = async () => {
        setIsLoading(true);
        if (!userId) {
            setIsLoading(false);
            throw new Error("No user ID");
        }

        const clientId = request.users.find(
            (user) => user.role === "client"
        )?.id;

        if (!clientId) {
            setIsLoading(false);
            throw new Error("No client ID");
        }

        if (!request.id) {
            setIsLoading(false);
            throw new Error("No request ID");
        }

        try {
            const createdChat = await createChatForRequest({
                requestId: request.id,
                clientId: clientId,
                professionalId: userId,
            });

            router.push(`/chats/${createdChat.chatId}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreateChat, isLoading };
};
