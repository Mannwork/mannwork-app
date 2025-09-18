import type { Message } from "@/common/types/message.type";

import { supabase } from "@/common/lib/supabase/supabaseClient";

export const postNewMessage = async ({attachment_url, content, chat_id, sender_id, receptor_id, type}: Pick<Message, "content" | "chat_id" | "sender_id" | "type" | "attachment_url"> & {receptor_id: string} ) => {
    if (type === "quote" || type === "quote_request") {
        
    }
    
    const { data, error } = await supabase.from("messages").insert({
        content,
        chat_id,
        sender_id,
        type,
        attachment_url,
    });

    if (error) throw error;

    const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: receptor_id,
        title: "Nuevo mensaje",
        body: type === "quote"
                ? "Cotización recibida"
                : type === "quote_request"
                ? "Solicitud de cotización"
                : type === "image"
                ? "Imágen"
                : type === "file"
                ? "Archivo adjunto"
                : content,
        type: "new_message",
        redirect_id: chat_id,
        creator_id: sender_id,
    });

    if (notificationError) {
        console.error("Error al crear notificación:", notificationError);
        console.error("Notificación de error:", notificationError.message);
        
        throw notificationError
    };

    return data;
};
