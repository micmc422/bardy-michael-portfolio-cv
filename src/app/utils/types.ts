import type { Author, TagInPost } from "@wisp-cms/client";
import type { Metadata } from "next";

export interface PostType {
    metadata: Metadata & {
        projectURL?: string;
        publishedAt: string | null;
        updatedAt: string | null;
        summary: string;
        image: string | null;
        images?: string[];
        team: {
            avatar: string;
            name: string;
            role: string;
            linkedIn?: string;
        }[],
        sources?: string[];
        link?: string;
        tags?: { id: string, name: string }[];
    };
    slug: string;
    content?: string;
}

export interface WispPost {
    id: string;
    createdAt: Date;
    teamId: string;
    description: string | null;
    title: string;
    content?: string;
    metadata?: { team?: Team[], sources?: string[], [key: string]: any } | null;
    slug: string;
    image: string | null;
    authorId: string;
    updatedAt: string;
    publishedAt: string;
    author: Author;
    tags: TagInPost[];
}

export interface OfferType {
    slug: number;
}
export interface Team {
    name: string
    role: string
    avatar: string
    linkedIn: string
}

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
