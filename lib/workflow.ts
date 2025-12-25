export type Role = 'COMPANY_ADMIN' | 'COMPANY_EXPORT_ANALYST' | 'EXPORTER_ADMIN' | 'EXPORT_MANAGER' | 'CHA' | 'FINANCE';

export type ShipmentState =
    | 'ENQUIRY_RECEIVED'
    | 'QUOTE_SENT'
    | 'NEGOTIATION'
    | 'QUOTE_EXPIRED'
    | 'QUOTE_DRAFT'
    | 'QUOTE_ACCEPTED'
    | 'PO_RECEIVED'
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
    | 'CLOSED'
    | 'REJECTED';

export type ImportState =
    // Pre-Shipment (Supplier Engagement)
    | 'IMPORT_ENQUIRY_SENT'
    | 'IMPORT_QUOTE_RECEIVED'
    | 'IMPORT_NEGOTIATION'
    | 'IMPORT_QUOTE_ACCEPTED'
    | 'IMPORT_PI_APPROVED'
    | 'IMPORT_PAYMENT_SENT'
    // Risk & Compliance
    | 'IMPORT_INSURANCE_FILED'
    | 'IMPORT_PO_SENT'
    | 'IMPORT_COMPLIANCE_CHECK'
    // Shipping & Customs
    | 'IMPORT_GOODS_SHIPPED'
    | 'IMPORT_IN_TRANSIT'
    | 'IMPORT_ARRIVED_PORT'
    | 'IMPORT_DOCS_RECEIVED'
    | 'IMPORT_BOE_FILED'
    | 'IMPORT_CUSTOMS_ASSESSMENT'
    | 'IMPORT_DUTY_PAID'
    | 'IMPORT_CUSTOMS_CLEARANCE'
    // Post-Clearance
    | 'IMPORT_GOODS_RECEIVED'
    | 'IMPORT_QUALITY_CHECK'
    | 'IMPORT_RECONCILIATION'
    | 'IMPORT_CLOSED';

export type WorkflowType = 'EXPORT' | 'IMPORT';

export interface WorkflowStep {
    id: ShipmentState;
    label: string;
    description: string;
    allowedRoles: Role[]; // Roles that can ACT on this step
}

export interface ImportWorkflowStep {
    id: ImportState;
    label: string;
    description: string;
    allowedRoles: Role[];
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
        url?: string;
    }[];
}

export interface EnquiryData {
    id: string;
    message: string;
    quantity: string;
    expectations: string;
    timestamp: string;
}

