import { baseURL } from '@/app/resources';
import { getPosts } from '@/app/utils/serverActions';
import { NextResponse } from 'next/server';
import { postToFacebook } from './postToFacebook';
import { postToLinkedIn } from './postToLinkedIn';
import { get } from '@vercel/edge-config';
export const revalidate = 0;
// Environnement d'exécution
const env = process.env.NODE_ENV;
// Clé Edge Config pour les slugs partagés
const SHARED_ARTICLES_KEY = 'sharedArticlesSlugs';
const STORED_SLUG_LENGTH = 40
/**
 * Gère la requête GET pour la publication automatique d'articles.
 * Appelé par une tâche planifiée (cron job) via Vercel Cron Jobs.
 */
export async function GET(req: Request) {
    // Vérification de sécurité (jeton secret requis en production)
    if (!(env === 'development') && req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error("🚫 Accès non autorisé.");
        return NextResponse.json({ status: 'Unauthorized', code: 401, message: 'Accès non autorisé.' });
    }

    // Vérification du jour de la semaine (désactivé le week-end et mercredi)
    const today = new Date();
    const dayOfWeek = today.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 3) {
        const dayName = today.toLocaleDateString('fr-FR', { weekday: 'long' });
        console.log(`⏱️ Partage désactivé aujourd'hui (${dayName}).`);
        return NextResponse.json({ status: 'skipped', message: `Partage désactivé le week-end et le mercredi. Actuellement, c'est ${dayName}.` });
    }

    // Récupère les 10 derniers articles publiés
    const articles = await getPosts({ limit: 10 });
    // Récupère les slugs des articles déjà partagés depuis Edge Config
    let sharedArticlesSlugs: string[] = (await get(SHARED_ARTICLES_KEY)) || [];

    // Filtre les articles déjà partagés
    const unsharedArticles = articles.filter(post => !sharedArticlesSlugs.includes(post.slug));

    // Trie les articles non partagés par date de publication (du plus ancien au plus récent)
    unsharedArticles.sort((a, b) => {
        const dateA = a.metadata.publishedAt ? new Date(a.metadata.publishedAt).getTime() : 0;
        const dateB = b.metadata.publishedAt ? new Date(b.metadata.publishedAt).getTime() : 0;
        return dateA - dateB;
    });

    // Traite et partage le premier article éligible (le plus ancien non partagé)
    if (unsharedArticles.length > 0) {
        const articleToShare = unsharedArticles[0]!; // Prend le plus ancien article non partagé

        if (articleToShare.metadata.publishedAt) {
            // Prépare les données pour le partage
            const postData = {
                title: articleToShare.metadata.title as string,
                description: articleToShare.metadata.description as string,
                url: `${baseURL}/blog/${articleToShare.slug}`
            };

            try {
                // Publie l'article sur les plateformes sociales en parallèle
                console.log("publie ! ", articleToShare.slug)
                await Promise.all([
                    postToFacebook(postData),
                    postToLinkedIn(postData)
                ]);
                console.log(`✅ Article "${articleToShare.slug}" partagé.`);

                // Met à jour la liste locale des slugs partagés
                const arrayLength = sharedArticlesSlugs.unshift(articleToShare.slug);
                // Garde les 10 derniers slugs partagés
                if (arrayLength > STORED_SLUG_LENGTH) {
                    sharedArticlesSlugs = sharedArticlesSlugs.slice(0, STORED_SLUG_LENGTH);
                }

                // Met à jour Edge Config avec la nouvelle liste
                const updateRes = await fetch(
                    `https://api.vercel.com/v1/edge-config/${process.env.VERCEL_EDGE_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
                    {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            items: [
                                {
                                    operation: 'update',
                                    key: SHARED_ARTICLES_KEY,
                                    value: sharedArticlesSlugs,
                                },
                            ],
                        }),
                    }
                );

                // Gère l'échec de la mise à jour Edge Config
                if (!updateRes.ok) {
                    const errorResult = await updateRes.json();
                    console.error("❌ Échec mise à jour Edge Config:", errorResult);
                    return NextResponse.json({ status: 'error', message: "Échec mise à jour Edge Config après partage." });
                }
                console.log(updateRes)
                return NextResponse.json({ status: 'done', message: `Article "${articleToShare.slug}" partagé et Edge Config mis à jour.`, sharedCount: 1, unsharedArticles });

            } catch (socialError) {
                // Gère les erreurs de partage social
                console.error(`❌ Échec partage article "${articleToShare.slug}":`, socialError);
                return NextResponse.json({ status: 'error', message: `Erreur lors du partage social pour l'article "${articleToShare.slug}".` });
            }
        } else {
            console.log(`⏭️ L'article "${articleToShare.slug}" n'est pas publié.`);
            return NextResponse.json({
                status: 'skipped',
                message: `L'article "${articleToShare.slug}" n'est pas éligible au partage (non publié).`
            });
        }
    }

    // Aucun article éligible trouvé
    console.log('ℹ️ Aucun article éligible trouvé à partager.');
    return NextResponse.json({ status: 'no_articles', message: 'Aucun article éligible trouvé à partager.' });
}
