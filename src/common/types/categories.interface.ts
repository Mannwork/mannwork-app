export interface Category {
    id: number;
    name: string;
    icon_url: string;
    sub_categories: string[];
    created_at: string;
    updated_at: string;
  }
  
  export interface CategorySearchResult {
    category: string;
    subcategory: string;
    isSubcategory: boolean;
  }

  export const categoryIcons: Record<string, string> = {
    Carpintero: "carpenter",
    Plomero: "plumbing",
    Técnico: "build",
    Albañil: "construction",
    Tapicero: "weekend",
    Limpieza: "cleaning-services",
    Colocador: "handyman",
    Electricista: "electrical-services",
    Gasista: "local-fire-department",
    Pintor: "format-paint",
    Mudancero: "local-shipping",
    Reformas: "home-repair-service",
    Cerrajero: "vpn-key",
    Jardinero: "yard",
    Arquitecto: "architecture",
    Herrero: "hardware",
    Decorador: "style",
    "Control de plagas": "bug-report",
    Seguridad: "security",
    Piletas: "pool",
    Bienestar: "self-improvement",
    Cuidadores: "face",
    Mascotas: "pets",
    "A/A": "ac-unit",
    Belleza: "spa",
    Autos: "directions-car",
    Eventos: "celebration",
};