import { create } from "zustand";

import { User } from "@/common/types/user.interface";

export interface AuthStore extends Pick<User, "rol" | "cel_phone" | "ubication_json" | "service_radius" | "name" | "last_name" | "profile_pic">{
    categories: number[];
    selected_subcategories: string[][];
    setData: (key: keyof AuthStore, value: string | string[] | string[][]) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    rol: null,
    cel_phone: null,
    ubication_json: null,
    service_radius: 0,
    name: "",
    last_name: "",
    profile_pic: "",
    categories: [],
    selected_subcategories: [],

    setData: (key, value) => {
        set({ [key]: value })
        console.log(get());
        
    },
}));