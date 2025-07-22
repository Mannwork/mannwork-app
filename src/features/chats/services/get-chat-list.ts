import { supabase } from "@/common/lib/supabase/supabaseClient";

interface ChatListItem {
    id: string;
    professionalName: string;
    professionalImage?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    mainCategory: string;
    subCategory: string;
    status: "active" | "completed" | "pending";
}

interface ChatData {
    id: string;
    request_id: string;
    client_id: string;
    professional_id: string;
    status: string;
    requests: {
        category: string;
        subcategory: string;
        categories: { name: string };
        subcategories: { name: string };
    };
}

export async function getUserChats(userId: string, page: number, pageSize: number): Promise<ChatListItem[]> {
    const offset = (page - 1) * pageSize;

    try {
        // First, fetch the basic chat information with related request data
        const { data: chatsData, error: chatsError } = await supabase
            .from('chats')
            .select(`
                id,
                request_id,
                client_id,
                professional_id,
                status,
                requests!chats_request_id_fkey (
                    category,
                    subcategory,
                    categories!inner ( name ),
                    subcategories!inner ( name )
                )
            `)
            .or(`client_id.eq.${userId},professional_id.eq.${userId}`)
            .order('created_at', { ascending: false })
            .range(offset, offset + pageSize - 1);

        if (chatsError) {
            console.error('Error fetching chats:', chatsError);
            throw chatsError;
        }

        if (!chatsData || chatsData.length === 0) {
            return [];
        }

        // Transform the data to match the ChatListItem interface
        const chatListItems: ChatListItem[] = await Promise.all(
            (chatsData as unknown as ChatData[]).map(async (chat) => {
                // Determine the other user's ID (the one who is not the current user)
                const otherUserId = chat.client_id === userId ? chat.professional_id : chat.client_id;

                // Get the other user's profile information
                const { data: otherUserData, error: userError } = await supabase
                    .from('users')
                    .select('name, last_name, profile_pic')
                    .eq('id', otherUserId)
                    .single();

                if (userError) {
                    console.error(`Error fetching user details for ID ${otherUserId}:`, userError);
                }

                // Get the last message in the chat
                const { data: lastMessageData, error: messageError } = await supabase
                    .from('messages')
                    .select('content, created_at, sender_id')
                    .eq('chat_id', chat.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (messageError && messageError.code !== 'PGRST116') {
                    console.error(`Error fetching last message for chat ${chat.id}:`, messageError);
                }

                // Get unread message count
                const { count: unreadCount, error: unreadError } = await supabase
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('chat_id', chat.id)
                    .eq('is_read', false)
                    .neq('sender_id', userId);

                if (unreadError) {
                    console.error(`Error fetching unread count for chat ${chat.id}:`, unreadError);
                }

                // Get category and subcategory from the related request


                const request = chat.requests;
                const mainCategory = request?.categories?.name || 'Sin categoría';
                const subCategory = request?.subcategories?.name || 'Sin subcategoría';

                return {
                    id: chat.id,
                    professionalName: otherUserData 
                        ? `${otherUserData.name} ${otherUserData.last_name}`.trim() 
                        : 'Usuario',
                    professionalImage: otherUserData?.profile_pic,
                    lastMessage: lastMessageData?.content || 'No hay mensajes',
                    lastMessageTime: lastMessageData?.created_at 
                        ? new Date(lastMessageData.created_at).toLocaleTimeString('es-AR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })
                        : '',
                    unreadCount: unreadCount || 0,
                    mainCategory,
                    subCategory,
                    status: chat.status as "active" | "completed" | "pending"
                };
            })
        );

        return chatListItems;
    } catch (error) {
        console.error('Error in getUserChats:', error);
        throw error;
    }
}