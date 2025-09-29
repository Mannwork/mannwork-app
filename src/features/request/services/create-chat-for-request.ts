import { supabase } from "@/common/lib/supabase/supabaseClient";

// --- Interfaces (sin cambios) ---
interface createChatForRequestProps {
  requestId: string;
  clientId: string;
  professionalId: string;
}

interface CreatedChatResponse {
  chatId: string;
  professionalName: string;
  professionalImage: string;
  mainCategory: string;
  subCategory: string;
  status: string;
  request_id: string;
  client_id: string;
  professional_id: string;
}

// --- Tipo para los datos que vienen de Supabase ---
// Definir un tipo para la data que esperamos nos ayudará con el autocompletado y la seguridad de tipos.
type ChatDataFromSupabase = {
    id: string;
    request_id: string;
    client_id: string;
    professional_id: string;
    status: "active" | "completed" | "pending";
    requests: {
        categories: { name: string } | null;
        subcategories: { name: string } | null;
    } | null;
    client: {
        name: string;
        last_name: string;
        profile_pic: string | null;
    } | null;
};


// --- Constante para la consulta (Evita la repetición) ---
// Extraemos la consulta compleja a una constante para reutilizarla y mantener el código limpio.
const CHAT_WITH_DETAILS_QUERY = `
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
`;

// --- Función Auxiliar para Mapear Datos (Evita la repetición) ---
// Esta función se encarga de transformar la respuesta de Supabase al formato que necesitamos.
const mapChatDataToResponse = (chatData: ChatDataFromSupabase): CreatedChatResponse => {
    const professionalName = `${chatData.client?.name || ''} ${chatData.client?.last_name || ''}`.trim();
       
    return {
        chatId: chatData.id,
        professionalName: professionalName || "Profesional no encontrado",
        professionalImage: chatData.client?.profile_pic || "",
        mainCategory: chatData.requests?.categories?.name || 'Sin categoría',
        subCategory: chatData.requests?.subcategories?.name || 'Sin subcategoría',
        status: chatData.status,
        request_id: chatData.request_id,
        client_id: chatData.client_id,
        professional_id: chatData.professional_id,
    };
};


// --- Función Principal Refactorizada ---
export const createChatForRequest = async ({
  requestId,
  clientId,
  professionalId,
}: createChatForRequestProps): Promise<CreatedChatResponse> => {

  // 1. Intentamos obtener el chat existente con todos los detalles de una vez.
  const { data: existingChat, error: existingChatError } = await supabase
    .from('chats')
    .select(CHAT_WITH_DETAILS_QUERY)
    .match({
      request_id: requestId,
      client_id: clientId,
      professional_id: professionalId,
    })
    .maybeSingle<ChatDataFromSupabase>();

  if (existingChatError) {
    console.error("Error fetching existing chat:", existingChatError);
    throw existingChatError;
  }

  // 2. Si el chat ya existe, mapeamos los datos y lo retornamos.
  if (existingChat) {
    return mapChatDataToResponse(existingChat);
  }

  // 3. Si el chat no existe, lo creamos y pedimos que nos devuelva los datos con el mismo formato.
  // Esto nos ahorra una consulta adicional.
  const { data: newChat, error: newChatError } = await supabase
    .from('chats')
    .insert({
      request_id: requestId,
      client_id: clientId,
      professional_id: professionalId,
      status: 'pending',
    })
    .select(CHAT_WITH_DETAILS_QUERY)
    .single<ChatDataFromSupabase>();

  if (newChatError) {
    console.error("Error creating new chat:", newChatError);
    throw newChatError;
  }

  if (!newChat) {
    throw new Error('Falló la creación del chat, no se recibieron datos.');
  }

  const { error: notificationError } = await supabase.from("notifications").insert({
      user_id: clientId,
      title: "Nuevo chat",
      body: "Uno de los profesionales ha creado un chat para tu solicitud.",
      type: "created_chat",
      redirect_id: newChat.id,
      creator_id: professionalId,
  });

  if (notificationError) {
      console.error("Error al crear notificación:", notificationError);
      console.error("Notificación de error:", notificationError.message);
            
      throw notificationError
  };

  // 4. Mapeamos los datos del chat recién creado y lo retornamos.
  return mapChatDataToResponse(newChat);
};