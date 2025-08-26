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
interface GetChatListParams {
    userId: string;
    page: number;
    pageSize: number;
    statusSelected: string;
    searchText?: string; // Parámetro nuevo y necesario para la búsqueda
}

export async function getUserChats({
    userId,
    page,
    pageSize,
    statusSelected,
    searchText,
}: GetChatListParams): Promise<ChatListItem[]> {
    const offset = (page - 1) * pageSize;

    try {
        // Primero obtenemos todos los chats del usuario con el status seleccionado
        let query = supabase
            .from('chats')
            .select(`
                id,
                request_id,
                client_id,
                professional_id,
                status,
                updated_at,
                requests!inner (
                    categories ( name ),
                    subcategories ( name )
                ),
                client:users!chats_client_id_fkey ( name, last_name, profile_pic ),
                professional:users!chats_professional_id_fkey ( name, last_name, profile_pic )
            `)
            .or(`client_id.eq.${userId},professional_id.eq.${userId}`)
            .eq('status', statusSelected);

        const { data: chatsData, error: chatsError } = await query
            .order('updated_at', { ascending: false });

        if (chatsError) {
            console.error('Error fetching chats:', chatsError);
            throw chatsError;
        }

        if (!chatsData || chatsData.length === 0) {
            return [];
        }

        // Filtramos en el cliente si hay texto de búsqueda
        let filteredData = chatsData;
        if (searchText && searchText.trim() !== '') {
            const searchLower = searchText.toLowerCase().trim();
            filteredData = chatsData.filter((chat: any) => {
                const categoryName = chat.requests?.categories?.name?.toLowerCase() || '';
                const subcategoryName = chat.requests?.subcategories?.name?.toLowerCase() || '';
                const clientName = `${chat.client?.name || ''} ${chat.client?.last_name || ''}`.toLowerCase();
                const professionalName = `${chat.professional?.name || ''} ${chat.professional?.last_name || ''}`.toLowerCase();
                
                return categoryName.includes(searchLower) ||
                       subcategoryName.includes(searchLower) ||
                       clientName.includes(searchLower) ||
                       professionalName.includes(searchLower);
            });
        }

        // Aplicamos paginación después del filtrado
        const paginatedData = filteredData.slice(offset, offset + pageSize);

        const chatListItems: ChatListItem[] = paginatedData.map((chat: any) => {
            const isUserTheClient = chat.client_id === userId;
            const otherUser = isUserTheClient ? chat.professional : chat.client;

            return {
                id: chat.id,
                request_id: chat.request_id,
                client_id: chat.client_id,
                professional_id: chat.professional_id,
                professionalName: otherUser
                    ? `${otherUser.name} ${otherUser.last_name}`.trim()
                    : 'Usuario',
                professionalImage: otherUser?.profile_pic,
                mainCategory: chat.requests?.categories?.name || 'Sin categoría',
                subCategory: chat.requests?.subcategories?.name || 'Sin subcategoría',
                status: chat.status as "active" | "completed" | "pending",
            };
        });

        return chatListItems;
    } catch (error) {
        console.error('Error in getUserChats:', error);
        throw error;
    }
}