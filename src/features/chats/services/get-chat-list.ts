import { supabase } from "@/common/lib/supabase/supabaseClient";

interface Params {
    userId: string;
    pageParam?: number;
}

const CHATS_PER_PAGE = 10;

export const getChatList = async ({ userId, pageParam = 1 }: Params) => {
    const from = (pageParam - 1) * CHATS_PER_PAGE;
    const to = from + CHATS_PER_PAGE - 1;

    const { data, error } = await supabase.from("chats")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) throw error;

    return data;
};
