import { Buyer, CompanyEvent } from '../types/buyer';

// Mock buyer database
export const MOCK_BUYERS: Buyer[] = [
    {
        id: 'buyer-1',
        name: 'Berlin Trading GmbH',
        email: 'procurement@berlintrading.de',
        company: 'Berlin Trading GmbH',
        country: 'Germany',
        phone: '+49 30 12345678',
        createdAt: '2024-12-01',
        companyId: 'company-1'
    },
    {
        id: 'buyer-2',
        name: 'H&M Global',
        email: 'sourcing@hm.com',
        company: 'H&M Global',
        country: 'Sweden',
        phone: '+46 8 796 5500',
        createdAt: '2024-12-05',
        companyId: 'company-1'
    },
    {
        id: 'buyer-3',
        name: 'Al Maya Group',
        email: 'imports@almaya.ae',
        company: 'Al Maya Group',
        country: 'UAE',
        phone: '+971 4 234 5678',
        createdAt: '2024-12-10',
        companyId: 'company-1'
    }
];

// Mock company events database
export const MOCK_COMPANY_EVENTS: CompanyEvent[] = [
    {
        id: 'event-1',
        companyId: 'company-1',
        type: 'ENQUIRY_CREATED',
        title: 'New Enquiry Created',
        description: 'ENQ-001 from Berlin Trading GmbH',
        actor: 'Rajesh Kumar',
        actorRole: 'Company Admin',
        timestamp: '2024-12-24T10:00:00Z'
    },
    {
        id: 'event-2',
        companyId: 'company-1',
        type: 'SHIPMENT_UPDATED',
        title: 'Shipment Status Updated',
        description: 'EXP-001 moved to CI & PL Approved',
        actor: 'Rajesh Kumar',
        actorRole: 'Company Admin',
        timestamp: '2024-12-23T15:30:00Z'
    },
    {
        id: 'event-3',
        companyId: 'company-1',
        type: 'BUYER_ADDED',
        title: 'New Buyer Added',
        description: 'Al Maya Group from UAE',
        actor: 'Rajesh Kumar',
        actorRole: 'Company Admin',
        timestamp: '2024-12-22T09:15:00Z'
    }
];

/**
 * Get all buyers for a company
 */
export function getCompanyBuyers(companyId: string): Buyer[] {
    return MOCK_BUYERS.filter(b => b.companyId === companyId);
}

/**
 * Get buyer by ID
 */
export function getBuyerById(buyerId: string): Buyer | undefined {
    return MOCK_BUYERS.find(b => b.id === buyerId);
}

/**
 * Add a new buyer
 */
export function addBuyer(buyer: Omit<Buyer, 'id' | 'createdAt'>): Buyer {
    const newBuyer: Buyer = {
        ...buyer,
        id: `buyer-${Date.now()}`,
        createdAt: new Date().toISOString()
    };

    MOCK_BUYERS.push(newBuyer);

    // Log event
    logCompanyEvent({
        companyId: buyer.companyId,
        type: 'BUYER_ADDED',
        title: 'New Buyer Added',
        description: `${buyer.name} from ${buyer.country}`,
        actor: 'Current User',
        actorRole: 'Company Admin'
    });

    return newBuyer;
}

/**
 * Get company events
 */
export function getCompanyEvents(companyId: string, limit?: number): CompanyEvent[] {
    const events = MOCK_COMPANY_EVENTS
        .filter(e => e.companyId === companyId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return limit ? events.slice(0, limit) : events;
}

/**
 * Log a company event
 */
export function logCompanyEvent(event: Omit<CompanyEvent, 'id' | 'timestamp'>): CompanyEvent {
    const newEvent: CompanyEvent = {
        ...event,
        id: `event-${Date.now()}`,
        timestamp: new Date().toISOString()
    };

    MOCK_COMPANY_EVENTS.unshift(newEvent);
    return newEvent;
}
