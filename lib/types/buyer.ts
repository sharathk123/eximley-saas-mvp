export interface Buyer {
    id: string;
    name: string;
    email: string;
    company: string;
    country: string;
    phone?: string;
    address?: string;
    createdAt: string;
    companyId: string; // Which company added this buyer
}

export interface CompanyEvent {
    id: string;
    companyId: string;
    type: 'ENQUIRY_CREATED' | 'SHIPMENT_UPDATED' | 'USER_INVITED' | 'BUYER_ADDED' | 'PRODUCT_ADDED' | 'SETTINGS_UPDATED';
    title: string;
    description: string;
    actor: string; // User who performed the action
    actorRole: string;
    timestamp: string;
    metadata?: Record<string, any>;
}
