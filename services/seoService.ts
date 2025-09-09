import { AuditCheck, AuditStatus, SeoResults } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

// This is a client-side app, so process.env.API_KEY is handled by the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const auditCheckSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'A unique identifier for the check, e.g., "titleTag".' },
    title: { type: Type.STRING, description: 'The human-readable title of the check, e.g., "Title Tag".' },
    status: { type: Type.STRING, enum: [AuditStatus.OK, AuditStatus.Problem, AuditStatus.Info], description: 'The status of the audit check.' },
    value: { type: Type.STRING, description: 'The value found, e.g., the text of the title tag and its length.' },
    recommendation: { type: Type.STRING, description: 'Actionable advice for improvement.' },
    tier: { type: Type.STRING, enum: ['FREE', 'PRO'], description: 'The plan tier this check belongs to. Key checks like title, meta, h1, status code are FREE. Others like images, OG tags are PRO.' },
  },
  required: ['id', 'title', 'status', 'value', 'recommendation', 'tier'],
};

const seoResultsSchema = {
  type: Type.OBJECT,
  properties: {
    audit: {
      type: Type.ARRAY,
      items: auditCheckSchema,
      description: 'A list of SEO audit checks performed.'
    },
    sitemapXml: {
      type: Type.STRING,
      description: 'A complete, valid XML sitemap string for the website.'
    },
    internalLinks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of internal URLs discovered or suggested for the sitemap.'
    },
  },
  required: ['audit', 'sitemapXml', 'internalLinks'],
};


export const analyzeUrl = async (url: string): Promise<SeoResults> => {
    try {
        new URL(url); // Basic validation
    } catch (error) {
        throw new Error('Invalid URL provided. Please include http:// or https://');
    }

    const prompt = `
        Perform an expert on-page SEO audit for the website at the URL: ${url}.
        Because you cannot access the live URL, perform the audit based on best practices and common structures for a website of this type. Invent plausible but realistic details for the audit checks.
        
        Your analysis must include:
        1.  **Audit Checks**: Create a list of at least 9 audit checks.
            -   **FREE Tier Checks**: Include 'Status Code', 'Title Tag', 'Meta Description', and 'H1 Tag'. Make their status (OK/Problem) and values varied and realistic. For example, a title might be too long, or a meta description might be missing.
            -   **PRO Tier Checks**: Include 'Image Alt Tags', 'Open Graph Tags', 'Mobile-Friendliness', 'Canonical Tag', 'Robots.txt', and 'Favicon'. For the 'Favicon' check, set its status to 'OK', value to 'Favicon found (favicon.png)', and recommendation to 'Ensure your favicon is correctly implemented across all pages for brand consistency.'. Invent plausible data for the other PRO checks.
        2.  **Sitemap**: Generate a complete, valid XML sitemap as a string. Include the homepage and 4-5 other plausible internal pages (e.g., /about, /contact, /services).
        3.  **Internal Links**: Generate a list of the absolute URLs for the internal pages you included in the sitemap.

        Structure your entire response as a single JSON object that strictly adheres to the provided schema. Do not include any text outside of the JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: seoResultsSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const results = JSON.parse(jsonString);
        
        // Post-process to ensure correct enum values, as AI might occasionally hallucinate
        results.audit.forEach((item: AuditCheck) => {
            if (!Object.values(AuditStatus).includes(item.status)) {
                item.status = AuditStatus.Info; // Default to Info if status is invalid
            }
        });

        return results as SeoResults;

    } catch (err) {
        console.error("Error calling Gemini API:", err);
        const message = err instanceof Error ? err.message : 'An unknown error occurred with the AI analysis.';
        throw new Error(`AI analysis failed: ${message}`);
    }
};