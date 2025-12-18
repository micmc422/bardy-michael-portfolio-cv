import { get } from '@vercel/edge-config';

/**
 * Publie un article donné sur une page Facebook configurée.
 * Récupère le token d'accès de la page et l'ID de la page depuis les sources sécurisées (Edge Config et variables d'environnement).
 * Interagit avec l'API Graph de Facebook pour créer un nouveau post.
 *
 * @param article Un objet contenant les informations essentielles de l'article à partager.
 * Ex: { title: "Mon Super Article", description: "Une description captivante", url: "https://monblog.com/article-slug" }
 * @returns {Promise<void>} Une promesse qui se résout sans valeur en cas de succès, ou rejette une erreur détaillée en cas d'échec.
 */
export async function postToFacebook(article: { title: string; description: string; url: string }): Promise<void> {
    // === Section 1 : Récupération des Informations d'Authentification et de Configuration ===

    // 1. Récupération du token d'accès Facebook depuis Vercel Edge Config.
    // C'est la méthode recommandée pour les secrets qui peuvent changer ou être gérés dynamiquement.
    const accessToken = await get('facebook_token') as string;

    // Vérification critique : S'assurer que le token d'accès est disponible.
    // Sans ce token, aucune requête API ne peut être authentifiée.
    if (!accessToken) {
        const errorMessage = 'Erreur critique: Le token d\'accès Facebook est manquant dans Edge Config. Impossible de publier.';
        console.error(errorMessage);
        throw new Error(errorMessage); // Lance une erreur pour stopper l'exécution et signaler le problème.
    }

    // 2. Récupération de l'ID de la page Facebook depuis les variables d'environnement.
    // Cet ID est spécifique à la page où le post doit être publié.
    const pageId = process.env.FACEBOOK_PAGE_ID;

    // Vérification critique : S'assurer que l'ID de la page est défini.
    if (!pageId) {
        const errorMessage = 'Erreur critique: L\'ID de la page Facebook (FACEBOOK_PAGE_ID) est manquant dans les variables d\'environnement. Impossible de publier.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    // URL de base pour l'API Graph de Facebook pour la publication sur le fil d'actualité d'une page.
    const apiUrl = `https://graph.facebook.com/${pageId}/feed`;

    // === Section 2 : Préparation des Données du Post ===

    // Préparation des paramètres de la requête.
    // URLSearchParams est utilisé pour construire une chaîne de requête URL sécurisée et correctement encodée.
    const params = new URLSearchParams({
        // Le message principal du post, combinant le titre et la description de l'article avec un double saut de ligne pour la lisibilité.
        message: `${article.title}\n\n${article.description}`,
        // L'URL de l'article qui sera partagée. Facebook va souvent extraire les métadonnées Open Graph de cette URL
        // pour générer un aperçu riche (titre, image, description) directement dans le post.
        link: article.url,
        // Le token d'accès est inclus en tant que paramètre de requête pour l'authentification.
        access_token: accessToken
    });

    // === Section 3 : Exécution de la Requête API et Gestion des Erreurs ===

    try {
        // Envoi de la requête HTTP POST à l'API Graph de Facebook.
        // Les paramètres sont ajoutés directement à l'URL.
        const res = await fetch(`${apiUrl}?${params.toString()}`, {
            method: 'POST',
            // Spécifie le type de contenu de la requête. Important pour que l'API interprète correctement les données.
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // 5. Gestion de la réponse de l'API.
        // Si la réponse HTTP n'est pas dans la plage 2xx (e.g., 400 Bad Request, 500 Internal Server Error),
        // cela indique une erreur de l'API Facebook.
        if (!res.ok) {
            const errorText = await res.text(); // Tente de récupérer le corps de la réponse d'erreur pour des détails.
            const errorMessage = `❌ Échec de la publication Facebook: Statut ${res.status} - ${res.statusText}. Détails: ${errorText}`;
            console.error(errorMessage);
            throw new Error(errorMessage); // Relance une erreur avec des informations complètes.
        }

        // Si la publication est réussie, l'API retourne un objet JSON contenant souvent l'ID du post.
        const result = await res.json();
        console.log(`🎉 Article posté sur Facebook avec succès. ID du post: ${result.id}`);
        // `void` signifie que la fonction n'a pas besoin de retourner une valeur en cas de succès.
    } catch (error) {
        // Capture les erreurs qui peuvent survenir pendant l'appel `fetch` (ex: problèmes réseau, CORS).
        console.error('⚠️ Erreur inattendue lors de l\'envoi de la requête à Facebook:', error);
        throw error; // Relance l'erreur pour qu'elle puisse être gérée par la fonction appelante (dans `route.ts`).
    }
}