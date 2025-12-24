export type Role = 'COMPANY_ADMIN' | 'COMPANY_EXPORT_ANALYST' | 'EXPORTER_ADMIN' | 'EXPORT_MANAGER' | 'CHA' | 'FINANCE';

export type ShipmentState =
    | 'ENQUIRY_RECEIVED'
    | 'QUOTE_SENT'
    | 'NEGOTIATION'
    | 'QUOTE_EXPIRED'
    | 'QUOTE_ACCEPTED'
    | 'REJECTED'
    | 'QUOTE_DRAFT'
    | 'PI_APPROVED'
    | 'PAYMENT_CONFIRMED'
    // Risk Mitigation
    | 'INSURANCE_FILED'
    | 'ECGC_COVER_OBTAINED'
    // Procurement stages (optional - for trading companies)
    | 'PROCUREMENT_INITIATED'
    | 'SUPPLIER_SELECTED'
    | 'SUPPLIER_PO_SENT'
    | 'GOODS_IN_TRANSIT'
    | 'GOODS_RECEIVED'
    | 'QUALITY_CHECK_PASSED'
    // Export documentation
    | 'CI_PL_APPROVED'
    | 'SB_PENDING_CHA'
    | 'SB_FILED'
    | 'CUSTOMS_QUERY'
    | 'LEO_GRANTED'
    | 'BL_APPROVED'
    | 'FINANCIAL_RECONCILIATION'
    | 'ESCALATED'
    | 'CLOSED';

export interface WorkflowStep {
    id: ShipmentState;
    label: string;
    description: string;
    allowedRoles: Role[]; // Roles that can ACT on this step
}

export interface Message {
    id: string;
    sender: 'BUYER' | 'EXPORTER';
    content: string;
    timestamp: string;
    attachments?: {
        name: string;
        type: string;
        id: string;
    }[];
}

export interface EnquiryData {
    id: string;
    message: string;
    quantity: string;
    expectations: string;
    timestamp: string;
}

