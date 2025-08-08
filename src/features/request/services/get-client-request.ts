import { supabase } from "@/common/lib/supabase/supabaseClient";

import type { RequestItem } from "../interfaces/request.interface";

// Se ajusta el tipo de retorno a un array: Promise<RequestItem[]>
export const getClientRequests = async (clientId: string, status: string[]): Promise<RequestItem[]> => {
    const { data, error } = await supabase
        .from("requests")
        .select(`
            id,
            name,
            description,
            location,
            photos,
            status,
            inserted_at,
            category: categories(name),
            subcategory: subcategories(name),
            client: users!requests_client_fkey(id, name, last_name, profile_pic),
            professionals: request_professionals(...users(id, name, last_name, rol, profile_pic))
        `)
        .eq("client", clientId)
        .in("status", status)
        .order("inserted_at", { ascending: false });

    if (error) {
        console.error("Error fetching client requests:", error);
        throw new Error(error.message);
    }
    
    // Supabase devuelve { category: { name: '...' } }. Necesitamos aplanarlo.
    const formattedData = data.map((request: any) => ({
        ...request,
        category: request.category.name || "Sin categoría",
        subcategory: request.subcategory.name || "Sin subcategoría",
        userRole: "client",
        location: JSON.parse(request.location),
        title: request.name,
        images: request.photos,
        createdAt: request.inserted_at
    }));

    return formattedData as RequestItem[];
}