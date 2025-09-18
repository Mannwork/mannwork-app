import { supabase } from "@/common/lib/supabase/supabaseClient";

export const refuseQuote = async (requestId: string) => {
    const {error: quoteError} = await supabase.from("quotes").update({ status: "refused" }).eq("request_id", requestId);

    if (quoteError) {
        console.error("Error refusing quote:", quoteError);
        
        throw new Error("Error refusing quote", { cause: quoteError });
    }

    return {
        success: true,
    }
}