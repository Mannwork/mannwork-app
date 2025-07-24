import { supabase } from "@/common/lib/supabase/supabaseClient";

export interface UnreadIndicators {
  active: boolean;
  pending: boolean;
  completed: boolean;
}

export async function getUnreadIndicators(userId: string): Promise<UnreadIndicators> {
  try {
    // Initialize the response with all indicators set to false
    const indicators: UnreadIndicators = {
      active: false,
      pending: false,
      completed: false,
    };

    // First, get all chats where the user is either client or professional
    const { data: chats, error: chatsError } = await supabase
      .from('chats')
      .select('id, status')
      .or(`client_id.eq.${userId},professional_id.eq.${userId}`);

    if (chatsError) {
      console.error('Error fetching user chats:', chatsError);
      return indicators;
    }

    if (!chats || chats.length === 0) {
      return indicators; // No chats found
    }

    // Get all chat IDs for the user
    const chatIds = chats.map(chat => chat.id);

    // Check for unread messages in these chats
    const { data: unreadMessages, error: messagesError } = await supabase
      .from('messages')
      .select('chat_id, is_read')
      .in('chat_id', chatIds)
      .eq('is_read', false)
      .neq('sender_id', userId); // Only count messages not sent by the current user

    if (messagesError) {
      console.error('Error checking for unread messages:', messagesError);
      return indicators;
    }

    // If there are unread messages, find out which statuses they belong to
    if (unreadMessages && unreadMessages.length > 0) {
      // Create a map of chat_id to status
      const chatStatusMap = new Map();
      chats.forEach(chat => {
        chatStatusMap.set(chat.id, chat.status);
      });

      // Check which statuses have unread messages
      unreadMessages.forEach(message => {
        const status = chatStatusMap.get(message.chat_id);
        if (status && status in indicators) {
          indicators[status as keyof UnreadIndicators] = true;
        }
      });
    }

    return indicators;
  } catch (error) {
    console.error('Unexpected error in getUnreadIndicators:', error);
    return {
      active: false,
      pending: false,
      completed: false,
    };
  }
}
