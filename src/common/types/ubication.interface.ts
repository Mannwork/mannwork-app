export interface Ubication {
    province: string;
    city: string;
    street: string;
    type?: "house" | "apartment" | "other";
    floor?: string | null;
    apartmentNumber?: string | null;
    postalCode?: string;
    latitude: number;
    longitude: number;
    serviceRange?: number;
    address?: string
}