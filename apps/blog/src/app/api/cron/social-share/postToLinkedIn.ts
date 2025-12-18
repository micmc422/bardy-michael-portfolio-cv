import { get } from '@vercel/edge-config';
import ogs from 'open-graph-scraper'; // Importation pour scraper les métadonnées Open Graph

/**
 * Publie un article sur LinkedIn en tant que post UGC.
 * Utilise les métadonnées Open Graph de l'URL de l'article pour un aperçu riche.
 *
 * @param article Un objet contenant les détails de l'article (titre, description, URL).
 * @returns {Promise<void>} Une promesse qui se résout en cas de succès, ou rejette une erreur détaillée.
 */
export async function postToLinkedIn(article: { title: string; description: string; url: string }): Promise<void> {
    // Récupération du token d'accès LinkedIn.
    const accessToken = (await get('linkedin_token')) as string;
    if (!accessToken) {
        throw new Error('Erreur critique: Le token d\'accès LinkedIn est manquant.');
    }

    // Récupération de l'URN de l'auteur.
    const personURN = process.env.LINKEDIN_AUTHOR_URN;
    if (!personURN) {
        throw new Error('Erreur critique: L\'URN de l\'auteur LinkedIn est manquant.');
    }

    try {
        // Extraction des métadonnées Open Graph.
        const ogResult = await ogs({ url: article.url });
        const ogData = ogResult.result;

        console.log('Données OpenGraph brutes récupérées :', ogData); // Pour débogage

        const ogTitle = ogData.ogTitle || article.title;
        const ogDescription = ogData.ogDescription || article.description;
        let ogImage: string | undefined;

        // Logique d'extraction de l'URL de l'image Open Graph plus robuste
        if (ogData.ogImage) {
            if (Array.isArray(ogData.ogImage)) {
                // Cherche la première image valide dans le tableau
                const firstImage = ogData.ogImage.find(img => typeof img === 'object' && img !== null && 'url' in img);
                if (firstImage) {
                    ogImage = (firstImage as { url: string }).url;
                }
            } else if (typeof ogData.ogImage === 'object' && ogData.ogImage !== null && 'url' in ogData.ogImage) {
                // Gère un objet image unique
                ogImage = (ogData.ogImage as { url: string }).url;
            } else if (typeof ogData.ogImage === 'string') {
                // Gère une URL d'image directe
                ogImage = ogData.ogImage;
            }
        }

        console.log('URL de l\'image OpenGraph extraite :', ogImage); // Pour débogage

        // Construction du payload JSON pour le post LinkedIn.
        const postBody: any = {
            author: personURN,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: ogTitle
                    },
                    shareMediaCategory: 'ARTICLE',
                    media: [
                        {
                            status: 'READY',
                            description: {
                                text: ogDescription
                            },
                            originalUrl: article.url,
                            title: {
                                text: ogTitle
                            },
                        }
                    ]
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        // Ajoute la miniature si une URL d'image valide a été trouvée
        if (ogImage && ogImage.startsWith('http')) { // Simple validation pour s'assurer que c'est une URL HTTP(S)
            (postBody.specificContent['com.linkedin.ugc.ShareContent'].media[0] as any).thumbnails = [
                { resolvedUrl: ogImage }
            ];
        } else {
            console.warn('⚠️ Aucune URL d\'image OpenGraph valide trouvée ou extraite. Le post LinkedIn n\'aura pas de miniature.');
        }

        // Envoi de la requête HTTP POST à l'API LinkedIn.
        const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        });

        // Gestion de la réponse de l'API.
        if (!res.ok) {
            const errorText = await res.text();
            const errorMessage = `❌ Échec publication LinkedIn: Statut ${res.status} - ${res.statusText}. Détails: ${errorText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        console.log('🎉 Article posté sur LinkedIn avec succès !');
    } catch (error) {
        console.error('⚠️ Erreur lors de la publication sur LinkedIn:', error);
        throw error;
    }
}
