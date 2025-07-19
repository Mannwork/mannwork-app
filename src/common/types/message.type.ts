export type Message = {
    id: string;
    chat_id: string;
    sender_id: string;
    type: "text" | "image" | "quote_request" | "quote";
    content: string;
    attachment_url?: string;
    is_read: boolean;
    created_at: string;
};