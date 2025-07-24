import { supabase } from "@/common/lib/supabase/supabaseClient";

interface ChatListItem {
    id: string;
    request_id: string;
    client_id: string;
    professional_id: string;
    professionalName: string;
    professionalImage?: string;
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

interface GetChatListParams {
    userId: string;
    page: number;
    pageSize: number;
    statusSelected: string;
}

export async function getUserChats({ userId, page, pageSize, statusSelected }: GetChatListParams): Promise<ChatListItem[]> {
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
                ),
                updated_at
            `)
            .or(`client_id.eq.${userId},professional_id.eq.${userId}`)
            .eq('status', statusSelected)
            .order('updated_at', { ascending: false })
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

                const request = chat.requests;
                const mainCategory = request?.categories?.name || 'Sin categoría';
                const subCategory = request?.subcategories?.name || 'Sin subcategoría';

                return {
                    id: chat.id,
                    request_id: chat.request_id,
                    client_id: chat.client_id,
                    professional_id: chat.professional_id,
                    professionalName: otherUserData 
                        ? `${otherUserData.name} ${otherUserData.last_name}`.trim() 
                        : 'Usuario',
                    professionalImage: otherUserData?.profile_pic,
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