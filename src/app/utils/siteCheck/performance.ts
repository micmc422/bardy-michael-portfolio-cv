'use server'

import { unstable_cache } from 'next/cache'
import type { PerformanceAnalysis } from '../types'
import { createAnalysisItem, calculateScore } from './helpers'

async function fetchPerformanceAnalysis(url: string): Promise<PerformanceAnalysis> {
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
            score: calculateScore(analysisItems)
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
            score: 0
        }
    }
}

export const analyzePerformance = unstable_cache(
    fetchPerformanceAnalysis,
    ['site-check-performance'],
    { revalidate: 3600 }
)
