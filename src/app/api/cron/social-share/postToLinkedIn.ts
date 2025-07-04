import { get } from '@vercel/edge-config';
import ogs from 'open-graph-scraper'; // Importation de la bibliothèque pour scraper les métadonnées Open Graph

/**
 * Publie un article donné sur LinkedIn en tant que post UGC (User Generated Content).
 * Utilise les métadonnées Open Graph de l'URL de l'article pour un aperçu riche.
 *
 * @param article Un objet contenant les détails de l'article (titre, description, URL).
 * Le champ `url` est crucial pour l'extraction Open Graph.
 * Ex: { title: "Mon Titre", description: "Ma Description", url: "https://example.com/article" }
 * @returns {Promise<void>} Une promesse qui se résout en cas de succès, ou rejette une erreur détaillée en cas d'échec.
 */
export async function postToLinkedIn(article: { title: string; description: string; url: string }): Promise<void> {
    // === Section 1 : Récupération des Tokens et Scrapping Open Graph ===

    // 1. Récupération du token d'accès LinkedIn depuis Vercel Edge Config.
    const accessToken = (await get('linkedin_token')) as string;

    // Vérification du token d'accès. Essentiel pour l'authentification.
    if (!accessToken) {
        const errorMessage = 'Erreur critique: Le token d\'accès LinkedIn est manquant dans Edge Config. Impossible de publier.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    // Récupération de l'URN (Uniform Resource Name) de l'auteur (personne ou organisation) depuis les variables d'environnement.
    // Cet URN identifie l'entité qui publie le contenu sur LinkedIn (ex: urn:li:person:12345, urn:li:organization:67890).
    const personURN = process.env.LINKEDIN_AUTHOR_URN;

    // Vérification de l'URN de l'auteur. Obligatoire pour savoir qui publie.
    if (!personURN) {
        const errorMessage = 'Erreur critique: L\'URN de l\'auteur LinkedIn (LINKEDIN_AUTHOR_URN) est manquant dans les variables d\'environnement. Impossible de publier.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    // Utilisation de `open-graph-scraper` pour extraire les métadonnées Open Graph de l'URL de l'article.
    // Cela permet à LinkedIn de créer un aperçu riche et attrayant du lien.
    try {
        const ogResult = await ogs({ url: article.url });
        const ogData = ogResult.result;

        // console.log('Données OpenGraph récupérées :', ogData); // Utile pour le débogage

        // Fallback si les champs Open Graph sont manquants.
        // On utilise les données de l'article si les métadonnées OG ne sont pas trouvées.
        const ogTitle = ogData.ogTitle || article.title;
        const ogDescription = ogData.ogDescription || article.description;
        let ogImage: string | undefined;

        // Extraction sécurisée de l'URL de l'image Open Graph.
        // ogImage peut être un tableau, un objet ou undefined.
        if (ogData.ogImage && Array.isArray(ogData.ogImage) && ogData.ogImage.length > 0) {
            // Assure que le premier élément est un objet et contient une propriété 'url'.
            if (typeof ogData.ogImage[0] === 'object' && ogData.ogImage[0] !== null && 'url' in ogData.ogImage[0]) {
                ogImage = (ogData.ogImage[0] as { url: string }).url;
            }
        } else if (typeof ogData.ogImage === 'object' && ogData.ogImage !== null && 'url' in ogData.ogImage) {
            // Si ogImage est un objet simple avec une url.
            ogImage = (ogData.ogImage as { url: string }).url;
        }


        // === Section 2 : Construction du Corps de la Requête de Publication (UGC Post) ===

        // Construction du payload JSON conforme à l'API UGC Posts de LinkedIn.
        const postBody = {
            author: personURN, // L'URN de l'auteur du post.
            lifecycleState: 'PUBLISHED', // Définit le post comme "PUBLISHED" directement (au lieu de 'DRAFT').
            specificContent: {
                // Type de contenu spécifique pour un partage d'article.
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: ogTitle // Le commentaire qui accompagne le partage (souvent le titre de l'article).
                    },
                    shareMediaCategory: 'ARTICLE', // Indique que le média partagé est un article.
                    media: [
                        {
                            status: 'READY', // Statut du média lié.
                            description: {
                                text: ogDescription // Description de l'aperçu de l'article.
                            },
                            originalUrl: article.url, // L'URL originale de l'article.
                            title: {
                                text: ogTitle // Titre de l'aperçu de l'article.
                            },
                            // Conditionnellement ajoute l'image si elle a été trouvée.
                            ...(ogImage && {
                                thumbnails: [
                                    { resolvedUrl: ogImage } // URL de l'image de l'aperçu.
                                ]
                            })
                        }
                    ]
                }
            },
            // Visibilité du post : 'PUBLIC' signifie visible par tout le réseau LinkedIn.
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        // === Section 3 : Envoi de la Requête API et Gestion des Erreurs ===

        // Envoi de la requête HTTP POST à l'API LinkedIn pour créer le post UGC.
        const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`, // Jeton d'accès pour l'authentification.
                'X-Restli-Protocol-Version': '2.0.0', // En-tête requis par l'API LinkedIn.
                'Content-Type': 'application/json' // Indique que le corps de la requête est du JSON.
            },
            body: JSON.stringify(postBody) // Convertit l'objet JavaScript en chaîne JSON.
        });

        // 4. Gestion de la réponse de l'API.
        if (!res.ok) {
            const errorText = await res.text(); // Tente de lire le corps de la réponse d'erreur.
            const errorMessage = `❌ Échec de la publication LinkedIn: Statut ${res.status} - ${res.statusText}. Détails: ${errorText}`;
            console.error(errorMessage);
            throw new Error(errorMessage); // Relance une erreur détaillée.
        }

        console.log('🎉 Article posté sur LinkedIn avec succès !');
        // LinkedIn ne retourne pas un ID de post direct pour les UGC posts de la même manière que Facebook.
        // La réussite est indiquée par un statut 201 Created.
    } catch (error) {
        // Capture les erreurs lors du scrapping Open Graph ou de l'appel `fetch`.
        console.error('⚠️ Erreur lors de la publication sur LinkedIn:', error);
        throw error; // Relance l'erreur pour gestion par la fonction appelante.
    }
}