import { supabase } from "@/common/lib/supabase/supabaseClient";

export interface LastMessageData {
  lastMessage: string;
  lastMessageType: string;
  lastMessageTime: string;
  unreadCount: number;
}

export const getLastMessageData = async (
  chatId: string, 
  userId: string
): Promise<LastMessageData> => {
  try {
    // Get the last message
    const { data: lastMessageData, error: messageError } = await supabase
      .from('messages')
      .select('type, content, created_at, sender_id')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (messageError && messageError.code !== 'PGRST116') {
      console.error(`Error fetching last message for chat ${chatId}:`, messageError);
    }

    // Get unread message count
    const { count: unreadCount, error: unreadError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chatId)
      .eq('is_read', false)
      .neq('sender_id', userId);

    if (unreadError) {
      console.error(`Error fetching unread count for chat ${chatId}:`, unreadError);
    }

    return {
      lastMessage: lastMessageData?.content || 'No hay mensajes',
      lastMessageType: lastMessageData?.type || 'text',
      lastMessageTime: lastMessageData?.created_at 
        ? new Date(lastMessageData.created_at).toLocaleTimeString('es-AR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        : '',
      unreadCount: unreadCount || 0,
    };
  } catch (error) {
    console.error('Error in getLastMessageData:', error);
    return {
      lastMessage: 'No hay mensajes',
      lastMessageType: 'text',
      lastMessageTime: '',
      unreadCount: 0,
    };
  }
};