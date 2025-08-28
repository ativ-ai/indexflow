
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
  const randomLength = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  
  const titleText = `Sample Title for ${url.hostname}`;
  const titleLength = titleText.length;
  
  const metaDescText = `This is a sample meta description for ${url.hostname}. It's generated for demonstration purposes and should be between 120 and 150 characters.`;
  const metaDescLength = metaDescText.length;
  const isLengthOk = metaDescLength > 70 && metaDescLength < 160;
  // Simulate a keyword check. For this mock, we'll randomly determine if keywords are "found".
  const hasKeywords = Math.random() > 0.2; // 80% chance to be "detected"
  const metaStatus = isLengthOk && hasKeywords ? AuditStatus.OK : AuditStatus.Problem;


  const h1Text = `Welcome to ${url.hostname}`;
  
  const checks: AuditCheck[] = [
    {
      id: 'statusCode',
      title: 'Status Code',
      status: AuditStatus.OK,
      value: '200 OK',
      recommendation: 'The page is accessible. No action needed.'
    },
    {
      id: 'titleTag',
      title: 'Title Tag',
      status: titleLength > 10 && titleLength < 60 ? AuditStatus.OK : AuditStatus.Problem,
      value: `"${titleText}" (Length: ${titleLength})`,
      recommendation: 'Keep title tags between 10 and 60 characters for best visibility in search results.'
    },
    {
      id: 'metaDescription',
      title: 'Meta Description',
      status: metaStatus,
      value: `"${metaDescText}" (Length: ${metaDescLength} | Keywords: ${hasKeywords ? 'Detected' : 'Missing'})`,
      recommendation: 'Meta descriptions should be between 70 and 160 characters and include relevant keywords to attract users from search results.'
    },
    {
      id: 'h1Tag',
      title: 'H1 Tag',
      status: h1Text.length > 0 ? AuditStatus.OK : AuditStatus.Problem,
      value: `"${h1Text}"`,
      recommendation: 'Ensure every page has exactly one H1 tag that accurately describes the page content.'
    },
  ];

  // Canonical Tag Check
  const canonicalScenario = Math.random();
  if (canonicalScenario < 0.15) { // 15% chance: No canonical tag
    checks.push({
      id: 'canonicalTag',
      title: 'Canonical Tag',
      status: AuditStatus.Problem,
      value: 'Not found',
      recommendation: 'Add a canonical tag to prevent duplicate content issues. It tells search engines which version of a page is the primary one.'
    });
  } else if (canonicalScenario < 0.85) { // 70% chance: Self-referencing
    checks.push({
      id: 'canonicalTag',
      title: 'Canonical Tag',
      status: AuditStatus.OK,
      value: `Self-referencing: "${url.href}"`,
      recommendation: 'The self-referencing canonical tag is correctly set up, which is great for SEO.'
    });
  } else { // 15% chance: Points to a different URL
    const differentUrl = new URL('/preferred-page', url.origin);
    checks.push({
      id: 'canonicalTag',
      title: 'Canonical Tag',
      status: AuditStatus.Info,
      value: `Points to: "${differentUrl.href}"`,
      recommendation: 'This page points to another URL as the canonical version. Ensure this is intentional, as only the canonical URL will be indexed.'
    });
  }

  // Finally, add the robots.txt check
  checks.push({
    id: 'robotsTxt',
    title: 'Robots.txt',
    status: AuditStatus.Info,
    value: `Present at ${url.origin}/robots.txt`,
    recommendation: 'A robots.txt file was found. Review it to ensure it allows crawlers to access important pages.'
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
