import { supabase } from "@/common/lib/supabase/supabaseClient";

interface Quote {
    request_id: string;
    client_id: string;
    professional_id: string;
    price: number;
    descriptionservice: string;
    status: "pending" | "accepted" | "rejected";
    durationestimate?: string;
    validuntil?: Date;
    work_date?: Date;
}

export const postNewQuote = async (quote: Quote) => {
    // Verificar si ya existe una cotización pendiente para este request y profesional
    const { data: existingQuote, error: fetchError } = await supabase
        .from("quotes")
        .select("*")
        .eq("request_id", quote.request_id)
        .eq("professional_id", quote.professional_id)
        .eq("status", "pending")
        .single();

    // Si hay un error que no sea "No rows found" (código PGRST116), lanzar el error
    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error al verificar cotizaciones existentes:", fetchError);
        throw fetchError;
    }

    // Si ya existe una cotización pendiente, actualizarla en lugar de crear una nueva
    if (existingQuote) {
        const { data: updatedQuote, error: updateError } = await supabase
            .from("quotes")
            .update(quote)
            .eq("id", existingQuote.id)
            .select()
            .single();

        if (updateError) {
            console.error("Error al actualizar cotización existente:", updateError);
            throw updateError;
        }

        await supabase.from("requests").update({
            status: "pending"
        }).eq("id", existingQuote.request_id)

        return updatedQuote;
    }

    // Si no existe una cotización pendiente, crear una nueva
    const { data: newQuote, error: insertError } = await supabase
        .from("quotes")
        .insert([quote])
        .select()
        .single();

    if (insertError) {
        console.error("Error al crear cotización:", insertError);
        throw insertError;
    }

    return newQuote;
};