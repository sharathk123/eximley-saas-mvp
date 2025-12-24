import { ITCHSCodeSuggestion } from '../types/product';

// Mock ITC HS Code database for common Indian EXIM products
const ITC_HS_DATABASE: Record<string, ITCHSCodeSuggestion[]> = {
    // Electronics
    'laptop': [
        {
            code: '8471.30.10',
            description: 'Portable automatic data processing machines, weighing not more than 10 kg',
            confidence: 95,
            gstRate: '18%',
            dutyRates: { bcd: '0%', igst: '18%' },
            chapter: '84',
            heading: '8471'
        },
        {
            code: '8471.30.90',
            description: 'Other portable automatic data processing machines',
            confidence: 85,
            gstRate: '18%',
            dutyRates: { bcd: '0%', igst: '18%' },
            chapter: '84',
            heading: '8471'
        }
    ],
    'mobile': [
        {
            code: '8517.12.10',
            description: 'Smartphones',
            confidence: 98,
            gstRate: '18%',
            dutyRates: { bcd: '20%', igst: '18%' },
            chapter: '85',
            heading: '8517'
        },
        {
            code: '8517.12.90',
            description: 'Other telephones for cellular networks',
            confidence: 90,
            gstRate: '18%',
            dutyRates: { bcd: '20%', igst: '18%' },
            chapter: '85',
            heading: '8517'
        }
    ],
    // Textiles
    'cotton': [
        {
            code: '5208.31.00',
            description: 'Plain weave cotton fabrics, dyed, weighing not more than 100 g/m²',
            confidence: 92,
            gstRate: '5%',
            dutyRates: { bcd: '10%', igst: '5%' },
            chapter: '52',
            heading: '5208'
        },
        {
            code: '5208.32.00',
            description: 'Plain weave cotton fabrics, dyed, weighing more than 100 g/m²',
            confidence: 88,
            gstRate: '5%',
            dutyRates: { bcd: '10%', igst: '5%' },
            chapter: '52',
            heading: '5208'
        }
    ],
    'garment': [
        {
            code: '6109.10.00',
            description: 'T-shirts, singlets and other vests, of cotton',
            confidence: 94,
            gstRate: '12%',
            dutyRates: { bcd: '20%', igst: '12%' },
            chapter: '61',
            heading: '6109'
        },
        {
            code: '6204.62.00',
            description: 'Women\'s or girls\' trousers, of cotton',
            confidence: 90,
            gstRate: '12%',
            dutyRates: { bcd: '20%', igst: '12%' },
            chapter: '62',
            heading: '6204'
        }
    ],
    // Machinery
    'pump': [
        {
            code: '8413.70.10',
            description: 'Centrifugal pumps',
            confidence: 93,
            gstRate: '18%',
            dutyRates: { bcd: '7.5%', igst: '18%' },
            chapter: '84',
            heading: '8413'
        },
        {
            code: '8413.81.00',
            description: 'Other pumps for liquids',
            confidence: 87,
            gstRate: '18%',
            dutyRates: { bcd: '7.5%', igst: '18%' },
            chapter: '84',
            heading: '8413'
        }
    ],
    // Agricultural
    'rice': [
        {
            code: '1006.30.10',
            description: 'Semi-milled or wholly milled rice, whether or not polished - Basmati rice',
            confidence: 96,
            gstRate: '0%',
            dutyRates: { bcd: '0%', igst: '0%' },
            chapter: '10',
            heading: '1006'
        },
        {
            code: '1006.30.90',
            description: 'Other semi-milled or wholly milled rice',
            confidence: 92,
            gstRate: '0%',
            dutyRates: { bcd: '0%', igst: '0%' },
            chapter: '10',
            heading: '1006'
        }
    ],
    'spices': [
        {
            code: '0904.21.00',
            description: 'Dried chillies, neither crushed nor ground',
            confidence: 94,
            gstRate: '0%',
            dutyRates: { bcd: '0%', igst: '0%' },
            chapter: '09',
            heading: '0904'
        },
        {
            code: '0909.61.00',
            description: 'Cumin seeds, neither crushed nor ground',
            confidence: 91,
            gstRate: '0%',
            dutyRates: { bcd: '0%', igst: '0%' },
            chapter: '09',
            heading: '0909'
        }
    ],
    // Chemicals
    'plastic': [
        {
            code: '3920.10.10',
            description: 'Plates, sheets, film, foil and strip, of polymers of ethylene',
            confidence: 90,
            gstRate: '18%',
            dutyRates: { bcd: '10%', igst: '18%' },
            chapter: '39',
            heading: '3920'
        },
        {
            code: '3920.20.10',
            description: 'Plates, sheets, film, foil and strip, of polymers of propylene',
            confidence: 88,
            gstRate: '18%',
            dutyRates: { bcd: '10%', igst: '18%' },
            chapter: '39',
            heading: '3920'
        }
    ],
    // Automotive
    'car': [
        {
            code: '8703.23.11',
            description: 'Motor cars with spark-ignition engine, 1000-1500 cc',
            confidence: 92,
            gstRate: '28%',
            dutyRates: { bcd: '30%', igst: '28%', cess: '1-22%' },
            chapter: '87',
            heading: '8703'
        },
        {
            code: '8703.24.11',
            description: 'Motor cars with spark-ignition engine, 1500-3000 cc',
            confidence: 89,
            gstRate: '28%',
            dutyRates: { bcd: '30%', igst: '28%', cess: '15-22%' },
            chapter: '87',
            heading: '8703'
        }
    ]
};

/**
 * Simulates AI-powered ITC HS Code lookup based on product name and description
 * In production, this would call a real ML model or API
 */
export async function suggestITCHSCode(
    productName: string,
    description: string = ''
): Promise<ITCHSCodeSuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const searchText = `${productName} ${description}`.toLowerCase();

    // Find matching keywords in our database
    const matches: { keyword: string; suggestions: ITCHSCodeSuggestion[] }[] = [];

    for (const [keyword, suggestions] of Object.entries(ITC_HS_DATABASE)) {
        if (searchText.includes(keyword)) {
            matches.push({ keyword, suggestions });
        }
    }

    // If we found matches, return the suggestions
    if (matches.length > 0) {
        // Return suggestions from the best match (first match)
        return matches[0].suggestions;
    }

    // Default fallback suggestions for unknown products
    return [
        {
            code: '9999.99.99',
            description: 'Other products not elsewhere specified',
            confidence: 50,
            gstRate: '18%',
            dutyRates: { bcd: '10%', igst: '18%' },
            chapter: '99',
            heading: '9999'
        }
    ];
}

/**
 * Validates ITC HS Code format (8 digits: XXXX.XX.XX)
 */
export function validateITCHSCode(code: string): boolean {
    const pattern = /^\d{4}\.\d{2}\.\d{2}$/;
    return pattern.test(code);
}

/**
 * Formats a raw HS code string into ITC format
 */
export function formatITCHSCode(code: string): string {
    // Remove any existing dots or spaces
    const cleaned = code.replace(/[.\s]/g, '');

    // Ensure it's 8 digits
    if (cleaned.length !== 8 || !/^\d+$/.test(cleaned)) {
        return code; // Return original if invalid
    }

    // Format as XXXX.XX.XX
    return `${cleaned.slice(0, 4)}.${cleaned.slice(4, 6)}.${cleaned.slice(6, 8)}`;
}
