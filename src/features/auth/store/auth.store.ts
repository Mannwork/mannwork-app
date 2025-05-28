import { create } from "zustand";

interface AuthStore {
    email: string;
    password: string;

    setData: (key: keyof AuthStore, value: string) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    email: "",
    password: "",

    setData: (key, value) => set({ [key]: value }),
}));