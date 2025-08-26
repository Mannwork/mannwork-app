import { supabase } from "@/common/lib/supabase/supabaseClient";

import type { Facturation } from "../interfaces/facturation.interface";

export const getRequestFacturation = async (requestId: string): Promise<Facturation> => {
    const {data: quote, error: quoteError} = await supabase.from("quotes").select("id").eq("request_id", requestId).eq("status", "accepted").single();

    if (quoteError) {
        console.error("Error fetching quote for request:", quoteError);
        throw new Error("Failed to fetch quote for request");
    }

    const {data, error} = await supabase.from("billing").select().eq("quote_id", quote.id).single();

    if (error) {
        console.error("Error fetching request facturation:", error);
        throw new Error("Failed to fetch request facturation");
    }

    return data;
}