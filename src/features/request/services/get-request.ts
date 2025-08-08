import { supabase } from "@/common/lib/supabase/supabaseClient";

import type { Ubication } from "@/common/types/ubication.interface";

export interface RequestInDb {
    id: string;
    category: number;
    subcategory: string;
    location: Pick<Ubication, "latitude" | "longitude" | "address">
}

export const getRequest = async (requestId: string): Promise<RequestInDb> => {
    const { data, error } = await supabase.from("requests").select().eq("id", requestId).single();

    if (error) {
        throw new Error("Error al obtener la solicitud: " + error.message);
    }

    return {...data, location: JSON.parse(data.location)};
};