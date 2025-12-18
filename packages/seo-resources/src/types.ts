// SEO Analysis Types

export interface SEOAnalysisResult {
  url: string;
  timestamp: string;
  scores: {
    overall: number;
    performance: number;
    seo: number;
    security: number;
    accessibility: number;
    mobile: number;
  };
  issues: SEOIssue[];
  recommendations: string[];
}

export interface SEOIssue {
  category: 'performance' | 'seo' | 'security' | 'accessibility' | 'mobile';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation?: string;
}

export interface MetaTagsData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  viewport?: string;
  charset?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  resourceCount: number;
  totalSize: number;
}

export interface SecurityData {
  https: boolean;
  hsts: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
  contentSecurityPolicy: boolean;
  referrerPolicy: boolean;
  permissionsPolicy: boolean;
}

export interface AccessibilityData {
  hasAltTags: boolean;
  hasAriaLabels: boolean;
  hasHeadingStructure: boolean;
  hasSkipLinks: boolean;
  hasFocusIndicators: boolean;
  colorContrast: 'pass' | 'fail' | 'unknown';
  formLabels: boolean;
}

export interface MobileData {
  isMobileResponsive: boolean;
  hasViewportMeta: boolean;
  hasTouchTargets: boolean;
  textReadable: boolean;
  noHorizontalScroll: boolean;
}

export interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

export interface JsonLdData {
  type: string;
  data: Record<string, unknown>;
}
