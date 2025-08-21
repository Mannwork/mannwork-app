import { supabase } from "@/common/lib/supabase/supabaseClient";

const MESSAGES_PER_PAGE = 20;

export const getChatData = async ({
    chatId,
    pageParam = 1,
}: {
    chatId: string;
    pageParam: number;
}) => {
    // --- Paso 1: Obtener el request_id del chat actual ---
    // Esta consulta es muy rápida y necesaria para las siguientes.
    const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .select("request_id")
        .eq("id", chatId)
        .single(); // .single() para obtener un solo objeto en lugar de un array

    if (chatError) {
        console.error("Error fetching chat details:", chatError);
        throw new Error("Could not find the associated request for this chat.");
    }

    const requestId = chatData.request_id;

    // --- Paso 2: Preparar las dos consultas que se ejecutarán en paralelo ---

    // Consulta para los mensajes (la que ya tenías)
    const from = (pageParam - 1) * MESSAGES_PER_PAGE;
    const to = from + MESSAGES_PER_PAGE - 1;
    const getMessagesPromise = supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: false })
        .range(from, to);

    // Consulta para verificar si existe una cotización activa ('pending' o 'accepted')
    // Usamos { count: 'exact', head: true } para que sea súper eficiente.
    // No trae los datos, solo nos dice cuántos registros coinciden (0 o más).
    const checkQuotePromise = supabase
        .from("quotes")
        .select("id", { count: "exact", head: true })
        .eq("request_id", requestId)
        .in("status", ["pending", "accepted"]);


    // --- Paso 3: Ejecutar ambas consultas en paralelo y manejar los resultados ---

    const [messagesResult, quoteStatusResult] = await Promise.all([
        getMessagesPromise,
        checkQuotePromise,
    ]);

    // Manejo de errores de las consultas en paralelo
    if (messagesResult.error) {
        console.log("Error fetching messages:", messagesResult.error);
        
        throw messagesResult.error
    };
    if (quoteStatusResult.error) {
        console.log("Error checking quote status:", quoteStatusResult.error);

        throw quoteStatusResult.error
    };

    // Determinar si existe una cotización activa.
    // El 'count' será > 0 si se encontró al menos una cotización.
    const hasActiveQuote = (quoteStatusResult.count ?? 0) > 0;

    // Devolver un objeto con toda la información necesaria para la UI
    return {
        messages: messagesResult.data,
        hasActiveQuote: hasActiveQuote,
    };
};