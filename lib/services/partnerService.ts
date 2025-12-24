import { Partner, PartnerType } from '../types/partner';

// Mock partner database
export const MOCK_PARTNERS: Partner[] = [
    {
        id: 'p1',
        name: 'Nexus Tech GMBH',
        type: 'BUYER',
        email: 'procurement@nexustech.de',
        country: 'Germany',
        companyId: 'company-1',
        createdAt: '2024-12-01',
        metadata: {
            industry: 'Technology',
            taxId: 'DE123456789'
        }
    },
    {
        id: 'p2',
        name: 'Oceanic Fabrics Ltd',
        type: 'SUPPLIER',
        email: 'sales@oceanicfabrics.vn',
        country: 'Vietnam',
        companyId: 'company-1',
        createdAt: '2024-12-05',
        metadata: {
            products: ['Cotton', 'Polyester'],
            complianceStatus: 'VERIFIED'
        }
    },
    {
        id: 'p3',
        name: 'FastTrack Logistics & CHA',
        type: 'CHA_AGENT',
        email: 'ops@fasttrackcha.in',
        country: 'India',
        companyId: 'company-1',
        createdAt: '2024-12-10',
        metadata: {
            licenseNumber: 'CHA/2024/IND/99',
            authorizedPorts: ['Nhava Sheva', 'Mundra'],
            experienceYears: 15
        }
    }
];

/**
 * Get partners for a specific company and type
 */
export function getPartners(companyId: string, type?: PartnerType): Partner[] {
    return MOCK_PARTNERS.filter(p => p.companyId === companyId && (!type || p.type === type));
}

/**
 * Add a new partner
 */
export function addPartner(partner: Omit<Partner, 'id' | 'createdAt'>): Partner {
    const newPartner: Partner = {
        ...partner,
        id: `partner-${Date.now()}`,
        createdAt: new Date().toISOString()
    };
    MOCK_PARTNERS.push(newPartner);
    return newPartner;
}

/**
 * Get partner by ID
 */
export function getPartnerById(id: string): Partner | undefined {
    return MOCK_PARTNERS.find(p => p.id === id);
}