export interface QuoteData {
    id: string;
    fileUrl: string; // For prototype this will be a placeholder or data URL
    fileType: 'PDF' | 'IMAGE';
    extractedData?: {
        price: string;
        currency: string;
        deliveryTerms: string;
        validUntil: string;
        leadTime: string;
    };
    aiConfidence?: number;
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

export interface ImportShipment {
    id: string;
    origin: string; // Country/port of origin
    status: ImportState;
    goods: string;
    value: string;
    supplier: string;
    messages: Message[];
    validUntil?: string;
    chaMode?: 'EMBEDDED' | 'MANUAL';
    selectedChaId?: string;
    selectedChaName?: string;
    portOfEntry?: string; // Indian port
    enquiry?: EnquiryData;
    quotation?: QuoteData;
    history: {
        state: ImportState;
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
    { id: 'PO_RECEIVED', label: 'PO Received', description: 'Purchase Order received from buyer', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
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

export const IMPORT_WORKFLOW_STEPS: ImportWorkflowStep[] = [
    // Pre-Shipment (Supplier Engagement)
    { id: 'IMPORT_ENQUIRY_SENT', label: 'Enquiry Sent', description: 'Enquiry sent to supplier', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'IMPORT_QUOTE_RECEIVED', label: 'Quote Received', description: 'Quotation received from supplier', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'IMPORT_NEGOTIATION', label: 'Negotiation', description: 'Terms negotiation in progress', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'IMPORT_QUOTE_ACCEPTED', label: 'Quote Accepted', description: 'Terms finalized with supplier', allowedRoles: ['COMPANY_ADMIN', 'COMPANY_EXPORT_ANALYST'] },
    { id: 'IMPORT_PO_SENT', label: 'PO Sent', description: 'Purchase Order issued to supplier', allowedRoles: ['COMPANY_ADMIN'] },
    { id: 'IMPORT_PI_APPROVED', label: 'PI Approved', description: 'Proforma Invoice approved', allowedRoles: ['COMPANY_ADMIN'] },
    { id: 'IMPORT_PAYMENT_SENT', label: 'Payment Sent', description: 'Advance payment/LC opened', allowedRoles: ['COMPANY_ADMIN', 'FINANCE'] },

    // Risk & Compliance
    { id: 'IMPORT_INSURANCE_FILED', label: 'Insurance Filed', description: 'Marine insurance obtained', allowedRoles: ['COMPANY_EXPORT_ANALYST', 'COMPANY_ADMIN'] },
    { id: 'IMPORT_COMPLIANCE_CHECK', label: 'Compliance Check', description: 'Regulatory compliance verified', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },

    // Shipping & Customs
    { id: 'IMPORT_GOODS_SHIPPED', label: 'Goods Shipped', description: 'Goods dispatched by supplier', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'IMPORT_IN_TRANSIT', label: 'In Transit', description: 'Goods en route to India', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'IMPORT_ARRIVED_PORT', label: 'Arrived at Port', description: 'Goods arrived at Indian port', allowedRoles: ['COMPANY_EXPORT_ANALYST', 'CHA'] },
    { id: 'IMPORT_DOCS_RECEIVED', label: 'Docs Received', description: 'Original docs received from bank/supplier', allowedRoles: ['COMPANY_ADMIN', 'CHA'] },
    { id: 'IMPORT_BOE_FILED', label: 'BOE Filed', description: 'Bill of Entry filed with customs', allowedRoles: ['COMPANY_EXPORT_ANALYST', 'CHA'] },
    { id: 'IMPORT_CUSTOMS_ASSESSMENT', label: 'Customs Assessment', description: 'Duty assessment in progress', allowedRoles: ['CHA'] },
    { id: 'IMPORT_DUTY_PAID', label: 'Duty Paid', description: 'Import duty payment confirmed', allowedRoles: ['COMPANY_ADMIN', 'FINANCE'] },
    { id: 'IMPORT_CUSTOMS_CLEARANCE', label: 'Customs Cleared', description: 'Goods cleared by customs', allowedRoles: ['CHA'] },

    // Post-Clearance
    { id: 'IMPORT_GOODS_RECEIVED', label: 'Goods Received', description: 'Goods received at warehouse', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'IMPORT_QUALITY_CHECK', label: 'Quality Check', description: 'QC inspection completed', allowedRoles: ['COMPANY_EXPORT_ANALYST'] },
    { id: 'IMPORT_RECONCILIATION', label: 'Reconciliation', description: 'Financial reconciliation', allowedRoles: ['FINANCE', 'COMPANY_ADMIN'] },
    { id: 'IMPORT_CLOSED', label: 'Import Closed', description: 'Import transaction completed', allowedRoles: ['COMPANY_ADMIN'] },
];

export function isImportShipment(shipment: Shipment | ImportShipment): shipment is ImportShipment {
    return (shipment as ImportShipment).origin !== undefined;
}

export const getStepColor = (status: ShipmentState | ImportState) => {
    switch (status) {
        // Shared / Common colors
        case 'REJECTED':
        case 'QUOTE_EXPIRED':
        case 'ESCALATED':
            return 'slate';

        // Export Flow
        case 'ENQUIRY_RECEIVED':
        case 'QUOTE_SENT':
        case 'NEGOTIATION':
        case 'QUOTE_ACCEPTED':
        case 'PO_RECEIVED':
        case 'PI_APPROVED':
        case 'INSURANCE_FILED':
        case 'ECGC_COVER_OBTAINED':
            return 'blue';
        case 'PAYMENT_CONFIRMED':
        case 'CI_PL_APPROVED':
        case 'SB_PENDING_CHA':
        case 'SB_FILED':
            return 'purple';
        case 'CUSTOMS_QUERY':
        case 'LEO_GRANTED':
            return 'amber';
        case 'BL_APPROVED':
        case 'FINANCIAL_RECONCILIATION':
        case 'CLOSED':
            return 'emerald';

        // Import Flow
        case 'IMPORT_ENQUIRY_SENT':
        case 'IMPORT_QUOTE_RECEIVED':
        case 'IMPORT_NEGOTIATION':
        case 'IMPORT_QUOTE_ACCEPTED':
        case 'IMPORT_PO_SENT':
        case 'IMPORT_PI_APPROVED':
        case 'IMPORT_PAYMENT_SENT':
        case 'IMPORT_INSURANCE_FILED':
            return 'blue';
        case 'IMPORT_COMPLIANCE_CHECK':
        case 'IMPORT_GOODS_SHIPPED':
        case 'IMPORT_IN_TRANSIT':
        case 'IMPORT_ARRIVED_PORT':
        case 'IMPORT_DOCS_RECEIVED':
        case 'IMPORT_BOE_FILED':
            return 'purple';
        case 'IMPORT_CUSTOMS_ASSESSMENT':
        case 'IMPORT_DUTY_PAID':
            return 'amber';
        case 'IMPORT_CUSTOMS_CLEARANCE':
        case 'IMPORT_GOODS_RECEIVED':
        case 'IMPORT_QUALITY_CHECK':
        case 'IMPORT_RECONCILIATION':
        case 'IMPORT_CLOSED':
            return 'emerald';

        default:
            return 'blue';
    }
};

export const getProgressPercentage = (status: ShipmentState | ImportState) => {
    const stages: Record<string, number> = {
        // Export
        'ENQUIRY_RECEIVED': 5,
        'QUOTE_SENT': 10,
        'NEGOTIATION': 15,
        'QUOTE_ACCEPTED': 20,
        'PO_RECEIVED': 22,
        'PI_APPROVED': 25,
        'INSURANCE_FILED': 30,
        'ECGC_COVER_OBTAINED': 35,
        'PAYMENT_CONFIRMED': 40,
        'PROCUREMENT_INITIATED': 50,
        'GOODS_RECEIVED': 60,
        'CI_PL_APPROVED': 70,
        'SB_FILED': 80,
        'LEO_GRANTED': 90,
        'BL_APPROVED': 95,
        'FINANCIAL_RECONCILIATION': 98,
        'CLOSED': 100,

        // Import
        'IMPORT_ENQUIRY_SENT': 5,
        'IMPORT_QUOTE_RECEIVED': 10,
        'IMPORT_NEGOTIATION': 15,
        'IMPORT_QUOTE_ACCEPTED': 20,
        'IMPORT_PO_SENT': 22,
        'IMPORT_PI_APPROVED': 25,
        'IMPORT_PAYMENT_SENT': 30,
        'IMPORT_INSURANCE_FILED': 35,
        'IMPORT_COMPLIANCE_CHECK': 40,
        'IMPORT_GOODS_SHIPPED': 50,
        'IMPORT_IN_TRANSIT': 60,
        'IMPORT_ARRIVED_PORT': 70,
        'IMPORT_DOCS_RECEIVED': 72,
        'IMPORT_BOE_FILED': 75,
        'IMPORT_CUSTOMS_ASSESSMENT': 80,
        'IMPORT_DUTY_PAID': 85,
        'IMPORT_CUSTOMS_CLEARANCE': 90,
        'IMPORT_GOODS_RECEIVED': 95,
        'IMPORT_QUALITY_CHECK': 98,
        'IMPORT_RECONCILIATION': 99,
        'IMPORT_CLOSED': 100,

        'REJECTED': 0,
        'ESCALATED': 100 // Visual flag
    };
    return stages[status] || 5;
};

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
        status: 'ECGC_COVER_OBTAINED', // For testing Payment/FIRC Upload
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

export const MOCK_IMPORT_SHIPMENTS: ImportShipment[] = [
    {
        id: 'IMP-001',
        origin: 'Shanghai, China',
        status: 'IMPORT_ARRIVED_PORT', // Changed for testing BOE Upload
        goods: 'Electronic Components',
        value: '$45,000',
        supplier: 'Shanghai Electronics Co.',
        portOfEntry: 'JNPT, Mumbai',
        chaMode: 'EMBEDDED',
        messages: [],
        history: []
    },
    {
        id: 'IMP-002',
        origin: 'Seoul, South Korea',
        status: 'IMPORT_IN_TRANSIT',
        goods: 'Automotive Parts',
        value: '$82,000',
        supplier: 'Hyundai Auto Parts',
        portOfEntry: 'Chennai Port',
        chaMode: 'MANUAL',
        messages: [],
        history: []
    },
    {
        id: 'IMP-003',
        origin: 'Tokyo, Japan',
        status: 'IMPORT_CUSTOMS_CLEARANCE',
        goods: 'Precision Machinery',
        value: '¥12,500,000',
        supplier: 'Mitsubishi Heavy Industries',
        portOfEntry: 'JNPT, Mumbai',
        messages: [],
        history: []
    },
    {
        id: 'IMP-004',
        origin: 'Hamburg, Germany',
        status: 'IMPORT_ENQUIRY_SENT', // Changed from IMPORT_QUOTE_RECEIVED for testing
        goods: 'Industrial Chemicals',
        value: 'Pending',
        supplier: 'BASF AG',
        enquiry: {
            id: 'IMP-ENQ-004',
            message: "Dear Sales Team,\n\nWe are interested in importing high-grade industrial chemicals for our manufacturing unit in Gujarat, India.\n\nPlease provide a quotation for 500 Tons of Industrial Solvent Grade A.\n\nRequired Delivery: Ex-Works Hamburg\n\nRegards,\nSourching Manager\nEximley India",
            quantity: "500 Tons",
            expectations: "Ex-Works, ISO Certified",
            timestamp: "2024-12-25T09:00:00Z"
        },
        messages: [
            {
                id: 'msg-imp-1',
                sender: 'BUYER', // In import, we are the buyer
                content: "Dear Sales Team,\n\nWe are interested in importing **high-grade industrial chemicals** for our manufacturing unit in Gujarat, India.\n\nPlease provide a quotation for **500 Tons** of Industrial Solvent Grade A.\n\nRequired Delivery: **Ex-Works Hamburg**\n\nRegards,\nSourching Manager\nEximley India",
                timestamp: "2024-12-25T09:00:00Z"
            }
        ],
        history: []
    },
    {
        id: 'IMP-005',
        origin: 'Dubai, UAE',
        status: 'IMPORT_PI_APPROVED', // Changed for testing Payment Upload
        goods: 'Textiles & Fabrics',
        value: 'Pending',
        supplier: 'Al Fahim Trading',
        portOfEntry: 'Mundra Port',
        messages: [],
        history: []
    },
    {
        id: 'IMP-006',
        origin: 'London, UK',
        status: 'IMPORT_GOODS_RECEIVED',
        goods: 'Luxury Watches',
        value: '$120,000',
        supplier: 'Bond St. Exports',
        portOfEntry: 'Mumbai Air Cargo',
        messages: [],
        history: []
    }
];
