import OpenAI from 'openai';

const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY || 'placeholder';
const isOpenRouter = apiKey.startsWith('sk-or-');

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: isOpenRouter
        ? 'https://openrouter.ai/api/v1'
        : 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    dangerouslyAllowBrowser: true,
    // OpenRouter requires these headers for some models
    defaultHeaders: isOpenRouter ? {
        "HTTP-Referer": "https://eximley.com",
        "X-Title": "Eximley SaaS",
    } : undefined
});

export interface QuotationAIResponse {
    price: string;
    currency: string;
    unit: string;
    validity: string;
    terms: string;
    paymentTerms: string;
    message: string;
    itemDescription: string;
    insights: string[];
}

export async function generateAIQuotation(
    buyerName: string,
    destination: string,
    goods: string,
    enquiryMessage: string
): Promise<QuotationAIResponse> {
    try {
        const prompt = `
      You are an expert Export Manager and AI Agent for Eximley, a premium EXIM SaaS platform.
      
      Buyer: ${buyerName}
      Destination: ${destination}
      Goods: ${goods}
      Enquiry: "${enquiryMessage}"
      
      Generate a professional quotation response and commercial terms.
      Return the response in JSON format with exactly these keys:
      - price: (numerical string, e.g., "12.50")
      - currency: (3-letter code, e.g., "USD")
      - unit: (code, e.g., "PCS", "KG", "MT")
      - validity: (e.g., "15 Days")
      - terms: (Incoterm code, e.g., "FOB", "CIF")
      - paymentTerms: (code, e.g., "ADVANCE_30_70", "LC_SIGHT")
      - message: (professional email-style response. IMPORTANT: Use PLAIN TEXT ONLY. NO MARKDOWN (no stars, hashes, or bold text))
      - itemDescription: (A professional, detailed trade description of the goods for the official quotation PDF)
      - insights: (array of 2-3 short strings about pricing strategy or market fit)
      
      Make the pricing realistic for the ${destination} market.
    `;

        const model = isOpenRouter ? 'qwen/qwen-2.5-72b-instruct' : 'qwen-plus';

        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: 'You are a professional export consultant.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('Empty response from AI');

        return JSON.parse(content) as QuotationAIResponse;
    } catch (error) {
        console.error('Error generating AI quotation:', error);
        // Fallback to mock data if API fails or is not configured
        return {
            price: '12.00',
            currency: 'USD',
            unit: 'PCS',
            validity: '30 Days',
            terms: 'FOB',
            paymentTerms: 'ADVANCE_30_70',
            message: `Dear ${buyerName.split(' ')[0]},\n\nThank you for your enquiry regarding ${goods}. We are pleased to offer our premium quality products at a competitive price for the ${destination} market.\n\nPlease find our offer details below.\n\nBest Regards,\nEximley Export Team`,
            itemDescription: goods,
            insights: ['Priced competitively for GCC region', 'Standard Incoterms applied']
        };
    }
}
