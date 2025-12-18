import { describe, it, expect } from 'vitest';
import type { 
  SEOAnalysisResult, 
  SEOIssue, 
  MetaTagsData,
  SecurityData,
  AccessibilityData 
} from '../types';

describe('SEO Types', () => {
  describe('SEOAnalysisResult', () => {
    it('should have correct structure', () => {
      const result: SEOAnalysisResult = {
        url: 'https://example.com',
        timestamp: '2024-01-15T12:00:00Z',
        scores: {
          overall: 85,
          performance: 90,
          seo: 80,
          security: 95,
          accessibility: 75,
          mobile: 85,
        },
        issues: [],
        recommendations: ['Improve image optimization'],
      };

      expect(result.url).toBe('https://example.com');
      expect(result.scores.overall).toBe(85);
      expect(result.recommendations).toHaveLength(1);
    });
  });

  describe('SEOIssue', () => {
    it('should have correct severity levels', () => {
      const criticalIssue: SEOIssue = {
        category: 'security',
        severity: 'critical',
        title: 'Missing HTTPS',
        description: 'Site is not using HTTPS',
      };

      const warningIssue: SEOIssue = {
        category: 'seo',
        severity: 'warning',
        title: 'Missing meta description',
        description: 'Add a meta description',
        recommendation: 'Add a meta description tag',
      };

      expect(criticalIssue.severity).toBe('critical');
      expect(warningIssue.severity).toBe('warning');
      expect(warningIssue.recommendation).toBeDefined();
    });
  });

  describe('MetaTagsData', () => {
    it('should allow optional fields', () => {
      const metaTags: MetaTagsData = {
        title: 'Page Title',
        description: 'Page description',
      };

      expect(metaTags.title).toBe('Page Title');
      expect(metaTags.ogImage).toBeUndefined();
    });

    it('should include Open Graph data', () => {
      const metaTags: MetaTagsData = {
        title: 'Page Title',
        ogTitle: 'OG Title',
        ogDescription: 'OG Description',
        ogImage: 'https://example.com/image.jpg',
        ogUrl: 'https://example.com',
        ogType: 'website',
      };

      expect(metaTags.ogTitle).toBe('OG Title');
      expect(metaTags.ogType).toBe('website');
    });
  });

  describe('SecurityData', () => {
    it('should track security headers', () => {
      const security: SecurityData = {
        https: true,
        hsts: true,
        xFrameOptions: true,
        xContentTypeOptions: true,
        contentSecurityPolicy: false,
        referrerPolicy: true,
        permissionsPolicy: false,
      };

      expect(security.https).toBe(true);
      expect(security.contentSecurityPolicy).toBe(false);
    });
  });

  describe('AccessibilityData', () => {
    it('should track accessibility features', () => {
      const a11y: AccessibilityData = {
        hasAltTags: true,
        hasAriaLabels: true,
        hasHeadingStructure: true,
        hasSkipLinks: false,
        hasFocusIndicators: true,
        colorContrast: 'pass',
        formLabels: true,
      };

      expect(a11y.colorContrast).toBe('pass');
      expect(a11y.hasSkipLinks).toBe(false);
    });
  });
});
