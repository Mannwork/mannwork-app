import type { Message } from "@/common/types/message.type";

import { supabase } from "@/common/lib/supabase/supabaseClient";

export const postNewMessage = async ({attachment_url, content, chat_id, sender_id, type}: Pick<Message, "content" | "chat_id" | "sender_id" | "type" | "attachment_url"> ) => {
    const { data, error } = await supabase.from("messages").insert({
        content,
        chat_id,
        sender_id,
        type,
        attachment_url,
    });

    if (error) throw error;

    return data;
};
