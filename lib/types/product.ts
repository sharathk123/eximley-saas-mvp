export interface Product {
    id: string;
    name: string;
    description: string;
    hsCode: string; // 8-digit ITC format: XXXX.XX.XX
    hsCodeConfidence?: number;
    category: string;
    unitOfMeasure: string;
    originCountry: string;
    weight?: number;
    dimensions?: { length: number; width: number; height: number };
    createdAt: string;
    updatedAt: string;
    status: 'ACTIVE' | 'ARCHIVED';
}

export interface ITCHSCodeSuggestion {
    code: string; // 8-digit: e.g., "8471.30.10"
    description: string;
    confidence: number;
    gstRate: string; // GST rate: 0%, 5%, 12%, 18%, 28%
    dutyRates: {
        bcd: string; // Basic Customs Duty
        igst: string; // Integrated GST
        cess?: string; // Additional cess if applicable
    };
    chapter: string; // Chapter number (first 2 digits)
    heading: string; // Heading (first 4 digits)
}

export type ProductCategory =
    | 'Electronics'
    | 'Textiles'
    | 'Machinery'
    | 'Chemicals'
    | 'Agricultural'
    | 'Automotive'
    | 'Pharmaceuticals'
    | 'Other';

export type UnitOfMeasure =
    | 'KGS' // Kilograms
    | 'LTR' // Liters
    | 'MTR' // Meters
    | 'PCS' // Pieces
    | 'SET' // Sets
    | 'TON' // Metric Tons
    | 'BOX' // Boxes
    | 'CTN'; // Cartons
