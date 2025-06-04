import { create } from "zustand";

interface AuthStore {
    role: "client" | "professional" | null;

    setData: (key: keyof AuthStore, value: string) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    role: null,

    setData: (key, value) => set({ [key]: value }),
}));