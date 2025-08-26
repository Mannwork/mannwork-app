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
    categories,
    selected_subcategories
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

    let index = 0;

    for await (const category_id of categories) {
        const dataForInsertion = selected_subcategories[index].map(subcategory =>({
                user_id: userId,
                category_id: category_id,
                subcategory_id: subcategory
            }))

        const {error: intermediateTableError} = await supabase.from("user_professional_services").insert(dataForInsertion);

        if (intermediateTableError) {
            console.log("error en la intermedia", intermediateTableError);
            throw new Error("Error insertar los datos relacionados a la categoria: " + intermediateTableError.message);
        }

        index++;
    }

    if (error) {
        console.log("error en la tabla users", error);
        throw new Error("Error al completar los datos: " + error.message);
    }

    return data;
};