// Site Check Analysis Types

export type AnalysisStatus = 'success' | 'warning' | 'error';

export interface AnalysisItem {
    label: string;
    value: string | number | boolean;
    status: AnalysisStatus;
    description?: string;
    impact?: string;
    recommendation?: string;
    // Optional client-side rendering overrides
    valueComponent?: React.ReactNode;
    contentComponent?: React.ReactNode;
}

export interface PerformanceAnalysis {
    url: string;
    loadTime: AnalysisItem;
    pageSize: AnalysisItem;
    requestCount: AnalysisItem;
    compression: AnalysisItem;
    ttfb?: AnalysisItem;
    fcp?: AnalysisItem;
    lcp?: AnalysisItem;
    resources: {
        html: number;
        css: number;
        js: number;
        images: number;
        fonts: number;
    };
    score: number;
    usedPuppeteer?: boolean;
}

// Open Graph metadata
export interface OpenGraphData {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    locale?: string;
    // Twitter Card
    twitterCard?: string;
    twitterSite?: string;
    twitterCreator?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
}

// JSON-LD structured data
export interface JsonLdData {
    type: string;
    raw: string;
    parsed: Record<string, unknown>;
}

export interface SEOAnalysis {
    url: string;
    title: AnalysisItem;
    description: AnalysisItem;
    headings: AnalysisItem;
    images: AnalysisItem;
    links: AnalysisItem;
    sitemap: AnalysisItem;
    robots: AnalysisItem;
    viewport: AnalysisItem;
    structuredData: AnalysisItem;
    ogTags: AnalysisItem;
    score: number;
    usedPuppeteer?: boolean;
    // Detailed metadata
    openGraph?: OpenGraphData;
    jsonLdData?: JsonLdData[];
    metaTags?: Record<string, string>;
}

export interface SecurityAnalysis {
    url: string;
    https: AnalysisItem;
    hsts: AnalysisItem;
    csp: AnalysisItem;
    xFrameOptions: AnalysisItem;
    xContentTypeOptions: AnalysisItem;
    mixedContent: AnalysisItem;
    score: number;
}

export interface AccessibilityAnalysis {
    url: string;
    language: AnalysisItem;
    ariaAttributes: AnalysisItem;
    formLabels: AnalysisItem;
    altTexts: AnalysisItem;
    landmarks: AnalysisItem;
    score: number;
}

export interface MobileAnalysis {
    url: string;
    viewport: AnalysisItem;
    responsiveDesign: AnalysisItem;
    touchTargets: AnalysisItem;
    fontSizes: AnalysisItem;
    score: number;
}
