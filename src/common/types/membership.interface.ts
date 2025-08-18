export interface Membership {
    isPro: boolean;
    isFeatured: boolean;
    extraQuotesLimit: number;
    hasProBadge: boolean;
    hasPrioritySupport: boolean;
    hasAdvancedAnalytics: boolean;
    searchPriority: number;
    /**
    * ID de la suscripción en el proveedor de pagos (Stripe, etc.)
    */
    subscriptionId: string | null;
    status: 'active' | 'cancelled' | 'expired' | 'pending' | 'past_due';
    autoRenew: boolean;
    nextBillingDate: Date | null;
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly';
    startingDate: Date;
    endDate: Date | null;
}