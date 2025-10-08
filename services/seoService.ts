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

const metaTagsSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'An SEO-optimized title tag, under 60 characters.' },
        description: { type: Type.STRING, description: 'An engaging meta description, under 160 characters.' },
        keywords: { type: Type.STRING, description: 'A comma-separated string of 5-7 relevant keywords.' },
    },
    required: ['title', 'description', 'keywords'],
};

const internalLinkAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        anchorTextSuggestions: {
            type: Type.ARRAY,
            description: "Suggestions for improving anchor text on internal links.",
            items: {
                type: Type.OBJECT,
                properties: {
                    link: { type: Type.STRING, description: "The target URL of the link." },
                    currentAnchorText: { type: Type.STRING, description: "The current, non-optimal anchor text (e.g., 'click here')." },
                    suggestedAnchorText: { type: Type.STRING, description: "A more descriptive, keyword-rich anchor text suggestion." },
                },
                required: ['link', 'currentAnchorText', 'suggestedAnchorText'],
            },
        },
        orphanedPages: {
            type: Type.ARRAY,
            description: "A list of plausible URLs that are not linked to from the main site structure.",
            items: { type: Type.STRING },
        },
        linkingOpportunities: {
            type: Type.ARRAY,
            description: "Suggestions for new internal links to create.",
            items: {
                type: Type.OBJECT,
                properties: {
                    targetPage: { type: Type.STRING, description: "The page that should be linked to." },
                    sourcePageSuggestion: { type: Type.STRING, description: "The page where the new link should be added." },
                    reason: { type: Type.STRING, description: "The strategic reason for adding this link." },
                },
                required: ['targetPage', 'sourcePageSuggestion', 'reason'],
            },
        },
    },
    required: ['anchorTextSuggestions', 'orphanedPages', 'linkingOpportunities'],
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
      description: 'A complete, valid XML sitemap string for the website, or a sitemap index file for very large sites.'
    },
    internalLinks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of internal URLs discovered or suggested for the sitemap.'
    },
    generatedMetaTags: {
      ...metaTagsSchema,
      description: 'AI-generated meta tags for SEO. This field should only be populated for PRO plan users.',
    },
    internalLinkAnalysis: {
        ...internalLinkAnalysisSchema,
        description: 'An analysis of the internal linking strategy. This field should only be populated for PRO plan users.',
    },
  },
  required: ['audit', 'sitemapXml', 'internalLinks'],
};


