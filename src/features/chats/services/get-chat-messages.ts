import { supabase } from "@/common/lib/supabase/supabaseClient";

const MESSAGES_PER_PAGE = 20;

export const getChatMessages = async ({
    chatId,
    pageParam = 1,
}: {
    chatId: string;
    pageParam: number;
}) => {
    const from = (pageParam - 1) * MESSAGES_PER_PAGE;
    const to = from + MESSAGES_PER_PAGE - 1;

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) throw error;

    return data;
};