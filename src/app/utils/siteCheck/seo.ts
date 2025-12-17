'use server'

import { unstable_cache } from 'next/cache'
import type { SEOAnalysis, OpenGraphData, JsonLdData } from '../types'
import { createAnalysisItem, calculateScore } from './helpers'

/**
 * Extract Open Graph and Twitter Card metadata from HTML.
 */
function extractOpenGraphData(html: string): OpenGraphData {
    const getMetaContent = (property: string): string | undefined => {
        const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
            html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i'))
        return match?.[1]?.trim()
    }

    return {
        title: getMetaContent('og:title'),
        description: getMetaContent('og:description'),
        image: getMetaContent('og:image'),
        url: getMetaContent('og:url'),
        type: getMetaContent('og:type'),
        siteName: getMetaContent('og:site_name'),
        locale: getMetaContent('og:locale'),
        // Twitter Card
        twitterCard: getMetaContent('twitter:card'),
        twitterSite: getMetaContent('twitter:site'),
        twitterCreator: getMetaContent('twitter:creator'),
        twitterTitle: getMetaContent('twitter:title'),
        twitterDescription: getMetaContent('twitter:description'),
        twitterImage: getMetaContent('twitter:image'),
    }
}

/**
 * Extract all JSON-LD structured data from HTML.
 */
function extractJsonLdData(html: string): JsonLdData[] {
    const jsonLdScripts = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
    const results: JsonLdData[] = []

    for (const script of jsonLdScripts) {
        const contentMatch = script.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)
        if (contentMatch?.[1]) {
            try {
                const raw = contentMatch[1].trim()
                const parsed = JSON.parse(raw) as Record<string, unknown>
                const type = (parsed['@type'] as string) || 'Unknown'
                results.push({ type, raw, parsed })
            } catch {
                // Invalid JSON, skip
            }
        }
    }

    return results
}

/**
 * Extract all meta tags from HTML.
 */
function extractMetaTags(html: string): Record<string, string> {
    const metaTags: Record<string, string> = {}

    // Match meta tags with name attribute
    const nameMatches = html.matchAll(/<meta[^>]+name=["']([^"']+)["'][^>]+content=["']([^"']+)["']/gi)
    for (const match of nameMatches) {
        if (match[1] && match[2]) {
            metaTags[match[1]] = match[2]
        }
    }

    // Match meta tags with content before name
    const nameMatches2 = html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']([^"']+)["']/gi)
    for (const match of nameMatches2) {
        if (match[2] && match[1]) {
            metaTags[match[2]] = match[1]
        }
    }

    // Match meta tags with property attribute (Open Graph)
    const propMatches = html.matchAll(/<meta[^>]+property=["']([^"']+)["'][^>]+content=["']([^"']+)["']/gi)
    for (const match of propMatches) {
        if (match[1] && match[2]) {
            metaTags[match[1]] = match[2]
        }
    }

    // Match meta tags with content before property
    const propMatches2 = html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']([^"']+)["']/gi)
    for (const match of propMatches2) {
        if (match[2] && match[1]) {
            metaTags[match[2]] = match[1]
        }
    }

    return metaTags
}

/**
 * Analyze SEO using Puppeteer for accurate detection of dynamically loaded content.
 * Falls back to simple fetch if Puppeteer fails.
 */
async function fetchSEOAnalysis(url: string): Promise<SEOAnalysis> {
    // Try Puppeteer first for accurate detection of dynamically-loaded content (e.g., JSON-LD)
    try {
        const { fetchPageWithPuppeteer } = await import('@/lib/puppeteer')
        const result = await fetchPageWithPuppeteer(url, { timeout: 30000 })
        return analyzeSEOFromHtml(url, result.html, true)
    } catch (puppeteerError) {
        console.warn('Puppeteer SEO analysis failed, falling back to fetch:', puppeteerError)
        return fetchSEOAnalysisFallback(url)
    }
}

/**
 * Fallback SEO analysis using simple fetch.
 * Used when Puppeteer is not available.
 */
