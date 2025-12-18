'use server'

import { unstable_cache } from 'next/cache'
import type { PerformanceAnalysis } from '../types'
import { createAnalysisItem, calculateScore } from './helpers'

/**
 * Analyze page performance using Puppeteer for accurate metrics.
 * Falls back to simple fetch if Puppeteer fails.
 */
async function fetchPerformanceAnalysis(url: string): Promise<PerformanceAnalysis> {
    // Try Puppeteer first for more accurate metrics
    try {
        const { fetchPageWithPuppeteer } = await import('@/lib/puppeteer')
        const result = await fetchPageWithPuppeteer(url, { timeout: 30000 })

        const { metrics, html } = result

        // Load time analysis
        const loadTimeItem = createAnalysisItem(
            'Temps de chargement',
            `${metrics.loadTime}ms`,
            metrics.loadTime < 1000 ? 'success' : metrics.loadTime < 3000 ? 'warning' : 'error',
            metrics.loadTime < 1000 ? 'Excellent temps de réponse' : metrics.loadTime < 3000 ? 'Temps de réponse acceptable' : 'Temps de réponse lent',
            metrics.loadTime >= 3000 ? 'Un temps de chargement lent augmente le taux de rebond de 32% et nuit au référencement Google.' : metrics.loadTime >= 1000 ? 'Un temps de chargement modéré peut impacter l\'expérience utilisateur sur mobile.' : undefined,
            metrics.loadTime >= 1000 ? 'Optimisez les images, activez la mise en cache et utilisez un CDN.' : undefined
        )

        // TTFB analysis
        const ttfbItem = metrics.timing.ttfb ? createAnalysisItem(
            'Time to First Byte (TTFB)',
            `${Math.round(metrics.timing.ttfb)}ms`,
            metrics.timing.ttfb < 200 ? 'success' : metrics.timing.ttfb < 600 ? 'warning' : 'error',
            metrics.timing.ttfb < 200 ? 'Excellent TTFB' : metrics.timing.ttfb < 600 ? 'TTFB acceptable' : 'TTFB lent',
            metrics.timing.ttfb >= 600 ? 'Un TTFB lent indique des problèmes côté serveur (base de données, SSL, réseau).' : undefined,
            metrics.timing.ttfb >= 200 ? 'Optimisez votre serveur, utilisez un CDN et activez le cache serveur.' : undefined
        ) : undefined

        // FCP analysis (First Contentful Paint)
        const fcpItem = metrics.timing.fcp ? createAnalysisItem(
            'First Contentful Paint (FCP)',
            `${Math.round(metrics.timing.fcp)}ms`,
            metrics.timing.fcp < 1800 ? 'success' : metrics.timing.fcp < 3000 ? 'warning' : 'error',
            metrics.timing.fcp < 1800 ? 'Bon FCP (Core Web Vitals)' : metrics.timing.fcp < 3000 ? 'FCP à améliorer' : 'FCP critique',
            metrics.timing.fcp >= 1800 ? 'Un FCP lent signifie que l\'utilisateur voit une page blanche trop longtemps.' : undefined,
            metrics.timing.fcp >= 1800 ? 'Réduisez le CSS bloquant, optimisez les polices et le rendu initial.' : undefined
        ) : undefined

        // LCP analysis (Largest Contentful Paint)
        const lcpItem = metrics.timing.lcp ? createAnalysisItem(
            'Largest Contentful Paint (LCP)',
            `${Math.round(metrics.timing.lcp)}ms`,
            metrics.timing.lcp < 2500 ? 'success' : metrics.timing.lcp < 4000 ? 'warning' : 'error',
            metrics.timing.lcp < 2500 ? 'Bon LCP (Core Web Vitals)' : metrics.timing.lcp < 4000 ? 'LCP à améliorer' : 'LCP critique',
            metrics.timing.lcp >= 2500 ? 'Le LCP est un Core Web Vital clé pour le SEO. Un mauvais LCP pénalise votre référencement.' : undefined,
            metrics.timing.lcp >= 2500 ? 'Optimisez l\'image principale, utilisez le lazy loading et préchargez les ressources critiques.' : undefined
        ) : undefined

        // Page size analysis
        const pageSizeKB = Math.round(metrics.pageSize / 1024)
        const pageSizeItem = createAnalysisItem(
            'Taille de la page',
            `${pageSizeKB} KB`,
            pageSizeKB < 500 ? 'success' : pageSizeKB < 2000 ? 'warning' : 'error',
            pageSizeKB < 500 ? 'Taille optimale' : pageSizeKB < 2000 ? 'Taille acceptable' : 'Page trop lourde',
            pageSizeKB >= 2000 ? 'Une page lourde consomme plus de données mobiles et ralentit le chargement.' : pageSizeKB >= 500 ? 'La taille de la page pourrait être réduite pour améliorer les performances.' : undefined,
            pageSizeKB >= 500 ? 'Compressez les images, minifiez CSS/JS et supprimez le code inutilisé.' : undefined
        )

        // Resource count analysis
        const totalRequests = metrics.resourceCount
        const requestCountItem = createAnalysisItem(
            'Nombre de ressources',
            totalRequests,
            totalRequests < 30 ? 'success' : totalRequests < 60 ? 'warning' : 'error',
            `${metrics.resources.css} CSS, ${metrics.resources.js} JS, ${metrics.resources.images} images, ${metrics.resources.fonts} polices`,
            totalRequests >= 60 ? 'Trop de requêtes HTTP ralentissent considérablement le chargement initial.' : totalRequests >= 30 ? 'Le nombre de ressources pourrait être optimisé.' : undefined,
            totalRequests >= 30 ? 'Combinez les fichiers CSS/JS et utilisez des sprites pour les images.' : undefined
        )

        // Compression - check from HTML response
        const compressionItem = createAnalysisItem(
            'Compression',
            'Vérifié via navigateur',
            'success',
            'Analyse via Puppeteer (compression réelle du navigateur)',
            undefined,
            undefined
        )

        const analysisItems = [loadTimeItem, pageSizeItem, requestCountItem, compressionItem]
        if (ttfbItem) analysisItems.push(ttfbItem)
        if (fcpItem) analysisItems.push(fcpItem)
        if (lcpItem) analysisItems.push(lcpItem)

        return {
            url,
            loadTime: loadTimeItem,
            pageSize: pageSizeItem,
            requestCount: requestCountItem,
            compression: compressionItem,
            ttfb: ttfbItem,
            fcp: fcpItem,
            lcp: lcpItem,
            resources: {
                html: html.length,
                css: metrics.resources.css,
                js: metrics.resources.js,
                images: metrics.resources.images,
                fonts: metrics.resources.fonts
            },
            score: calculateScore(analysisItems),
            usedPuppeteer: true
        }
    } catch (puppeteerError) {
        console.warn('Puppeteer analysis failed, falling back to fetch:', puppeteerError)
        // Fall back to simple fetch analysis
        return fetchPerformanceAnalysisFallback(url)
    }
}

