import { supabase } from "@/common/lib/supabase/supabaseClient";

import type { RequestItem } from "../interfaces/request.interface";

export const getProfessionalRequest = async (proId: string, status: string[]): Promise<RequestItem[]> => {
    const { data: requestIdsData, error: idsError } = await supabase
        .from('request_professionals')
        .select('request_id')
        .eq('professional_id', proId)
        .in('status', ['selected', 'completed']);


    if (idsError) {
        console.error("Error fetching request IDs:", idsError);
        throw new Error(idsError.message);
    }

    const requestIds = requestIdsData.map(item => item.request_id);

     if (requestIds.length === 0) {
        return [];
    }

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
        .in("id", requestIds)
        .in("status", status)
        .order("inserted_at", { ascending: false });

    if (error) {
        console.error("Error fetching client requests:", error);
        throw new Error(error.message);
    }
    
    const formattedData = data.map((request: any) => ({
        ...request,
        category: request.category.name || "Sin categoría",
        subcategory: request.subcategory.name || "Sin subcategoría",
        userRole: "professional",
        location: JSON.parse(request.location),
        title: request.name,
        images: request.photos,
        createdAt: request.inserted_at
    }));

    return formattedData as RequestItem[];
}