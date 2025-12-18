'use server'

import { unstable_cache } from 'next/cache'
import type { MobileAnalysis } from '../types'
import { createAnalysisItem, calculateScore } from './helpers'

async function fetchMobileAnalysis(url: string): Promise<MobileAnalysis> {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
            }
        })
        clearTimeout(timeoutId)

        const html = await response.text()

        // Viewport meta
        const viewportMatch = html.match(/<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["']/i)
        const viewport = viewportMatch?.[1] ?? ''
        const hasWidthDevice = viewport.includes('width=device-width')
        const viewportItem = createAnalysisItem(
            'Viewport',
            hasWidthDevice ? 'Configuré' : 'Non optimal',
            hasWidthDevice ? 'success' : viewport ? 'warning' : 'error',
            hasWidthDevice ? 'width=device-width détecté' : viewport ? 'Viewport incomplet' : 'Balise viewport manquante',
            !hasWidthDevice ? 'Sans viewport correct, votre site ne s\'adaptera pas aux écrans mobiles.' : undefined,
            !hasWidthDevice ? 'Ajoutez <meta name="viewport" content="width=device-width, initial-scale=1">.' : undefined
        )

        // Responsive design indicators
        const hasMediaQueries = /@media[^{]+\{/i.test(html) || 
            (html.match(/<link[^>]+media=["'][^"']+["']/gi) || []).length > 0
        const hasFlexGrid = /display:\s*(flex|grid)/i.test(html)
        const responsiveItem = createAnalysisItem(
            'Design responsive',
            hasMediaQueries || hasFlexGrid ? 'Détecté' : 'Non détecté',
            hasMediaQueries || hasFlexGrid ? 'success' : 'warning',
            hasMediaQueries ? 'Media queries détectées' : hasFlexGrid ? 'Flexbox/Grid détecté' : 'Pas d\'indices de responsive design',
            !hasMediaQueries && !hasFlexGrid ? 'Votre site peut être difficile à utiliser sur mobile (60% du trafic web).' : undefined,
            !hasMediaQueries && !hasFlexGrid ? 'Utilisez des media queries et un système de grille flexible.' : undefined
        )

        // Touch targets (checking for buttons/links)
        const interactiveElements = (html.match(/<(button|a)[^>]*>/gi) || []).length
        const touchItem = createAnalysisItem(
            'Éléments interactifs',
            `${interactiveElements} éléments`,
            interactiveElements > 0 ? 'success' : 'warning',
            'Vérifier manuellement la taille des cibles tactiles (min 48x48px)',
            'Des cibles tactiles trop petites rendent la navigation frustrante sur mobile.',
            'Assurez-vous que tous les boutons et liens font au moins 48x48 pixels.'
        )

        // Font sizes (check for rem/em usage)
        const hasRelativeFonts = /font-size:\s*[\d.]+(?:rem|em)/i.test(html)
        const fontItem = createAnalysisItem(
            'Tailles de police',
            hasRelativeFonts ? 'Relatives' : 'À vérifier',
            hasRelativeFonts ? 'success' : 'warning',
            hasRelativeFonts ? 'Unités relatives détectées (rem/em)' : 'Vérifier l\'utilisation d\'unités relatives',
            !hasRelativeFonts ? 'Des polices en pixels fixes peuvent être trop petites ou grandes selon l\'écran.' : undefined,
            !hasRelativeFonts ? 'Utilisez des unités rem ou em pour des tailles de police adaptatives.' : undefined
        )

        const analysisItems = [viewportItem, responsiveItem, touchItem, fontItem]

        return {
            url,
            viewport: viewportItem,
            responsiveDesign: responsiveItem,
            touchTargets: touchItem,
            fontSizes: fontItem,
            score: calculateScore(analysisItems)
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        const errorItem = createAnalysisItem('Erreur', errorMessage, 'error', 'Impossible d\'analyser la compatibilité mobile')
        return {
            url,
            viewport: errorItem,
            responsiveDesign: errorItem,
            touchTargets: errorItem,
            fontSizes: errorItem,
            score: 0
        }
    }
}

export const analyzeMobile = unstable_cache(
    fetchMobileAnalysis,
    ['site-check-mobile'],
    { revalidate: 3600 }
)
