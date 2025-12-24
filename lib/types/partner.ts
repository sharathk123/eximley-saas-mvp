export type PartnerType = 'BUYER' | 'SUPPLIER' | 'CHA_AGENT';

export interface Partner {
    id: string;
    name: string;
    type: PartnerType;
    email: string;
    phone?: string;
    country: string;
    address?: string;
    companyId: string; // The company that owns this partner relationship
    createdAt: string;

    // Type-specific metadata
    metadata: {
        // For Buyers
        industry?: string;
        taxId?: string;

        // For Suppliers
        products?: string[];
        complianceStatus?: 'VERIFIED' | 'PENDING' | 'EXPIRED';

        // For CHA Agents
        licenseNumber?: string;
        authorizedPorts?: string[];
        experienceYears?: number;
    };
}