export interface Shipment {
    id: string;
    destination: string;
    status: ShipmentState;
    goods: string;
    value: string;
    buyer: string;
    enquiry?: EnquiryData;
    messages: Message[];
    validUntil?: string;
    chaMode?: 'EMBEDDED' | 'MANUAL';
    selectedChaId?: string;
    selectedChaName?: string;
    procurementRequired?: boolean; // true for trading companies, false for manufacturers with inventory
    history: {
        state: ShipmentState;
        timestamp: string;
        actor: string;
        role: Role;
        action: string;
    }[];
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
    { id: 'ENQUIRY_RECEIVED', label: 'Enquiry Received', description: 'Buyer enquiry received', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'QUOTE_SENT', label: 'Quotation Sent', description: 'Quotation sent to buyer', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'NEGOTIATION', label: 'Negotiation', description: 'Counter-offer received', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'QUOTE_EXPIRED', label: 'Quote Expired', description: 'Validity period passed', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'QUOTE_ACCEPTED', label: 'Quotation Accepted', description: 'Buyer confirmed quote', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'REJECTED', label: 'Rejected', description: 'Enquiry or Quotation rejected', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'PI_APPROVED', label: 'PI Approved', description: 'Proforma Invoice confirmed', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', description: 'Advance payment received', allowedRoles: ['COMPANY_ADMIN'] },
    { id: 'INSURANCE_FILED', label: 'Marine Insurance', description: 'Transit insurance cover obtained', allowedRoles: ['COMPANY_EXPORT_ANALYST', 'COMPANY_ADMIN'] },
    { id: 'ECGC_COVER_OBTAINED', label: 'ECGC Cover', description: 'Export Credit Guarantee secured', allowedRoles: ['COMPANY_EXPORT_ANALYST', 'COMPANY_ADMIN'] },

    // Procurement stages (optional - skip if you have inventory)
    { id: 'PROCUREMENT_INITIATED', label: 'Procurement Initiated', description: 'Started sourcing from supplier', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'SUPPLIER_SELECTED', label: 'Supplier Selected', description: 'Supplier finalized for order', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'SUPPLIER_PO_SENT', label: 'PO Sent to Supplier', description: 'Purchase order issued', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'GOODS_IN_TRANSIT', label: 'Goods in Transit', description: 'Goods being delivered from supplier', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'GOODS_RECEIVED', label: 'Goods Received', description: 'Goods received from supplier', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'QUALITY_CHECK_PASSED', label: 'Quality Check Passed', description: 'QC completed, ready for export', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },

    // Export documentation
    { id: 'CI_PL_APPROVED', label: 'CI & PL Approved', description: 'Commercial Invoice & Packing List', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'SB_PENDING_CHA', label: 'SB Pending', description: 'Shipping Bill with CHA', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'SB_FILED', label: 'SB Filed', description: 'Shipping Bill filed on ICEGATE', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'CUSTOMS_QUERY', label: 'Customs Query', description: 'Query raised by customs', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'LEO_GRANTED', label: 'LEO Granted', description: 'Let Export Order granted', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'BL_APPROVED', label: 'BL Approved', description: 'Bill of Lading confirmed', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'FINANCIAL_RECONCILIATION', label: 'Reconciliation', description: 'Ledger matching & final audit', allowedRoles: ['FINANCE', 'COMPANY_ADMIN'] },
    { id: 'ESCALATED', label: 'Escalated', description: 'High-priority intervention required', allowedRoles: ['COMPANY_ADMIN', 'EXPORTER_ADMIN'] },
    { id: 'CLOSED', label: 'Shipment Closed', description: 'E-BRC & reconciliation verified', allowedRoles: ['COMPANY_ADMIN'] },
];

export const MOCK_SHIPMENTS: Shipment[] = [
    {
        id: 'ENQ-001',
        destination: 'Hamburg, Germany',
        status: 'ENQUIRY_RECEIVED',
        goods: 'Handmade Ceramic Bowls',
        value: 'Pending',
        buyer: 'Berlin Trading GmbH',
        validUntil: '2025-05-15',
        chaMode: 'EMBEDDED',
        enquiry: {
            id: 'ENQ-001',
            message: "Dear Sir / Madam,\n\nWe are interested in sourcing 2,000 units of handmade ceramic bowls for delivery to Hamburg, Germany.\n\nPlease share your best FOB quotation, estimated delivery timeline, and packing details.\n\nRegards,\nProcurement Team\nBerlin Trading GmbH",
            quantity: "2,000 Units",
            expectations: "FOB, Premium Quality",
            timestamp: "2024-12-24T10:00:00Z"
        },
        messages: [
            {
                id: 'msg-1',
                sender: 'BUYER',
                content: "Dear Sir / Madam,\n\nWe are interested in sourcing **2,000 units of handmade ceramic bowls** for delivery to **Hamburg, Germany**.\n\nPlease share your **best FOB quotation**, estimated delivery timeline, and packing details.\n\nRegards,\nProcurement Team\nBerlin Trading GmbH",
                timestamp: "2024-12-24T10:00:00Z"
            }
        ],
        history: []
    },
    {
        id: 'EXP-001',
        destination: 'Hamburg, Germany',
        status: 'CI_PL_APPROVED',
        goods: 'Cotton T-Shirts (Organic)',
        value: '€45,000',
        buyer: 'H&M Global',
        messages: [],
        history: []
    },
    {
        id: 'EXP-002',
        destination: 'Dubai, UAE',
        status: 'SB_PENDING_CHA',
        goods: 'Basmati Rice (Premium)',
        value: '$12,500',
        buyer: 'Al Maya Group',
        messages: [],
        history: []
    },
    {
        id: 'EXP-003',
        destination: 'Tokyo, Japan',
        status: 'CUSTOMS_QUERY',
        goods: 'Handcrafted Silk Scarves',
        value: '¥850,000',
        buyer: 'Mitsukoshi Ltd.',
        messages: [
            { id: 'm-cq-1', sender: 'EXPORTER', content: 'Customs queried the HSN code. Please provide technical specs.', timestamp: new Date().toISOString() }
        ],
        history: []
    },
    {
        id: 'EXP-004',
        destination: 'New York, USA',
        status: 'SB_FILED',
        goods: 'Leather Handbags',
        value: '$28,000',
        buyer: 'Macy\'s Inc.',
        messages: [],
        history: []
    },
    {
        id: 'EXP-005',
        destination: 'London, UK',
        status: 'LEO_GRANTED',
        goods: 'Assam Tea Blends',
        value: '£12,000',
        buyer: 'Fortnum & Mason',
        messages: [],
        history: []
    }
];
