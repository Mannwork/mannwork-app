import { Membership } from "./membership.interface";
import { Ubication } from "./ubication.interface";

export interface User {
    id: string;
    name: string;
    last_name: string;
    description: string | null;
    rol: "client" | "professional" | null;
    email: string;
    cel_phone: string | null;
    ubication_json: Ubication | null;
    service_radius: number;
    profile_pic: string;
    identification_pics_json: IdentificationPics | null;
    is_onboarding_complete: boolean;
    is_validated: boolean;
    is_banned: boolean;
    calification: number;
    total_requests: number;
    total_quotes: number;
    max_quotes: number;
    membership_json: Membership | null;
    last_connection: Date | null;
    created_at: Date;
    updated_at: Date;
    professions?: {
        category_id: number;
        subcategory_id: string;
        category_name: string;
        subcategory_name: string;
    }[];
    mp_access_token: string | null;
    is_mp_connected: boolean;
}

interface IdentificationPics {
    identification_front: string;
    identification_back: string;
    identification_selfie: string;
}