import { supabase } from "@/common/lib/supabase/supabaseClient";

export const updateRequestStatus = async (status: string, requestId: string) => {
    const { data: requestData, error: requestError } = await supabase.from("requests").update({ status }).eq("id", requestId).select("client").single();
    const { error: chatError} = await supabase.from("chats").update({ status: "completed" }).eq("request_id", requestId);

    if (status === "completed") {
        const {data:intermediateData, error: intermediateError} = await supabase.from("request_professionals").update({ status: "completed" }).eq("request_id", requestId).eq("status", "working").select("professional_id").single();
        
        if (intermediateError) {
            return {
                success: false,
                error: intermediateError,
            }
        }

        const { error: notificationError } = await supabase.from("notifications").insert({
            user_id: intermediateData?.professional_id || null,
            title: "Solicitud completada",
            body: "La solicitud ha sido marcada como completada.",
            type: "request_completed",
            redirect_id: requestId,
            creator_id: requestData?.client || null,
        });

        if (notificationError) {
            console.error("Error al crear notificación:", notificationError);
            console.error("Notificación de error:", notificationError.message);
            
            throw notificationError
        };
    }

    if (status === "cancelled") {
        const {data: intermediateData, error: intermediateError} = await supabase.from("request_professionals").update({ status: "cancelled" }).eq("request_id", requestId).select("professional_id");
        
        if (intermediateError) {
            console.error("Error al actualizar profesionales asociados a la solicitud:", intermediateError);
            
            return {
                success: false,
                error: intermediateError,
            }
        }

        const notificationsData = intermediateData?.map((item) => (
            {
                user_id: item.professional_id || null,
                title: "Solicitud cancelada",
                body: "La solicitud ha sido cancelada por el cliente.",
                type: "request_cancelled",
                redirect_id: requestId,
                creator_id: requestData?.client || null,
            }
        ));
        
         const { error: notificationError } = await supabase.from("notifications").insert(notificationsData);

        if (notificationError) {
            console.error("Error al crear notificación:", notificationError);
            console.error("Notificación de error:", notificationError.message);
            
            throw notificationError
        };
    }

    if (requestError || chatError) {
        if (chatError) {
            console.error("Error al actualizar el chat:", chatError);
            return {
                success: false,
                error: chatError,
            }
        }

        if (requestError) {
            console.error("Error al actualizar la solicitud:", requestError);
            
            return {
                success: false,
                requestError,
            }
        }
    }

    return {
        success: true,
    }
}