async function fetchSEOAnalysisFallback(url: string): Promise<SEOAnalysis> {
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
        return analyzeSEOFromHtml(url, html, false)
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
            score: 0,
            usedPuppeteer: false
        }
    }
}

/**
 * Analyze SEO from HTML content.
 */
async function analyzeSEOFromHtml(url: string, html: string, usedPuppeteer: boolean): Promise<SEOAnalysis> {
    try {

        // Title check
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
        const title = titleMatch?.[1]?.trim() ?? ''
        const titleItem = createAnalysisItem(
            'Balise Title',
            title ? (title.length <= 60 ? title : `${title.substring(0, 57)}...`) : 'Absente',
            title ? (title.length >= 30 && title.length <= 60 ? 'success' : 'warning') : 'error',
            title ? `${title.length} caractères` : 'Aucune balise title trouvée',
            !title ? 'Sans titre, votre page n\'apparaîtra pas correctement dans les résultats de recherche Google.' : title.length < 30 || title.length > 60 ? 'Un titre mal optimisé réduit le taux de clic dans les résultats de recherche.' : undefined,
            !title ? 'Ajoutez dans le <head> : <title>Développeur Web à Albi | Création Sites WordPress & React</title>' : title.length < 30 ? `Votre titre "${title}" est trop court. Exemple : "Développeur Web Freelance | Création Sites sur Mesure à Albi"` : title.length > 60 ? `Votre titre "${title.substring(0, 60)}..." est trop long. Google le tronquera. Exemple court : "Agence Web Albi | Sites WordPress & E-commerce"` : undefined
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
            !description ? 'Ajoutez dans le <head> : <meta name="description" content="Développeur web freelance à Albi. Création de sites WordPress, e-commerce et applications React. Devis gratuit et accompagnement personnalisé." />' : description.length < 120 ? `Votre description "${description}" est trop courte (${description.length} car.). Exemple : "Expert en développement web sur Albi depuis 10 ans. Création de sites WordPress, e-commerce Shopify et applications React performantes. Devis gratuit sous 24h."` : description.length > 160 ? `Votre description est trop longue (${description.length} car.). Google affichera : "${description.substring(0, 157)}...". Raccourcissez à 160 caractères max.` : undefined
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
            h1Count === 0 ? 'Ajoutez UN SEUL H1 en début de page : <h1>Développeur Web Freelance à Albi</h1>, puis structurez avec H2 : <h2>Mes Services</h2>, <h2>Portfolio</h2>, etc.' : h1Count > 1 ? `${h1Count} H1 détectés ! Gardez UN SEUL H1 pour le titre principal. Exemple : <h1>Accueil</h1> puis <h2>Services</h2> <h2>Contact</h2> (pas de H1 pour ces sections)` : undefined
        )

        // Images alt check - empty alt="" is valid for decorative images
        const imgTags = html.match(/<img[^>]*>/gi) || []
        const imgsWithAlt = imgTags.filter(img => /alt=["'][^"']*["']/i.test(img)).length
        const altRatio = imgTags.length > 0 ? imgsWithAlt / imgTags.length : 1
        const missingAlt = imgTags.length - imgsWithAlt
        const imgItem = createAnalysisItem(
            'Images avec Alt',
            `${imgsWithAlt}/${imgTags.length}`,
            imgTags.length === 0 || imgsWithAlt === imgTags.length ? 'success' : altRatio >= 0.8 ? 'warning' : 'error',
            imgTags.length === 0 ? 'Aucune image trouvée' : `${Math.round(altRatio * 100)}% des images ont un attribut alt`,
            altRatio < 1 && imgTags.length > 0 ? 'Les images sans alt pénalisent l\'accessibilité et le référencement image.' : undefined,
            altRatio < 1 && imgTags.length > 0 ? `${missingAlt} image(s) sans alt détectée(s). Exemples : <img src="logo.png" alt="Logo Agence Web Albi" /> ou <img src="equipe.jpg" alt="Équipe de développeurs web en réunion" />. Pour images décoratives : alt=""` : undefined
        )

        // Links - count all links (internal and external)
        const allLinks = (html.match(/<a[^>]+href=["'][^"'#]+["']/gi) || []).length
        const linksItem = createAnalysisItem(
            'Liens',
            allLinks,
            allLinks > 5 ? 'success' : allLinks > 0 ? 'warning' : 'error',
            `${allLinks} liens trouvés sur la page`,
            allLinks <= 5 ? `Seulement ${allLinks} lien(s). Ajoutez des liens internes : <a href="/services">Nos Services</a>, <a href="/portfolio">Voir nos réalisations</a>, <a href="/contact">Nous contacter</a>. Minimum recommandé : 5-10 liens par page.` : undefined,
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
            !sitemapExists ? 'Créez un fichier sitemap.xml à la racine : https://votresite.com/sitemap.xml. Contenu XML listant toutes vos pages. Puis soumettez-le sur Google Search Console. Plugins WordPress : Yoast SEO, Rank Math.' : undefined
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
            !robotsExists ? 'Créez un fichier robots.txt à la racine avec : User-agent: * / Allow: / / Sitemap: https://votresite.com/sitemap.xml. Cela guide les moteurs de recherche.' : undefined
        )

        // Viewport
        const viewportMatch = html.match(/<meta[^>]+name=["']viewport["']/i)
        const viewportItem = createAnalysisItem(
            'Viewport',
            viewportMatch ? 'Configuré' : 'Absent',
            viewportMatch ? 'success' : 'error',
            viewportMatch ? 'Balise viewport détectée' : 'Balise viewport manquante',
            !viewportMatch ? 'Sans viewport, votre site ne s\'affichera pas correctement sur mobile.' : undefined,
            !viewportMatch ? 'CRITIQUE - Ajoutez dans le <head> : <meta name="viewport" content="width=device-width, initial-scale=1.0" />. Sans cela, le mobile affiche la version desktop réduite (illisible).' : undefined
        )

        // Structured Data
        const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["']/i.test(html)
        const structuredItem = createAnalysisItem(
            'Données structurées',
            hasJsonLd ? 'Présentes' : 'Absentes',
            hasJsonLd ? 'success' : 'warning',
            hasJsonLd ? 'JSON-LD détecté' : 'Aucune donnée structurée trouvée',
            !hasJsonLd ? 'Les données structurées permettent d\'obtenir des résultats enrichis (étoiles, prix...).' : undefined,
            !hasJsonLd ? 'Ajoutez du schema.org JSON-LD. Exemple LocalBusiness : <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Votre entreprise","address":{"@type":"PostalAddress","addressLocality":"Albi"}}</script>. Testez sur schema.org validator.' : undefined
        )

        // Open Graph
        const hasOg = /<meta[^>]+property=["']og:/i.test(html)
        const ogItem = createAnalysisItem(
            'Open Graph',
            hasOg ? 'Configuré' : 'Absent',
            hasOg ? 'success' : 'warning',
            hasOg ? 'Balises OG détectées' : 'Balises Open Graph manquantes',
            !hasOg ? 'Sans Open Graph, les partages sur les réseaux sociaux seront moins attractifs.' : undefined,
            !hasOg ? 'Ajoutez dans le <head> : <meta property="og:title" content="Titre pour Facebook/LinkedIn" />, <meta property="og:description" content="Description attractive" />, <meta property="og:image" content="https://votresite.com/image-partage.jpg" /> (1200x630px recommandé).' : undefined
        )

        // Extract detailed metadata
        const openGraph = extractOpenGraphData(html)
        const jsonLdData = extractJsonLdData(html)
        const metaTags = extractMetaTags(html)

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
            score: calculateScore(analysisItems),
            usedPuppeteer,
            // Detailed metadata
            openGraph,
            jsonLdData,
            metaTags
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
            score: 0,
            usedPuppeteer
        }
    }
}

export const analyzeSEO = unstable_cache(
    fetchSEOAnalysis,
    ['site-check-seo'],
    { revalidate: 3600 }
)
