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
    description?: string,
    impact?: string,
    recommendation?: string
): AnalysisItem {
    return { label, value, status, description, impact, recommendation }
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
            title ? `${title.length} caractères` : 'Aucune balise title trouvée',
            !title ? 'Sans titre, votre page n\'apparaîtra pas correctement dans les résultats de recherche Google.' : title.length < 30 || title.length > 60 ? 'Un titre mal optimisé réduit le taux de clic dans les résultats de recherche.' : undefined,
            !title ? 'Ajoutez une balise <title> unique et descriptive (30-60 caractères).' : title.length < 30 ? 'Allongez votre titre pour mieux décrire le contenu de la page.' : title.length > 60 ? 'Raccourcissez votre titre pour éviter qu\'il soit tronqué dans Google.' : undefined
        )

        // Meta description
        const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
        const description = descMatch?.[1]?.trim() ?? ''
        const descItem = createAnalysisItem(
            'Meta Description',
            description ? (description.length <= 50 ? description : `${description.substring(0, 47)}...`) : 'Absente',
            description ? (description.length >= 120 && description.length <= 160 ? 'success' : 'warning') : 'error',
            description ? `${description.length} caractères` : 'Aucune meta description trouvée',
            !description ? 'Sans meta description, Google génère un extrait aléatoire de votre page.' : description.length < 120 || description.length > 160 ? 'Une description mal optimisée peut réduire le taux de clic de 10-20%.' : undefined,
            !description ? 'Ajoutez une meta description engageante (120-160 caractères).' : description.length < 120 ? 'Allongez votre description pour inclure plus de mots-clés.' : description.length > 160 ? 'Raccourcissez votre description pour éviter la troncature.' : undefined
        )

        // Headings
        const h1Count = (html.match(/<h1[^>]*>/gi) || []).length
        const h2Count = (html.match(/<h2[^>]*>/gi) || []).length
        const headingsItem = createAnalysisItem(
            'Structure des titres',
            `${h1Count} H1, ${h2Count} H2`,
            h1Count === 1 ? 'success' : h1Count === 0 ? 'error' : 'warning',
            h1Count === 1 ? 'Structure correcte' : h1Count === 0 ? 'Aucun H1 trouvé' : 'Plusieurs H1 détectés',
            h1Count !== 1 ? 'Une mauvaise structure de titres nuit à la compréhension de votre page par Google.' : undefined,
            h1Count === 0 ? 'Ajoutez un H1 unique qui décrit le sujet principal de la page.' : h1Count > 1 ? 'Gardez un seul H1 et utilisez H2-H6 pour les sous-sections.' : undefined
        )

        // Images alt check - empty alt="" is valid for decorative images
        const imgTags = html.match(/<img[^>]*>/gi) || []
        const imgsWithAlt = imgTags.filter(img => /alt=["'][^"']*["']/i.test(img)).length
        const altRatio = imgTags.length > 0 ? imgsWithAlt / imgTags.length : 1
        const imgItem = createAnalysisItem(
            'Images avec Alt',
            `${imgsWithAlt}/${imgTags.length}`,
            imgTags.length === 0 || imgsWithAlt === imgTags.length ? 'success' : altRatio >= 0.8 ? 'warning' : 'error',
            imgTags.length === 0 ? 'Aucune image trouvée' : `${Math.round(altRatio * 100)}% des images ont un attribut alt`,
            altRatio < 1 && imgTags.length > 0 ? 'Les images sans alt pénalisent l\'accessibilité et le référencement image.' : undefined,
            altRatio < 1 && imgTags.length > 0 ? 'Ajoutez des attributs alt descriptifs à toutes les images.' : undefined
        )

        // Links - count all links (internal and external)
        const allLinks = (html.match(/<a[^>]+href=["'][^"'#]+["']/gi) || []).length
        const linksItem = createAnalysisItem(
            'Liens',
            allLinks,
            allLinks > 5 ? 'success' : allLinks > 0 ? 'warning' : 'error',
            `${allLinks} liens trouvés sur la page`,
            allLinks <= 5 ? 'Peu de liens internes limitent le crawl de Google et la navigation.' : undefined,
            allLinks <= 5 ? 'Ajoutez des liens vers d\'autres pages de votre site pour améliorer le maillage interne.' : undefined
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
            sitemapExists ? 'sitemap.xml trouvé' : 'Aucun sitemap.xml trouvé',
            !sitemapExists ? 'Sans sitemap, Google peut manquer certaines pages de votre site.' : undefined,
            !sitemapExists ? 'Créez et soumettez un sitemap.xml à Google Search Console.' : undefined
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
            robotsExists ? 'robots.txt trouvé' : 'Aucun robots.txt trouvé',
            !robotsExists ? 'Sans robots.txt, vous ne contrôlez pas ce que Google indexe.' : undefined,
            !robotsExists ? 'Créez un fichier robots.txt pour guider les robots d\'indexation.' : undefined
        )

        // Viewport
        const viewportMatch = html.match(/<meta[^>]+name=["']viewport["']/i)
        const viewportItem = createAnalysisItem(
            'Viewport',
            viewportMatch ? 'Configuré' : 'Absent',
            viewportMatch ? 'success' : 'error',
            viewportMatch ? 'Balise viewport détectée' : 'Balise viewport manquante',
            !viewportMatch ? 'Sans viewport, votre site ne s\'affichera pas correctement sur mobile.' : undefined,
            !viewportMatch ? 'Ajoutez <meta name="viewport" content="width=device-width, initial-scale=1">.' : undefined
        )

        // Structured Data
        const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["']/i.test(html)
        const structuredItem = createAnalysisItem(
            'Données structurées',
            hasJsonLd ? 'Présentes' : 'Absentes',
            hasJsonLd ? 'success' : 'warning',
            hasJsonLd ? 'JSON-LD détecté' : 'Aucune donnée structurée trouvée',
            !hasJsonLd ? 'Les données structurées permettent d\'obtenir des résultats enrichis (étoiles, prix...).' : undefined,
            !hasJsonLd ? 'Ajoutez du JSON-LD pour améliorer votre visibilité dans les résultats Google.' : undefined
        )

        // Open Graph
        const hasOg = /<meta[^>]+property=["']og:/i.test(html)
        const ogItem = createAnalysisItem(
            'Open Graph',
            hasOg ? 'Configuré' : 'Absent',
            hasOg ? 'success' : 'warning',
            hasOg ? 'Balises OG détectées' : 'Balises Open Graph manquantes',
            !hasOg ? 'Sans Open Graph, les partages sur les réseaux sociaux seront moins attractifs.' : undefined,
            !hasOg ? 'Ajoutez les balises og:title, og:description et og:image.' : undefined
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
            isHttps ? 'Connexion sécurisée' : 'Connexion non sécurisée',
            !isHttps ? 'RISQUE CRITIQUE : Sans HTTPS, les données des utilisateurs peuvent être interceptées. Google pénalise aussi les sites non sécurisés.' : undefined,
            !isHttps ? 'Installez un certificat SSL/TLS (gratuit avec Let\'s Encrypt) et redirigez HTTP vers HTTPS.' : undefined
        )

        const hsts = response.headers.get('strict-transport-security')
        const hstsItem = createAnalysisItem(
            'HSTS',
            hsts ? 'Configuré' : 'Absent',
            hsts ? 'success' : 'warning',
            hsts ? 'En-tête HSTS présent' : 'En-tête HSTS manquant',
            !hsts ? 'Sans HSTS, les utilisateurs peuvent être redirigés vers une version HTTP non sécurisée.' : undefined,
            !hsts ? 'Ajoutez l\'en-tête Strict-Transport-Security avec une durée d\'au moins 1 an.' : undefined
        )

        const csp = response.headers.get('content-security-policy')
        const cspItem = createAnalysisItem(
            'Content-Security-Policy',
            csp ? 'Configuré' : 'Absent',
            csp ? 'success' : 'warning',
            csp ? 'Politique de sécurité du contenu définie' : 'CSP manquant',
            !csp ? 'Sans CSP, votre site est vulnérable aux attaques XSS (cross-site scripting).' : undefined,
            !csp ? 'Configurez une politique CSP pour contrôler les sources de contenu autorisées.' : undefined
        )

        const xfo = response.headers.get('x-frame-options')
        const xfoItem = createAnalysisItem(
            'X-Frame-Options',
            xfo ? 'Configuré' : 'Absent',
            xfo ? 'success' : 'warning',
            xfo ? `Valeur: ${xfo}` : 'Protection contre le clickjacking manquante',
            !xfo ? 'Votre site peut être intégré dans des iframes malveillantes (attaque clickjacking).' : undefined,
            !xfo ? 'Ajoutez l\'en-tête X-Frame-Options: DENY ou SAMEORIGIN.' : undefined
        )

        const xcto = response.headers.get('x-content-type-options')
        const xctoItem = createAnalysisItem(
            'X-Content-Type-Options',
            xcto ? 'Configuré' : 'Absent',
            xcto ? 'success' : 'warning',
            xcto ? 'Protection MIME activée' : 'Protection MIME manquante',
            !xcto ? 'Les navigateurs peuvent mal interpréter le type de fichier, créant une faille de sécurité.' : undefined,
            !xcto ? 'Ajoutez l\'en-tête X-Content-Type-Options: nosniff.' : undefined
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
            hasMixedContent ? 'Remplacez toutes les URLs HTTP par HTTPS ou utilisez des URLs relatives.' : undefined
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
            langValue ? `Langue: ${langValue}` : 'Attribut lang manquant sur <html>',
            !langValue ? 'Les lecteurs d\'écran ne pourront pas prononcer correctement le contenu.' : undefined,
            !langValue ? 'Ajoutez lang="fr" (ou la langue appropriée) sur la balise <html>.' : undefined
        )

        // ARIA attributes
        const ariaCount = (html.match(/aria-[a-z]+=/gi) || []).length
        const roleCount = (html.match(/role=["'][^"']+["']/gi) || []).length
        const ariaItem = createAnalysisItem(
            'Attributs ARIA',
            `${ariaCount} attributs, ${roleCount} rôles`,
            ariaCount > 0 || roleCount > 0 ? 'success' : 'warning',
            ariaCount > 0 ? 'Attributs ARIA détectés' : 'Peu ou pas d\'attributs ARIA',
            ariaCount === 0 && roleCount === 0 ? 'Les utilisateurs de technologies d\'assistance auront du mal à naviguer.' : undefined,
            ariaCount === 0 && roleCount === 0 ? 'Ajoutez des attributs ARIA pour améliorer la navigation assistée.' : undefined
        )

        // Form labels - count visible form inputs that need labels
        const allInputs = html.match(/<input[^>]*>/gi) || []
        const visibleInputs = allInputs.filter(input => {
            const typeMatch = input.match(/type=["']([^"']+)["']/i)
            const inputType = typeMatch?.[1]?.toLowerCase() ?? 'text'
            return !['hidden', 'submit', 'button', 'reset', 'image'].includes(inputType)
        }).length
        const labels = (html.match(/<label[^>]*>/gi) || []).length
        const labelRatio = visibleInputs > 0 ? labels / visibleInputs : 1
        const formLabelsItem = createAnalysisItem(
            'Labels de formulaire',
            `${labels} labels, ${visibleInputs} champs`,
            visibleInputs === 0 || labelRatio >= 0.8 ? 'success' : labelRatio >= 0.5 ? 'warning' : 'error',
            visibleInputs === 0 ? 'Aucun champ de formulaire' : `${Math.round(labelRatio * 100)}% des champs ont un label`,
            visibleInputs > 0 && labelRatio < 0.8 ? 'Les champs sans label sont inaccessibles pour les personnes malvoyantes.' : undefined,
            visibleInputs > 0 && labelRatio < 0.8 ? 'Associez un <label> à chaque champ de formulaire.' : undefined
        )

        // Alt texts
        const imgTags = html.match(/<img[^>]*>/gi) || []
        const imgsWithAlt = imgTags.filter(img => /alt=["'][^"']*["']/i.test(img)).length
        const altRatio = imgTags.length > 0 ? imgsWithAlt / imgTags.length : 1
        const altItem = createAnalysisItem(
            'Textes alternatifs',
            `${imgsWithAlt}/${imgTags.length} images`,
            imgTags.length === 0 || imgsWithAlt === imgTags.length ? 'success' : altRatio >= 0.8 ? 'warning' : 'error',
            imgTags.length === 0 ? 'Aucune image' : `${Math.round(altRatio * 100)}% des images ont un alt`,
            imgTags.length > 0 && altRatio < 1 ? 'Les images sans alt sont invisibles pour les lecteurs d\'écran.' : undefined,
            imgTags.length > 0 && altRatio < 1 ? 'Ajoutez un attribut alt descriptif à chaque image.' : undefined
        )

        // Landmarks
        const landmarks = (html.match(/<(header|nav|main|footer|aside|section|article)[^>]*>/gi) || []).length
        const landmarksItem = createAnalysisItem(
            'Landmarks',
            `${landmarks} éléments`,
            landmarks >= 3 ? 'success' : landmarks > 0 ? 'warning' : 'error',
            landmarks >= 3 ? 'Bonne structure sémantique' : 'Structure sémantique à améliorer',
            landmarks < 3 ? 'Une structure sémantique pauvre nuit à la navigation au clavier et aux lecteurs d\'écran.' : undefined,
            landmarks < 3 ? 'Utilisez <header>, <nav>, <main>, <footer> pour structurer votre page.' : undefined
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