/**
 * Fallback performance analysis using simple fetch.
 * Used when Puppeteer is not available.
 */
async function fetchPerformanceAnalysisFallback(url: string): Promise<PerformanceAnalysis> {
    try {
        const startTime = Date.now()
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SiteCheckBot/1.0)'
            }
        })
        clearTimeout(timeoutId)

        const loadTime = Date.now() - startTime
        const html = await response.text()
        const contentLength = parseInt(response.headers.get('content-length') || '0') || html.length
        const contentEncoding = response.headers.get('content-encoding') || 'none'

        // Count resources in HTML
        const cssCount = (html.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length
        const jsCount = (html.match(/<script[^>]+src=/gi) || []).length
        const imgCount = (html.match(/<img[^>]+src=/gi) || []).length
        const fontCount = (html.match(/@font-face|fonts\.googleapis|fonts\.gstatic/gi) || []).length

        const loadTimeItem = createAnalysisItem(
            'Temps de chargement',
            `${loadTime}ms`,
            loadTime < 1000 ? 'success' : loadTime < 3000 ? 'warning' : 'error',
            loadTime < 1000 ? 'Excellent temps de réponse' : loadTime < 3000 ? 'Temps de réponse acceptable' : 'Temps de réponse lent',
            loadTime >= 3000 ? 'Un temps de chargement lent augmente le taux de rebond de 32% et nuit au référencement Google.' : loadTime >= 1000 ? 'Un temps de chargement modéré peut impacter l\'expérience utilisateur sur mobile.' : undefined,
            loadTime >= 1000 ? 'Optimisez les images, activez la mise en cache et utilisez un CDN.' : undefined
        )

        const pageSizeKB = Math.round(contentLength / 1024)
        const pageSizeItem = createAnalysisItem(
            'Taille de la page',
            `${pageSizeKB} KB`,
            pageSizeKB < 500 ? 'success' : pageSizeKB < 2000 ? 'warning' : 'error',
            pageSizeKB < 500 ? 'Taille optimale' : pageSizeKB < 2000 ? 'Taille acceptable' : 'Page trop lourde',
            pageSizeKB >= 2000 ? 'Une page lourde consomme plus de données mobiles et ralentit le chargement.' : pageSizeKB >= 500 ? 'La taille de la page pourrait être réduite pour améliorer les performances.' : undefined,
            pageSizeKB >= 500 ? 'Compressez les images, minifiez CSS/JS et supprimez le code inutilisé.' : undefined
        )

        const totalRequests = cssCount + jsCount + imgCount
        const requestCountItem = createAnalysisItem(
            'Nombre de ressources',
            totalRequests,
            totalRequests < 30 ? 'success' : totalRequests < 60 ? 'warning' : 'error',
            `${cssCount} CSS, ${jsCount} JS, ${imgCount} images`,
            totalRequests >= 60 ? 'Trop de requêtes HTTP ralentissent considérablement le chargement initial.' : totalRequests >= 30 ? 'Le nombre de ressources pourrait être optimisé.' : undefined,
            totalRequests >= 30 ? 'Combinez les fichiers CSS/JS et utilisez des sprites pour les images.' : undefined
        )

        const compressionItem = createAnalysisItem(
            'Compression',
            contentEncoding !== 'none' ? 'Activée' : 'Désactivée',
            contentEncoding !== 'none' ? 'success' : 'warning',
            contentEncoding !== 'none' ? `Compression ${contentEncoding} détectée` : 'Aucune compression détectée',
            contentEncoding === 'none' ? 'Sans compression, les fichiers sont 70% plus lourds à télécharger.' : undefined,
            contentEncoding === 'none' ? 'Activez la compression Gzip ou Brotli sur votre serveur.' : undefined
        )

        const analysisItems = [loadTimeItem, pageSizeItem, requestCountItem, compressionItem]

        return {
            url,
            loadTime: loadTimeItem,
            pageSize: pageSizeItem,
            requestCount: requestCountItem,
            compression: compressionItem,
            resources: {
                html: contentLength,
                css: cssCount,
                js: jsCount,
                images: imgCount,
                fonts: fontCount
            },
            score: calculateScore(analysisItems),
            usedPuppeteer: false
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        const errorItem = createAnalysisItem('Erreur', errorMessage, 'error', 'Impossible d\'analyser la performance')
        return {
            url,
            loadTime: errorItem,
            pageSize: errorItem,
            requestCount: errorItem,
            compression: errorItem,
            resources: { html: 0, css: 0, js: 0, images: 0, fonts: 0 },
            score: 0,
            usedPuppeteer: false
        }
    }
}

export const analyzePerformance = unstable_cache(
    fetchPerformanceAnalysis,
    ['site-check-performance'],
    { revalidate: 3600 }
)
