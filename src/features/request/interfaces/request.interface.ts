export interface RequestItemLocation {
    address: string;
    city: string;
    province: string;
}

export interface RequestItemClient {
    name: string;
    last_name: string;
    id: string;
    profile_pic: string;
}

export interface RequestItemProfessional {
    id: string;
    name: string;
    last_name: string;
    rol: "professional";
    profile_pic: string;
}

export interface RequestItem {
    id: string;
    title: string;
    description: string;
    category: string; // Se espera el nombre, ej: "Plomería"
    subcategory: string; // Se espera el nombre, ej: "Reparación de cañerías"
    location: RequestItemLocation;
    images: string[];
    status: "searching" | "pending" | "payed" | "working" | "completed" | "cancelled" | "refunded";
    createdAt: Date;
    userRole: "professional" | "client";
    client: RequestItemClient;
    professionals: RequestItemProfessional[];
    reviewed?: boolean; // Indica si el usuario actual ya calificó esta solicitud
};