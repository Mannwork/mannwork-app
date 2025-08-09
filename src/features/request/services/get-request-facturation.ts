import { supabase } from "@/common/lib/supabase/supabaseClient";

import type { Facturation } from "../interfaces/facturation.interface";

export const getRequestFacturation = async (requestId: string): Promise<Facturation> => {
    const {data, error} = await supabase.from("billing").select().eq("request_id", requestId).single();

    if (error) {
        console.error("Error fetching request facturation:", error);
        throw new Error("Failed to fetch request facturation");
    }

    return data;
}