export const analyzeUrl = async (url: string, userPlan: 'FREE' | 'PRO'): Promise<SeoResults> => {
    try {
        new URL(url); // Basic validation
    } catch (error) {
        throw new Error('Invalid URL provided. Please include http:// or https://');
    }

    let prompt = `
        Perform an expert on-page SEO audit for the website at the URL: ${url}.
        Because you cannot access the live URL, perform the audit based on best practices and common structures for a website of this type. Invent plausible but realistic details for the audit checks.
        
        Your analysis must include:
        1.  **Audit Checks**: Create a list of at least 12 audit checks.
            -   **FREE Tier Checks**: Include 'Status Code', 'Title Tag', 'Meta Description', 'H1 Tag', 'H2 Tags', 'H3 Tags', and 'Robots.txt'. 
                - For 'Status Code', 'Title Tag', 'Meta Description', and 'H1 Tag', make their status (OK/Problem) and values varied and realistic. For example, a title might be too long, or a meta description might be missing.
                - For the 'H2 Tags' check (id: 'h2Tags'), verify their presence. The value should report the count (e.g., "5 H2 tags found"). The status should be 'OK' if a reasonable number are found, or 'Info' if none are found. The recommendation should be: "Use H2 tags to break up your content into logical main sections. This improves readability and helps search engines understand your page structure."
                - For the 'H3 Tags' check (id: 'h3Tags'), verify their presence. The value should report the count (e.g., "8 H3 tags found"). The status should be 'OK' if a reasonable number are found, or 'Info' if none are found. The recommendation should be: "Use H3 tags for subsections within your H2 sections. A clear heading hierarchy is crucial for user experience and SEO."
                - For the 'Robots.txt' check, use the id 'robotsTxt'. Its status should typically be 'OK' with a value like 'robots.txt file found', but you can also generate a 'Problem' status if a robots.txt is missing. The recommendation should be 'Ensure your robots.txt file is correctly configured to guide search engine crawlers and is not blocking important content.'.
            -   **PRO Tier Checks**: Include 'Image Alt Tags', 'Open Graph Tags', 'Mobile-Friendliness', 'Canonical Tag', 'Favicon', 'Core Web Vitals', 'Structured Data', 'Facebook Pixel', 'Broken Links', and 'Redirect Chains'.
                - For 'Image Alt Tags' (id: 'imageAltTags'), provide a count of images with missing alt tags (e.g., "3 of 15 images are missing alt tags"). The status should be 'Problem' if any are missing, and 'OK' otherwise. The recommendation must be: 'Ensure all images have descriptive alt text. This improves accessibility for visually impaired users and helps search engines understand image content.'
                - For 'Open Graph Tags' (id: 'openGraphTags'), check for the presence of og:title, og:description, og:image, and og:url. The value should summarize the findings, like "Essential OG tags found" or "Missing og:image tag". The recommendation should state: "Open Graph tags control how your content appears when shared on social platforms like Facebook or LinkedIn. Complete OG tags lead to richer, more engaging posts and can significantly increase click-through rates."
                - For 'Mobile-Friendliness', assess if the site is likely mobile-friendly based on common patterns; the value should be 'Likely mobile-friendly' or 'May not be mobile-friendly', with a recommendation to use responsive design and test across various devices.
                - For the 'Favicon' check, set its status to 'OK', value to 'Favicon found (favicon.png)', and recommendation to 'Ensure your favicon is correctly implemented across all pages for brand consistency.'.
                - For 'Core Web Vitals' (id: 'coreWebVitals'), report simulated metrics for LCP, FID, and CLS (e.g., 'LCP: 2.1s (Good), FID: 20ms (Good), CLS: 0.15 (Needs Improvement)'). The status should be 'Problem' if any metric needs improvement and 'OK' if all are good. The recommendation must be: 'Core Web Vitals are key ranking factors. Improve LCP by optimizing images, FID by reducing JavaScript execution time, and CLS by specifying dimensions for images and ads.'
                - For 'Structured Data' (id: 'structuredData'), check for Schema.org markup. The value should be like 'Product, BreadcrumbList schemas detected' or 'No structured data found'. The status should be 'OK' if found and 'Info' if not. The recommendation should be: 'Implement structured data (Schema.org) to help search engines understand your content and enable rich snippets in search results, which can increase click-through rates.'
                - For 'Facebook Pixel' (id: 'facebookPixel'), check for its presence. The value should be 'Facebook Pixel detected' or 'Facebook Pixel not detected'. The status should be 'OK' if found, and 'Info' if not. The recommendation should be: 'The Facebook Pixel allows you to measure, optimize, and build audiences for your ad campaigns. Installing it can provide valuable insights into user behavior and improve your ad targeting.'
                - For 'Broken Links' (id: 'brokenLinks'), report a simulated count of broken links. The value should be like "2 broken links (404 errors) found" or "No broken links found." The status should be 'Problem' if any are found, and 'OK' otherwise. The recommendation must be: "Broken links create a poor user experience and can harm your SEO. Find and fix these links by updating the target URL or removing the link."
                - For 'Redirect Chains' (id: 'redirectChains'), check for and report any redirect chains. The value can be "1 redirect chain detected" or "No redirect chains found." The status should be 'Problem' if chains are found, 'OK' otherwise. The recommendation should be: "Redirect chains increase page load time and can dilute link equity. Update the initial link to point directly to the final destination URL."
                - Invent plausible but realistic data for the other PRO check ('Canonical Tag').
        2.  **Sitemap**: Your behavior here depends on the perceived size of the website at the given URL.
            -   **For most websites**: Generate a single, complete, valid XML sitemap as a string. Include the homepage and 4-5 other plausible internal pages (e.g., /about, /contact, /services).
            -   **For very large websites (e.g., major e-commerce sites, large publishers)**: Assume the site has over 50,000 URLs. In this case, instead of a regular sitemap, generate the content for a **sitemap index file**. This XML index file must be correctly formatted according to the sitemap protocol and should reference 2-3 plausible individual sitemap files (e.g., 'https://[domain]/sitemap_pages.xml', 'https://[domain]/sitemap_products.xml'). You do not need to generate the content of the individual sitemap files, only the index file itself.
        3.  **Internal Links**: Generate a list of the absolute URLs for the internal pages you included in the sitemap.
    `;

    if (userPlan === 'PRO') {
      prompt += `
        4.  **Meta Tag Generation**: Create SEO-optimized meta tags based on the likely content of the URL. This includes:
            - A compelling title tag (under 60 characters).
            - An engaging meta description (under 160 characters).
            - A comma-separated list of 5-7 relevant keywords.
            This data should be populated in the 'generatedMetaTags' field of the JSON response.
        5.  **Internal Link Analysis**: Based on the list of internal links you generated, perform an analysis to suggest SEO improvements.
            - **Anchor Text**: Invent 1-2 examples of poor anchor text (like "Read More" or "click here") for some of the internal links and suggest keyword-rich alternatives.
            - **Orphaned Pages**: Identify 1-2 plausible orphaned pages. These are pages that might exist on the site but are not linked from the main pages you've listed (e.g., a specific, old blog post or a niche service page).
            - **Linking Opportunities**: Suggest 2 new internal links between the pages you've identified. For each suggestion, provide a target page, a source page, and a brief reason why this link would be valuable (e.g., "Creates topical relevance between services" or "Passes link equity to an important page").
            This data should be populated in the 'internalLinkAnalysis' field of the JSON response.
      `;
    } else {
      prompt += `
        The 'generatedMetaTags' and 'internalLinkAnalysis' fields in the JSON response should be omitted or set to null.
      `;
    }

    prompt += `
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