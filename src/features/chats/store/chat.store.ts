import { create } from "zustand";

interface ActualChatData {
    professionalName: string;
    professionalImage: string;
    mainCategory: string;
    subCategory: string;
    status: string;
    request_id?: string;
    client_id?: string;
    professional_id?: string;
}

interface ChatStore {
    actualChatData: ActualChatData;
    setActualChatData: (data: ActualChatData) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    actualChatData: {
        professionalName: "",
        professionalImage: "",
        mainCategory: "",
        subCategory: "",
        status: "",
        request_id: "",
        client_id: "",
        professional_id: "",
    },
    setActualChatData: (data: ActualChatData) => {
        set({ actualChatData: data });
    },
}))