import { supabase } from "@/common/lib/supabase/supabaseClient";

export const updateRequestStatus = async (status: string, requestId: string) => {
    const { data, error } = await supabase.from("requests").update({ status }).eq("id", requestId);

    if (error) {
        return {
            success: false,
            error,
        }
    }

    return {
        success: true,
    }
}