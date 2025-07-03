import { supabase } from "@/common/lib/supabase/supabaseClient";

import type { AuthStore } from "../store/auth.store";

export const postCompleteUserData = async ({
    userId,
    name,
    last_name,
    cel_phone,
    rol,
    profile_pic,
    ubication_json,
    service_radius,
}: Omit<AuthStore, "setData"> & { userId: string }) => {
    const { data, error } = await supabase
        .from("users")
        .update({
            name,
            last_name,
            cel_phone,
            rol,
            profile_pic,
            ubication_json,
            service_radius,
            is_onboarding_complete: true,
        })
        .eq("id", userId)
        .select()
        .single();

    if (error) {
        console.log(error);
        throw new Error("Error al completar los datos: " + error.message);
    }

    return data;
};