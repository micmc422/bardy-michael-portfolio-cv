/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Puppeteer Browser Utility for Vercel Deployment
 * Based on: https://github.com/gabenunez/puppeteer-on-vercel
 * 
 * Uses @sparticuz/chromium-min for Vercel production (downloads Chromium from hosted tar)
 * Uses regular puppeteer for local development (bundled Chromium)
 */

// URL to the Chromium binary package hosted in /public
// In production, uses the deployed project URL
// In development/preview, uses the official sparticuz/chromium example
const CHROMIUM_PACK_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar`
    : "https://github.com/nichochar/puppeteer-example/releases/download/v1.0.0/chromium-v132.0.0-pack.tar";

// Cache the Chromium executable path to avoid re-downloading on subsequent requests
let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

/**
 * Downloads and caches the Chromium executable path.
 * Uses a download promise to prevent concurrent downloads.
 */
async function getChromiumPath(): Promise<string> {
    // Return cached path if available
    if (cachedExecutablePath) return cachedExecutablePath;

    // Prevent concurrent downloads by reusing the same promise
    if (!downloadPromise) {
        const chromium = (await import("@sparticuz/chromium-min")).default;
        downloadPromise = chromium
            .executablePath(CHROMIUM_PACK_URL)
            .then((path: string) => {
                cachedExecutablePath = path;
                console.log("Chromium path resolved:", path);
                return path;
            })
            .catch((error: Error) => {
                console.error("Failed to get Chromium path:", error);
                downloadPromise = null; // Reset on error to allow retry
                throw error;
            });
    }

    return downloadPromise;
}

export interface BrowserOptions {
    timeout?: number;
}

export interface PageMetrics {
    loadTime: number;
    domContentLoaded: number;
    pageSize: number;
    resourceCount: number;
    resources: {
        css: number;
        js: number;
        images: number;
        fonts: number;
        other: number;
    };
    timing: {
        ttfb: number;
        fcp: number | null;
        lcp: number | null;
    };
}

export interface PageContent {
    html: string;
    title: string;
    metrics: PageMetrics;
    screenshot?: Buffer;
}

/**
 * Launch a Puppeteer browser with appropriate settings for the environment.
 * On Vercel: Uses puppeteer-core with downloaded Chromium
 * Locally: Uses regular puppeteer with bundled Chromium
 */
async function launchBrowser(options: BrowserOptions = {}) {
    const isVercel = !!process.env.VERCEL_ENV;
    const timeout = options.timeout || 30000;

    let puppeteer: any;
    let launchOptions: any = {
        headless: true,
        timeout,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--single-process',
        ],
    };

    if (isVercel) {
        // Vercel: Use puppeteer-core with downloaded Chromium binary
        const chromium = (await import("@sparticuz/chromium-min")).default;
        puppeteer = await import("puppeteer-core");
        const executablePath = await getChromiumPath();
        launchOptions = {
            ...launchOptions,
            args: [...launchOptions.args, ...chromium.args],
            executablePath,
        };
        console.log("Launching browser with executable path:", executablePath);
    } else {
        // Local: Use regular puppeteer with bundled Chromium
        puppeteer = await import("puppeteer");
    }

    return puppeteer.launch(launchOptions);
}

/**
 * Fetch a page using Puppeteer and return detailed metrics.
 * This provides more accurate performance data than simple fetch.
 */
export async function fetchPageWithPuppeteer(url: string, options: BrowserOptions = {}): Promise<PageContent> {
    const browser = await launchBrowser(options);

    try {
        const page = await browser.newPage();

        // Set viewport for consistent measurements
        await page.setViewport({ width: 1280, height: 800 });

        // Enable performance metrics
        await page.setCacheEnabled(false);

        // Track resources
        const resources: { css: number; js: number; images: number; fonts: number; other: number } = {
            css: 0,
            js: 0,
            images: 0,
            fonts: 0,
            other: 0,
        };

        let totalSize = 0;

        // Listen for network requests to count resources
        page.on('response', async (response: any) => {
            const resUrl = response.url();
            const contentType = response.headers()['content-type'] || '';
            const contentLength = parseInt(response.headers()['content-length'] || '0');
            totalSize += contentLength;

            if (contentType.includes('css') || resUrl.endsWith('.css')) {
                resources.css++;
            } else if (contentType.includes('javascript') || resUrl.endsWith('.js')) {
                resources.js++;
            } else if (contentType.includes('image') || /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(resUrl)) {
                resources.images++;
            } else if (contentType.includes('font') || /\.(woff|woff2|ttf|otf|eot)$/i.test(resUrl)) {
                resources.fonts++;
            } else {
                resources.other++;
            }
        });

        // Navigate and measure timing
        const startTime = Date.now();

        const response = await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: options.timeout || 30000,
        });

        const loadTime = Date.now() - startTime;

        // Get navigation timing
        const performanceTiming = await page.evaluate(() => {
            const timing = performance.timing || (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming);
            if ('responseStart' in timing && 'navigationStart' in timing) {
                return {
                    ttfb: timing.responseStart - timing.navigationStart,
                    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                };
            }
            return { ttfb: 0, domContentLoaded: 0 };
        });

        // Get Web Vitals if available
        const webVitals = await page.evaluate(() => {
            return new Promise<{ fcp: number | null; lcp: number | null }>((resolve) => {
                let fcp: number | null = null;
                let lcp: number | null = null;

                // Get FCP
                const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
                if (fcpEntry) {
                    fcp = fcpEntry.startTime;
                }

                // Try to get LCP
                try {
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        if (entries.length > 0) {
                            lcp = entries[entries.length - 1].startTime;
                        }
                    });
                    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
                    setTimeout(() => {
                        lcpObserver.disconnect();
                        resolve({ fcp, lcp });
                    }, 100);
                } catch {
                    resolve({ fcp, lcp });
                }
            });
        });

        // Get HTML content
        const html = await page.content();
        const title = await page.title();

        // Calculate total resources
        const resourceCount = resources.css + resources.js + resources.images + resources.fonts + resources.other;

        // Get page size from response if available, otherwise from accumulated size
        const pageSize = totalSize || (response ? parseInt(response.headers()['content-length'] || '0') : 0) || html.length;

        return {
            html,
            title,
            metrics: {
                loadTime,
                domContentLoaded: performanceTiming.domContentLoaded,
                pageSize,
                resourceCount,
                resources,
                timing: {
                    ttfb: performanceTiming.ttfb,
                    fcp: webVitals.fcp,
                    lcp: webVitals.lcp,
                },
            },
        };
    } finally {
        await browser.close();
    }
}

/**
 * Take a screenshot of a page using Puppeteer.
 */
export async function takeScreenshot(url: string, options: BrowserOptions = {}): Promise<Buffer> {
    const browser = await launchBrowser(options);

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: options.timeout || 30000 });
        const screenshot = await page.screenshot({ type: 'png' });
        return screenshot as Buffer;
    } finally {
        await browser.close();
    }
}
