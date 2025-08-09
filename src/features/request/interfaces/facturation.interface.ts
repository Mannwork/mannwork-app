export interface Facturation {
    id: string;
    type: "request" | "subscription" | "platform";
    request_id: string;
    user_id: string;
    amount: number;
    invoice_url: string;
    created_at: string;
}