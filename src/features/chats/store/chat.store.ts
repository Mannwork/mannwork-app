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
    chatId?: string;
}

interface ChatStore {
    actualChatData: ActualChatData;
    setActualChatData: (data: ActualChatData) => void;
    searchText: string;
    setSearchText: (text: string) => void;
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
    searchText: "",
    setSearchText: (text: string) => {
        set({ searchText: text });
    },
}))