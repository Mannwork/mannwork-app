import { supabase } from "@/common/lib/supabase/supabaseClient";

export const postNewPro = async (requestId: string, prosIds: string[]) => {
     const professionalsToInsert = prosIds.map(proId => ({
        request_id: requestId,
        professional_id: proId,
        status: "selected"
    }));

    const { data, error } = await supabase
        .from("request_professionals")
        .insert(professionalsToInsert)
        .select();

    if (error) {
        console.error("Error inserting request professionals:", error);
        throw new Error(error.message);
    }

    return data;
}