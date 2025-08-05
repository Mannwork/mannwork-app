import { supabase } from "@/common/lib/supabase/supabaseClient";

export const updateRefuseRequest = async (requestId: string, professionalId: string) => {
    try {
        const { data, error } = await supabase
            .from('request_professionals')
            .update({ status: 'refused' })
            .eq('request_id', requestId)
            .eq('professional_id', professionalId).select();

        if (error) {
            throw error;
        }

        return data;
    } catch (e) {
        console.error('Error al actualizar la solicitud:', e);
    }
}