'use server'

import { unstable_cache } from 'next/cache'
import type {
    PerformanceAnalysis,
    SEOAnalysis,
    SecurityAnalysis,
    AccessibilityAnalysis,
    MobileAnalysis,
    AnalysisItem,
    AnalysisStatus
} from './types'

function createAnalysisItem(
    label: string,
    value: string | number | boolean,
    status: AnalysisStatus,
    description?: string
): AnalysisItem {
    return { label, value, status, description }
}

function calculateScore(items: AnalysisItem[]): number {
    const weights = { success: 100, warning: 50, error: 0 }
    const total = items.reduce((sum, item) => sum + weights[item.status], 0)
    return Math.round(total / items.length)
}

// Performance Analysis
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
            loadTime < 1000 ? 'Excellent temps de réponse' : loadTime < 3000 ? 'Temps de réponse acceptable' : 'Temps de réponse lent'
        )

        const pageSizeKB = Math.round(contentLength / 1024)
        const pageSizeItem = createAnalysisItem(
            'Taille de la page',
            `${pageSizeKB} KB`,
            pageSizeKB < 500 ? 'success' : pageSizeKB < 2000 ? 'warning' : 'error',
            pageSizeKB < 500 ? 'Taille optimale' : pageSizeKB < 2000 ? 'Taille acceptable' : 'Page trop lourde'
        )

        const totalRequests = cssCount + jsCount + imgCount
        const requestCountItem = createAnalysisItem(
            'Nombre de ressources',
            totalRequests,
            totalRequests < 30 ? 'success' : totalRequests < 60 ? 'warning' : 'error',
            `${cssCount} CSS, ${jsCount} JS, ${imgCount} images`
        )

        const compressionItem = createAnalysisItem(
            'Compression',
            contentEncoding !== 'none' ? 'Activée' : 'Désactivée',
            contentEncoding !== 'none' ? 'success' : 'warning',
            contentEncoding !== 'none' ? `Compression ${contentEncoding} détectée` : 'Aucune compression détectée'
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

// SEO Analysis
async function fetchSEOAnalysis(url: string): Promise<SEOAnalysis> {
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

        const html = await response.text()

        // Title check
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        const title = titleMatch?.[1]?.trim() ?? ''
        const titleItem = createAnalysisItem(
            'Balise Title',
            title ? (title.length <= 60 ? title : `${title.substring(0, 57)}...`) : 'Absente',
            title ? (title.length >= 30 && title.length <= 60 ? 'success' : 'warning') : 'error',
            title ? `${title.length} caractères` : 'Aucune balise title trouvée'
        )

        // Meta description
        const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
        const description = descMatch?.[1]?.trim() ?? ''
        const descItem = createAnalysisItem(
            'Meta Description',
            description ? (description.length <= 50 ? description : `${description.substring(0, 47)}...`) : 'Absente',
            description ? (description.length >= 120 && description.length <= 160 ? 'success' : 'warning') : 'error',
            description ? `${description.length} caractères` : 'Aucune meta description trouvée'
        )

        // Headings
        const h1Count = (html.match(/<h1[^>]*>/gi) || []).length
        const h2Count = (html.match(/<h2[^>]*>/gi) || []).length
        const headingsItem = createAnalysisItem(
            'Structure des titres',
            `${h1Count} H1, ${h2Count} H2`,
            h1Count === 1 ? 'success' : h1Count === 0 ? 'error' : 'warning',
            h1Count === 1 ? 'Structure correcte' : h1Count === 0 ? 'Aucun H1 trouvé' : 'Plusieurs H1 détectés'
        )

        // Images alt check
        const imgTags = html.match(/<img[^>]*>/gi) || []
        const imgsWithAlt = imgTags.filter(img => /alt=["'][^"']+["']/i.test(img)).length
        const imgItem = createAnalysisItem(
            'Images avec Alt',
            `${imgsWithAlt}/${imgTags.length}`,
            imgTags.length === 0 || imgsWithAlt === imgTags.length ? 'success' : imgsWithAlt / imgTags.length >= 0.8 ? 'warning' : 'error',
            imgTags.length === 0 ? 'Aucune image trouvée' : `${Math.round(imgsWithAlt / imgTags.length * 100)}% des images ont un attribut alt`
        )

        // Links
        const internalLinks = (html.match(/<a[^>]+href=["'][^"'#]+["']/gi) || []).length
        const linksItem = createAnalysisItem(
            'Liens internes',
            internalLinks,
            internalLinks > 5 ? 'success' : internalLinks > 0 ? 'warning' : 'error',
            `${internalLinks} liens trouvés`
        )

        // Sitemap check
        const sitemapUrl = new URL('/sitemap.xml', url).toString()
        let sitemapExists = false
        try {
            const sitemapRes = await fetch(sitemapUrl, { method: 'HEAD' })
            sitemapExists = sitemapRes.ok
        } catch {
            sitemapExists = false
        }
        const sitemapItem = createAnalysisItem(
            'Sitemap',
            sitemapExists ? 'Présent' : 'Absent',
            sitemapExists ? 'success' : 'warning',
            sitemapExists ? 'sitemap.xml trouvé' : 'Aucun sitemap.xml trouvé'
        )

        // Robots.txt check
        const robotsUrl = new URL('/robots.txt', url).toString()
        let robotsExists = false
        try {
            const robotsRes = await fetch(robotsUrl, { method: 'HEAD' })
            robotsExists = robotsRes.ok
        } catch {
            robotsExists = false
        }
        const robotsItem = createAnalysisItem(
            'Robots.txt',
            robotsExists ? 'Présent' : 'Absent',
            robotsExists ? 'success' : 'warning',
            robotsExists ? 'robots.txt trouvé' : 'Aucun robots.txt trouvé'
        )

        // Viewport
        const viewportMatch = html.match(/<meta[^>]+name=["']viewport["']/i)
        const viewportItem = createAnalysisItem(
            'Viewport',
            viewportMatch ? 'Configuré' : 'Absent',
            viewportMatch ? 'success' : 'error',
            viewportMatch ? 'Balise viewport détectée' : 'Balise viewport manquante'
        )

        // Structured Data
        const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["']/i.test(html)
        const structuredItem = createAnalysisItem(
            'Données structurées',
            hasJsonLd ? 'Présentes' : 'Absentes',
            hasJsonLd ? 'success' : 'warning',
            hasJsonLd ? 'JSON-LD détecté' : 'Aucune donnée structurée trouvée'
        )

        // Open Graph
        const hasOg = /<meta[^>]+property=["']og:/i.test(html)
        const ogItem = createAnalysisItem(
            'Open Graph',
            hasOg ? 'Configuré' : 'Absent',
            hasOg ? 'success' : 'warning',
            hasOg ? 'Balises OG détectées' : 'Balises Open Graph manquantes'
        )

        const analysisItems = [titleItem, descItem, headingsItem, imgItem, linksItem, sitemapItem, robotsItem, viewportItem, structuredItem, ogItem]

        return {
            url,
            title: titleItem,
            description: descItem,
            headings: headingsItem,
            images: imgItem,
            links: linksItem,
            sitemap: sitemapItem,
            robots: robotsItem,
            viewport: viewportItem,
            structuredData: structuredItem,
            ogTags: ogItem,
            score: calculateScore(analysisItems)
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        const errorItem = createAnalysisItem('Erreur', errorMessage, 'error', 'Impossible d\'analyser le SEO')
        return {
            url,
            title: errorItem,
            description: errorItem,
            headings: errorItem,
            images: errorItem,
            links: errorItem,
            sitemap: errorItem,
            robots: errorItem,
            viewport: errorItem,
            structuredData: errorItem,
            ogTags: errorItem,
            score: 0
        }
    }
}

export const analyzeSEO = unstable_cache(
    fetchSEOAnalysis,
    ['site-check-seo'],
    { revalidate: 3600 }
)

// Security Analysis
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
            isHttps ? 'Connexion sécurisée' : 'Connexion non sécurisée'
        )

        const hsts = response.headers.get('strict-transport-security')
        const hstsItem = createAnalysisItem(
            'HSTS',
            hsts ? 'Configuré' : 'Absent',
            hsts ? 'success' : 'warning',
            hsts ? 'En-tête HSTS présent' : 'En-tête HSTS manquant'
        )

        const csp = response.headers.get('content-security-policy')
        const cspItem = createAnalysisItem(
            'Content-Security-Policy',
            csp ? 'Configuré' : 'Absent',
            csp ? 'success' : 'warning',
            csp ? 'Politique de sécurité du contenu définie' : 'CSP manquant'
        )

        const xfo = response.headers.get('x-frame-options')
        const xfoItem = createAnalysisItem(
            'X-Frame-Options',
            xfo ? 'Configuré' : 'Absent',
            xfo ? 'success' : 'warning',
            xfo ? `Valeur: ${xfo}` : 'Protection contre le clickjacking manquante'
        )

        const xcto = response.headers.get('x-content-type-options')
        const xctoItem = createAnalysisItem(
            'X-Content-Type-Options',
            xcto ? 'Configuré' : 'Absent',
            xcto ? 'success' : 'warning',
            xcto ? 'Protection MIME activée' : 'Protection MIME manquante'
        )

        // Mixed content check (simple check via HTML)
        const html = await response.text()
        const hasMixedContent = isHttps && /src=["']http:\/\//i.test(html)
        const mixedItem = createAnalysisItem(
            'Contenu mixte',
            hasMixedContent ? 'Détecté' : 'Aucun',
            hasMixedContent ? 'error' : 'success',
            hasMixedContent ? 'Ressources HTTP sur page HTTPS' : 'Pas de contenu mixte détecté'
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

// Accessibility Analysis
async function fetchAccessibilityAnalysis(url: string): Promise<AccessibilityAnalysis> {
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

        const html = await response.text()

        // Language attribute
        const langMatch = html.match(/<html[^>]+lang=["']([^"']+)["']/i)
        const langValue = langMatch?.[1] ?? ''
        const langItem = createAnalysisItem(
            'Attribut lang',
            langValue || 'Absent',
            langValue ? 'success' : 'error',
            langValue ? `Langue: ${langValue}` : 'Attribut lang manquant sur <html>'
        )

        // ARIA attributes
        const ariaCount = (html.match(/aria-[a-z]+=/gi) || []).length
        const roleCount = (html.match(/role=["'][^"']+["']/gi) || []).length
        const ariaItem = createAnalysisItem(
            'Attributs ARIA',
            `${ariaCount} attributs, ${roleCount} rôles`,
            ariaCount > 0 || roleCount > 0 ? 'success' : 'warning',
            ariaCount > 0 ? 'Attributs ARIA détectés' : 'Peu ou pas d\'attributs ARIA'
        )

        // Form labels
        const inputs = (html.match(/<input[^>]+type=["'](?!hidden|submit|button|reset)[^"']*["'][^>]*>/gi) || []).length
        const labels = (html.match(/<label[^>]*>/gi) || []).length
        const formLabelsItem = createAnalysisItem(
            'Labels de formulaire',
            `${labels} labels, ${inputs} champs`,
            inputs === 0 || labels >= inputs * 0.8 ? 'success' : labels >= inputs * 0.5 ? 'warning' : 'error',
            inputs === 0 ? 'Aucun champ de formulaire' : `${Math.round(labels / inputs * 100)}% des champs ont un label`
        )

        // Alt texts
        const imgTags = html.match(/<img[^>]*>/gi) || []
        const imgsWithAlt = imgTags.filter(img => /alt=["'][^"']*["']/i.test(img)).length
        const altItem = createAnalysisItem(
            'Textes alternatifs',
            `${imgsWithAlt}/${imgTags.length} images`,
            imgTags.length === 0 || imgsWithAlt === imgTags.length ? 'success' : imgsWithAlt / imgTags.length >= 0.8 ? 'warning' : 'error',
            imgTags.length === 0 ? 'Aucune image' : `${Math.round(imgsWithAlt / imgTags.length * 100)}% des images ont un alt`
        )

        // Landmarks
        const landmarks = (html.match(/<(header|nav|main|footer|aside|section|article)[^>]*>/gi) || []).length
        const landmarksItem = createAnalysisItem(
            'Landmarks',
            `${landmarks} éléments`,
            landmarks >= 3 ? 'success' : landmarks > 0 ? 'warning' : 'error',
            landmarks >= 3 ? 'Bonne structure sémantique' : 'Structure sémantique à améliorer'
        )

        const analysisItems = [langItem, ariaItem, formLabelsItem, altItem, landmarksItem]

        return {
            url,
            language: langItem,
            ariaAttributes: ariaItem,
            formLabels: formLabelsItem,
            altTexts: altItem,
            landmarks: landmarksItem,
            score: calculateScore(analysisItems)
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        const errorItem = createAnalysisItem('Erreur', errorMessage, 'error', 'Impossible d\'analyser l\'accessibilité')
        return {
            url,
            language: errorItem,
            ariaAttributes: errorItem,
            formLabels: errorItem,
            altTexts: errorItem,
            landmarks: errorItem,
            score: 0
        }
    }
}

export const analyzeAccessibility = unstable_cache(
    fetchAccessibilityAnalysis,
    ['site-check-accessibility'],
    { revalidate: 3600 }
)

// Mobile Analysis
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
            hasWidthDevice ? 'width=device-width détecté' : viewport ? 'Viewport incomplet' : 'Balise viewport manquante'
        )

        // Responsive design indicators
        const hasMediaQueries = /@media[^{]+\{/i.test(html) || 
            (html.match(/<link[^>]+media=["'][^"']+["']/gi) || []).length > 0
        const hasFlexGrid = /display:\s*(flex|grid)/i.test(html)
        const responsiveItem = createAnalysisItem(
            'Design responsive',
            hasMediaQueries || hasFlexGrid ? 'Détecté' : 'Non détecté',
            hasMediaQueries || hasFlexGrid ? 'success' : 'warning',
            hasMediaQueries ? 'Media queries détectées' : hasFlexGrid ? 'Flexbox/Grid détecté' : 'Pas d\'indices de responsive design'
        )

        // Touch targets (checking for buttons/links)
        const interactiveElements = (html.match(/<(button|a)[^>]*>/gi) || []).length
        const touchItem = createAnalysisItem(
            'Éléments interactifs',
            `${interactiveElements} éléments`,
            interactiveElements > 0 ? 'success' : 'warning',
            'Vérifier manuellement la taille des cibles tactiles (min 48x48px)'
        )

        // Font sizes (check for rem/em usage)
        const hasRelativeFonts = /font-size:\s*[\d.]+(?:rem|em)/i.test(html)
        const fontItem = createAnalysisItem(
            'Tailles de police',
            hasRelativeFonts ? 'Relatives' : 'À vérifier',
            hasRelativeFonts ? 'success' : 'warning',
            hasRelativeFonts ? 'Unités relatives détectées (rem/em)' : 'Vérifier l\'utilisation d\'unités relatives'
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
