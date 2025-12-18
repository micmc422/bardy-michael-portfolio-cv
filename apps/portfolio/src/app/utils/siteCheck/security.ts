'use server'

import { unstable_cache } from 'next/cache'
import type { SecurityAnalysis } from '../types'
import { createAnalysisItem, calculateScore } from './helpers'

async function fetchSecurityAnalysis(url: string): Promise<SecurityAnalysis> {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SiteCheckBot/1.0)'
            }
        })
        clearTimeout(timeoutId)

        const isHttps = url.startsWith('https://')
        const httpsItem = createAnalysisItem(
            'HTTPS',
            isHttps ? 'Activé' : 'Désactivé',
            isHttps ? 'success' : 'error',
            isHttps ? 'Connexion sécurisée' : 'Connexion non sécurisée',
            !isHttps ? 'RISQUE CRITIQUE : Sans HTTPS, les données des utilisateurs peuvent être interceptées. Google pénalise aussi les sites non sécurisés.' : undefined,
            !isHttps ? 'Installez un certificat SSL/TLS (Let\'s Encrypt) et forcez la redirection HTTP→HTTPS. Docs: https://web.dev/articles/why-https-matters' : undefined
        )

        const hsts = response.headers.get('strict-transport-security')
        const hstsItem = createAnalysisItem(
            'HSTS',
            hsts ? 'Configuré' : 'Absent',
            hsts ? 'success' : 'warning',
            hsts ? 'En-tête HSTS présent' : 'En-tête HSTS manquant',
            !hsts ? 'Sans HSTS, les utilisateurs peuvent être redirigés vers une version HTTP non sécurisée.' : undefined,
            !hsts ? 'Ajoutez: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload. Docs: https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security' : undefined
        )

        const csp = response.headers.get('content-security-policy')
        const cspItem = createAnalysisItem(
            'Content-Security-Policy',
            csp ? 'Configuré' : 'Absent',
            csp ? 'success' : 'warning',
            csp ? 'Politique de sécurité du contenu définie' : 'CSP manquant',
            !csp ? 'Sans CSP, votre site est vulnérable aux attaques XSS (cross-site scripting).' : undefined,
            !csp ? 'Exemple: Content-Security-Policy: default-src \'self\'; script-src \'self\' https://www.googletagmanager.com; object-src \'none\'; frame-ancestors \'self\'. Docs: https://developer.mozilla.org/docs/Web/HTTP/CSP' : undefined
        )

        const xfo = response.headers.get('x-frame-options')
        const xfoItem = createAnalysisItem(
            'X-Frame-Options',
            xfo ? 'Configuré' : 'Absent',
            xfo ? 'success' : 'warning',
            xfo ? `Valeur: ${xfo}` : 'Protection contre le clickjacking manquante',
            !xfo ? 'Votre site peut être intégré dans des iframes malveillantes (attaque clickjacking).' : undefined,
            !xfo ? 'Ajoutez: X-Frame-Options: DENY (ou SAMEORIGIN). Idéalement, utilisez CSP frame-ancestors. Docs: https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Frame-Options' : undefined
        )

        const xcto = response.headers.get('x-content-type-options')
        const xctoItem = createAnalysisItem(
            'X-Content-Type-Options',
            xcto ? 'Configuré' : 'Absent',
            xcto ? 'success' : 'warning',
            xcto ? 'Protection MIME activée' : 'Protection MIME manquante',
            !xcto ? 'Les navigateurs peuvent mal interpréter le type de fichier, créant une faille de sécurité.' : undefined,
            !xcto ? 'Ajoutez: X-Content-Type-Options: nosniff. Docs: https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Content-Type-Options' : undefined
        )

        // Mixed content check (improved to check multiple resource types)
        const html = await response.text()
        const hasMixedContent = isHttps && (
            /src=["']http:\/\//i.test(html) || 
            /href=["']http:\/\/[^"']+\.(css|js)/i.test(html) ||
            /action=["']http:\/\//i.test(html)
        )
        const mixedItem = createAnalysisItem(
            'Contenu mixte',
            hasMixedContent ? 'Détecté' : 'Aucun',
            hasMixedContent ? 'error' : 'success',
            hasMixedContent ? 'Ressources HTTP détectées sur page HTTPS' : 'Pas de contenu mixte détecté',
            hasMixedContent ? 'Le contenu mixte bloque certaines ressources et affiche des avertissements de sécurité.' : undefined,
            hasMixedContent ? 'Remplacez toutes les URLs HTTP par HTTPS, ou utilisez CSP upgrade-insecure-requests avec prudence. Docs: https://developer.mozilla.org/docs/Web/Security/Mixed_content' : undefined
        )

        const analysisItems = [httpsItem, hstsItem, cspItem, xfoItem, xctoItem, mixedItem]

        return {
            url,
            https: httpsItem,
            hsts: hstsItem,
            csp: cspItem,
            xFrameOptions: xfoItem,
            xContentTypeOptions: xctoItem,
            mixedContent: mixedItem,
            score: calculateScore(analysisItems)
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        const errorItem = createAnalysisItem('Erreur', errorMessage, 'error', 'Impossible d\'analyser la sécurité')
        return {
            url,
            https: errorItem,
            hsts: errorItem,
            csp: errorItem,
            xFrameOptions: errorItem,
            xContentTypeOptions: errorItem,
            mixedContent: errorItem,
            score: 0
        }
    }
}

export const analyzeSecurity = unstable_cache(
    fetchSecurityAnalysis,
    ['site-check-security'],
    { revalidate: 3600 }
)
