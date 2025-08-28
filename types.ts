
export enum AuditStatus {
  OK = 'OK',
  Problem = 'Problem',
  Info = 'Info',
}

export interface AuditCheck {
  id: string;
  title: string;
  status: AuditStatus;
  value: string;
  recommendation: string;
}

export interface SeoResults {
  audit: AuditCheck[];
  sitemapXml: string;
  internalLinks: string[];
}
