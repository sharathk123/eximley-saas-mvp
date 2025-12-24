/**
 * Master Data Constants for Eximley
 * Includes: Incoterms, Payment Terms, Ports, Countries, Currencies, and UOM
 */

export const INCOTERMS = [
    { code: 'EXW', name: 'Ex Works', responsibility: 'Buyer' },
    { code: 'FCA', name: 'Free Carrier', responsibility: 'Shared' },
    { code: 'CPT', name: 'Carriage Paid To', responsibility: 'Seller' },
    { code: 'CIP', name: 'Carriage and Insurance Paid To', responsibility: 'Seller' },
    { code: 'DAP', name: 'Delivered at Place', responsibility: 'Seller' },
    { code: 'DPU', name: 'Delivered at Place Unloaded', responsibility: 'Seller' },
    { code: 'DDP', name: 'Delivered Duty Paid', responsibility: 'Seller' },
    { code: 'FAS', name: 'Free Alongside Ship', responsibility: 'Buyer' },
    { code: 'FOB', name: 'Free On Board', responsibility: 'Shared' },
    { code: 'CFR', name: 'Cost and Freight', responsibility: 'Seller' },
    { code: 'CIF', name: 'Cost, Insurance and Freight', responsibility: 'Seller' },
];

export const PAYMENT_TERMS = [
    { code: 'ADVANCE_100', label: '100% Advance Payment' },
    { code: 'ADVANCE_30_70', label: '30% Advance / 70% against BL' },
    { code: 'LC_AT_SIGHT', label: 'L/C at Sight' },
    { code: 'LC_USANCE', label: 'L/C Usance (30/60/90 Days)' },
    { code: 'DP', label: 'Documents Against Payment (D/P)' },
    { code: 'DA_30', label: 'Documents Against Acceptance (D/A) 30 Days' },
    { code: 'DA_60', label: 'Documents Against Acceptance (D/A) 60 Days' },
    { code: 'DA_90', label: 'Documents Against Acceptance (D/A) 90 Days' },
    { code: 'OPEN_ACCOUNT', label: 'Open Account' },
];

export const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

export const COUNTRIES = [
    { code: 'IN', name: 'India', region: 'Asia' },
    { code: 'US', name: 'United States', region: 'North America' },
    { code: 'GB', name: 'United Kingdom', region: 'Europe' },
    { code: 'DE', name: 'Germany', region: 'Europe' },
    { code: 'AE', name: 'United Arab Emirates', region: 'Middle East' },
    { code: 'CN', name: 'China', region: 'Asia' },
    { code: 'JP', name: 'Japan', region: 'Asia' },
    { code: 'SG', name: 'Singapore', region: 'Asia' },
    { code: 'AU', name: 'Australia', region: 'Oceania' },
    { code: 'CA', name: 'Canada', region: 'North America' },
    { code: 'FR', name: 'France', region: 'Europe' },
    { code: 'SA', name: 'Saudi Arabia', region: 'Middle East' },
];

export const PORTS = {
    SEA: [
        { code: 'INNSA', name: 'Nhava Sheva (JNPT)', country: 'India' },
        { code: 'INMUN', name: 'Mundra', country: 'India' },
        { code: 'INMAA', name: 'Chennai', country: 'India' },
        { code: 'DEHAM', name: 'Hamburg', country: 'Germany' },
        { code: 'NLRTM', name: 'Rotterdam', country: 'Netherlands' },
        { code: 'CNSHA', name: 'Shanghai', country: 'China' },
        { code: 'SGSIN', name: 'Singapore', country: 'Singapore' },
        { code: 'AEDXB', name: 'Jebel Ali', country: 'UAE' },
        { code: 'USNYC', name: 'New York', country: 'USA' },
        { code: 'USLAX', name: 'Los Angeles', country: 'USA' },
    ],
    AIR: [
        { code: 'BOM', name: 'Mumbai (BOM)', country: 'India' },
        { code: 'DEL', name: 'Delhi (DEL)', country: 'India' },
        { code: 'LHR', name: 'London Heathrow (LHR)', country: 'UK' },
        { code: 'FRA', name: 'Frankfurt (FRA)', country: 'Germany' },
        { code: 'DXB', name: 'Dubai International (DXB)', country: 'UAE' },
        { code: 'JFK', name: 'New York (JFK)', country: 'USA' },
        { code: 'PVG', name: 'Shanghai Pudong (PVG)', country: 'China' },
        { code: 'SIN', name: 'Changi (SIN)', country: 'Singapore' },
    ]
};

export const UNIT_OF_MEASURE = [
    { code: 'KGS', name: 'Kilograms' },
    { code: 'LTR', name: 'Liters' },
    { code: 'MTR', name: 'Meters' },
    { code: 'PCS', name: 'Pieces' },
    { code: 'SET', name: 'Sets' },
    { code: 'TON', name: 'Metric Tons' },
    { code: 'BOX', name: 'Boxes' },
    { code: 'CTN', name: 'Cartons' },
    { code: 'SQM', name: 'Square Meters' },
    { code: 'ROL', name: 'Rolls' },
];

export const PRODUCT_CATEGORIES = [
    'Electronics',
    'Textiles',
    'Machinery',
    'Chemicals',
    'Agricultural',
    'Automotive',
    'Pharmaceuticals',
    'Handicrafts',
    'Footwear',
    'Jewellery',
    'Metals',
    'Other'
];

export const SHIPPING_MODES = [
    { code: 'SEA', name: 'Ocean Freight' },
    { code: 'AIR', name: 'Air Freight' },
    { code: 'ROAD', name: 'Road Transport' },
    { code: 'RAIL', name: 'Rail Transport' },
];

export const CONTAINER_TYPES = [
    { code: '20GP', name: '20ft General Purpose' },
    { code: '40GP', name: '40ft General Purpose' },
    { code: '40HC', name: '40ft High Cube' },
    { code: '20RF', name: '20ft Reefer' },
    { code: '40RF', name: '40ft Reefer' },
    { code: '20OT', name: '20ft Open Top' },
    { code: '40OT', name: '40ft Open Top' },
    { code: '20FR', name: '20ft Flat Rack' },
    { code: '40FR', name: '40ft Flat Rack' },
];
