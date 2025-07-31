import { supabase } from "@/common/lib/supabase/supabaseClient";

export const getQuote = async (quoteId: string) => {
    // Get the quote with professional details directly from users table
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
        .single();

    if (quoteError) {
        console.error("Error al obtener cotización:", quoteError);
        throw quoteError;
    }

    // Extract the nested user data and add it to the root level
    const { professional, ...quote } = quoteData;
    
    return {
        ...quote,
        professionalName: professional?.name + " " + professional?.last_name.split("")[0] + "." || 'Profesional',
        professionalAvatar: professional?.profile_pic || null,
        professionalAccessToken: professional?.mp_access_token || ""
    };
};