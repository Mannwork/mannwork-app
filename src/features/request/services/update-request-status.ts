import { supabase } from "@/common/lib/supabase/supabaseClient";

export const updateRequestStatus = async (status: string, requestId: string) => {
    const { data, error } = await supabase.from("requests").update({ status }).eq("id", requestId);
    const {data: data2, error: error2} = await supabase.from("chats").update({ status: "completed" }).eq("request_id", requestId);
    const {data: data3, error: error3} = await supabase.from("request_professionals").update({ status: "completed" }).eq("request_id", requestId).eq("status", "working");

    if (error || error2 || error3) {
        if (error3) {
            return {
                success: false,
                error: error2,
            }
        }


        if (error2) {
            return {
                success: false,
                error: error2,
            }
        }

        if (error) {
            return {
                success: false,
                error,
            }
        }
        
        return {
            success: false,
            error,
        }
    }

    return {
        success: true,
    }
}