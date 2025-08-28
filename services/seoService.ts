import { AuditCheck, AuditStatus, SeoResults } from '../types';

/**
 * NOTE: This is a MOCK service.
 * In a real-world application, this logic would live on a server-side API endpoint.
 * Browsers block cross-origin requests (CORS) for fetching arbitrary website HTML,
 * so we simulate the crawling and analysis process here.
 */
export const analyzeUrl = (url: string): Promise<SeoResults> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const urlObject = new URL(url);
        const audit = generateMockAudit(urlObject);
        const { sitemapXml, internalLinks } = generateMockSitemapData(urlObject);
        resolve({ audit, sitemapXml, internalLinks });
      } catch (error) {
        reject(new Error('Invalid URL provided. Please include http:// or https://'));
      }
    }, 1500); // Simulate network and processing delay
  });
};

const generateMockAudit = (url: URL): AuditCheck[] => {
  const metaDescText = `This is a sample meta description for ${url.hostname}. It's generated for demonstration purposes and should be between 120 and 150 characters.`;
  const metaDescLength = metaDescText.length;
  const isLengthOk = metaDescLength > 70 && metaDescLength < 160;
  const hasKeywords = Math.random() > 0.2; // 80% chance to be "detected"
  const metaStatus = isLengthOk && hasKeywords ? AuditStatus.OK : AuditStatus.Problem;

  const h1Text = `Welcome to ${url.hostname}`;
  const isMobileFriendly = Math.random() > 0.2; // 80% chance of being mobile friendly
  
  const checks: AuditCheck[] = [
    {
      id: 'statusCode',
      title: 'Status Code',
      status: AuditStatus.OK,
      value: '200 OK',
      recommendation: 'The page is accessible. No action needed.',
      tier: 'FREE'
    },
    // The Title Tag check will be added dynamically below
    {
      id: 'metaDescription',
      title: 'Meta Description',
      status: metaStatus,
      value: `"${metaDescText}" (Length: ${metaDescLength} | Keywords: ${hasKeywords ? 'Detected' : 'Missing'})`,
      recommendation: 'Meta descriptions should be between 70 and 160 characters and include relevant keywords to attract users from search results.',
      tier: 'FREE'
    },
    {
      id: 'h1Tag',
      title: 'H1 Tag',
      status: h1Text.length > 0 ? AuditStatus.OK : AuditStatus.Problem,
      value: `"${h1Text}"`,
      recommendation: 'Ensure every page has exactly one H1 tag that accurately describes the page content.',
      tier: 'FREE'
    },
    // PRO Features
    {
      id: 'imageAltTags',
      title: 'Image Alt Tags',
      status: AuditStatus.OK,
      value: '15 of 18 images have alt tags.',
      recommendation: 'All images should have descriptive alt tags to improve accessibility and provide context to search engines.',
      tier: 'PRO'
    },
    {
      id: 'ogTags',
      title: 'Open Graph Tags',
      status: AuditStatus.OK,
      value: 'og:title, og:description, and og:image tags are present.',
      recommendation: 'Open Graph tags control how your content appears when shared on social media. Ensure they are present and optimized.',
      tier: 'PRO'
    },
    {
      id: 'mobileFriendly',
      title: 'Mobile-Friendliness',
      status: isMobileFriendly ? AuditStatus.OK : AuditStatus.Problem,
      value: isMobileFriendly ? 'Passes mobile usability test.' : 'Fails mobile usability (e.g., viewport not set, content too wide).',
      recommendation: isMobileFriendly 
        ? 'Your page is easy to use on mobile devices. Keep up the great work!' 
        : 'This page may not be easy to use on a mobile device. Ensure you have a viewport meta tag and use responsive design principles to make sure content fits the screen.',
      tier: 'PRO'
    },
  ];

  // New, more detailed Title Tag Check
  const titleScenario = Math.random();
  let titleCheck: AuditCheck;

  if (titleScenario < 0.1) { // 10% chance: No title tag
    titleCheck = {
      id: 'titleTag',
      title: 'Title Tag',
      status: AuditStatus.Problem,
      value: 'Not found',
      recommendation: 'A title tag is critical for SEO. Add a unique and descriptive title tag to this page.',
      tier: 'FREE'
    };
  } else { // 90% chance: Title tag exists
    const titleTextOptions = [
      `Welcome to ${url.hostname}`, // Good length
      `${url.hostname}`, // Too short
      `The Ultimate Guide to Everything You Need to Know About the Wonderful World of ${url.hostname}`, // Too long
      `Sample Title for ${url.hostname}` // Good length
    ];
    // Use the random scenario to pick a title, ensuring variety
    const titleText = titleTextOptions[Math.floor(titleScenario * titleTextOptions.length)];
    const titleLength = titleText.length;

    titleCheck = {
      id: 'titleTag',
      title: 'Title Tag',
      status: titleLength > 10 && titleLength < 60 ? AuditStatus.OK : AuditStatus.Problem,
      value: `"${titleText}" (Length: ${titleLength})`,
      recommendation: 'Keep title tags between 10 and 60 characters for best visibility in search results.',
      tier: 'FREE'
    };
  }
  // Insert the title check after the status code check for logical order
  checks.splice(1, 0, titleCheck);


  // Canonical Tag Check
  const canonicalScenario = Math.random();
  if (canonicalScenario < 0.15) { // 15% chance: No canonical tag
    checks.push({
      id: 'canonicalTag',
      title: 'Canonical Tag',
      status: AuditStatus.Problem,
      value: 'Not found',
      recommendation: 'Add a canonical tag to prevent duplicate content issues. It tells search engines which version of a page is the primary one.',
      tier: 'PRO'
    });
  } else if (canonicalScenario < 0.85) { // 70% chance: Self-referencing
    checks.push({
      id: 'canonicalTag',
      title: 'Canonical Tag',
      status: AuditStatus.OK,
      value: `Self-referencing: "${url.href}"`,
      recommendation: 'The self-referencing canonical tag is correctly set up, which is great for SEO.',
      tier: 'PRO'
    });
  } else { // 15% chance: Points to a different URL
    const differentUrl = new URL('/preferred-page', url.origin);
    checks.push({
      id: 'canonicalTag',
      title: 'Canonical Tag',
      status: AuditStatus.Info,
      value: `Points to: "${differentUrl.href}"`,
      recommendation: 'This page points to another URL as the canonical version. Ensure this is intentional, as only the canonical URL will be indexed.',
      tier: 'PRO'
    });
  }

  // Finally, add the robots.txt check
  checks.push({
    id: 'robotsTxt',
    title: 'Robots.txt',
    status: AuditStatus.Info,
    value: `Present at ${url.origin}/robots.txt`,
    recommendation: 'A robots.txt file was found. Review it to ensure it allows crawlers to access important pages.',
    tier: 'PRO'
  });

  return checks;
};

const generateMockSitemapData = (url: URL): { sitemapXml: string; internalLinks: string[] } => {
  const today = new Date().toISOString().split('T')[0];
  const pageLinks = [
    '/about',
    '/services',
    '/blog',
    '/contact',
    '/products/cool-product-1'
  ];

  const allRelativeLinks = ['/', ...pageLinks];
  const internalLinks = allRelativeLinks.map(link => new URL(link, url.origin).href);
  
  const mainUrl = new URL('/', url.origin).href;

  const urlEntries = pageLinks.map(link => {
    const loc = new URL(link, url.origin).href;
    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }).join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${mainUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>${urlEntries}
</urlset>
`;
  return { sitemapXml, internalLinks };
};