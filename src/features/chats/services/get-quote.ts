import { supabase } from "@/common/lib/supabase/supabaseClient";

// Función auxiliar para formatear los datos de la cotización y el profesional.
// Esto evita duplicar código en las dos ramas lógicas.
const formatQuoteData = (quoteData: any) => {
    if (!quoteData) return null;

    const { professional, ...quote } = quoteData;
    
    // Construimos el nombre del profesional de forma segura
    const professionalName = (professional?.name && professional?.last_name)
        ? `${professional.name} ${professional.last_name.charAt(0)}.`
        : 'Profesional';

    return {
        ...quote,
        professionalName,
        professionalAvatar: professional?.profile_pic || null,
        professionalAccessToken: professional?.mp_access_token || "",
    };
};

export const getQuote = async (quoteId: string, chatId?: string) => {
    // --- Lógica principal: si se provee un chatId, buscamos la cotización a través del chat ---
    if (chatId) {
        // 1. Buscar el último mensaje de tipo 'quote' en el chat
        const { data: latestQuoteMessage, error: messageError } = await supabase
            .from("messages")
            .select("content") // Solo necesitamos el ID de la cotización
            .eq("chat_id", chatId)
            .eq("type", "quote")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (messageError || !latestQuoteMessage) {
            console.log("No se encontró un mensaje de cotización en este chat.", messageError);
            // Si no hay mensaje de cotización, no hay nada que mostrar.
            return null;
        }

        const quoteIdFromMessage = latestQuoteMessage.content;

        // 2. Buscar la cotización usando el ID del mensaje y VALIDAR su estado
        const { data: quoteData, error: quoteError } = await supabase
            .from("quotes")
            .select(`
                *,
                professional:users!professional_id (
                    profile_pic,
                    name,
                    last_name,
                    mp_access_token
                )
            `)
            .eq("id", quoteIdFromMessage)
            .in("status", ["pending", "accepted"]) // ¡Validación CRÍTICA!
            .single();

        if (quoteError) {
            console.error("Error al obtener la cotización desde el chat o no está en estado válido:", quoteError);
            // Si hay un error, o si .single() no encuentra nada (porque el status no coincide), devolvemos null.
            return null;
        }

        // 3. Formatear y devolver los datos usando la función auxiliar
        return formatQuoteData(quoteData);
    } 
    
    // --- Lógica original: si NO se provee chatId, buscar directamente por quoteId ---
    else {
        const { data: quoteData, error: quoteError } = await supabase
            .from("quotes")
            .select(`
                *,
                professional:users!professional_id (
                    profile_pic,
                    name,
                    last_name,
                    mp_access_token
                )
            `)
            .eq("id", quoteId)
            .in("status", ["pending", "accepted", "refused"]) // Aquí permitimos 'refused' también
            .single();

        if (quoteError) {
            console.error("Error al obtener cotización directa:", quoteError);
            throw quoteError;
        }

        // Formatear y devolver los datos usando la misma función auxiliar
        return formatQuoteData(quoteData);
    }
};