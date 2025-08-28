
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
  tier?: 'FREE' | 'PRO';
}

export interface SeoResults {
  audit: AuditCheck[];
  sitemapXml: string;
  internalLinks: string[];
}

export interface UserProfile {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface AuditHistoryEntry {
  id: string;
  url: string;
  date: Date;
  results: SeoResults;
}
