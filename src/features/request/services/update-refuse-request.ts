import { supabase } from "@/common/lib/supabase/supabaseClient";

export const updateRefuseRequest = async (requestId: string, professionalId: string) => {
    try {    
        const { data, error } = await supabase
            .from('request_professionals')
            .update({ status: 'refused' })
            .eq('request_id', requestId)
            .eq('professional_id', professionalId).select();

        const {data: requestData, error: requestError} = await supabase.from("requests").select("client").eq("id", requestId).single();

        if (error) {
            throw error;
        }
        if (requestError) {
            throw requestError;
        }

         const { error: notificationError } = await supabase.from("notifications").insert({
            user_id: requestData?.client || null,
            title: "Solicitud rechazada",
            body: "Uno de los profesionales ha rechazado tu solicitud.",
            type: "request_refused",
            redirect_id: requestId,
            creator_id: professionalId,
        });

        if (notificationError) {
            console.error("Error al crear notificación:", notificationError);
            console.error("Notificación de error:", notificationError.message);
            
            throw notificationError
        };

        return data;
    } catch (e) {
        console.error('Error al actualizar la solicitud:', e);
    }
}