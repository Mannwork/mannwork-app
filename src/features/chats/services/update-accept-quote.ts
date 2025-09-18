import { supabase } from "@/common/lib/supabase/supabaseClient";

export const updateAcceptQuote = async (requestId: string, quoteId:string) => {
    const { error: requestError } = await supabase.from("requests").update({ status: "working" }).eq("id", requestId);

    if (requestError) {
        console.error("Error updating request status:", requestError);
        
        return {
            success: false,
            error: requestError,
        }
    }

    const {error: chatError} = await supabase.from("chats").update({ status: "active" }).eq("request_id", requestId);

    if (chatError) {
        console.error("Error updating chat status:", chatError);
        return {
            success: false,
            error: chatError,
        }
    }

    const {error: quoteError} = await supabase.from("quotes").update({ status: "accepted" }).eq("request_id", requestId).eq("id", quoteId);

    if (quoteError) {
        console.error("Error accepting quote:", quoteError);
        return {
            success: false,
            error: quoteError,
        }
    }

    return {
        success: true,
    }
}