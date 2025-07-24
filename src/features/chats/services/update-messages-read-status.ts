import { supabase } from "@/common/lib/supabase/supabaseClient";

export const updateMessagesReadStatus = async (chatId: string, userId: string) => {
    await supabase.from('messages')
    .update({ is_read: true })
    .eq('chat_id', chatId)
    .neq('sender_id', userId);
}