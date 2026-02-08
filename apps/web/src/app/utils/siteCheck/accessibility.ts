'use server'

import { unstable_cache } from 'next/cache'
import type { AccessibilityAnalysis } from '../types'
import { createAnalysisItem, calculateScore } from './helpers'

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
