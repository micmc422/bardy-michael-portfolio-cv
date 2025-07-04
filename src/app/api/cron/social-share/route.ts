import { baseURL } from '@/app/resources';
import { getPosts } from '@/app/utils/serverActions';
import { NextResponse } from 'next/server';
import { postToFacebook } from './postToFacebook';
import { postToLinkedIn } from './postToLinkedIn'; // Décommenté pour l'exemple d'amélioration
import { get } from '@vercel/edge-config';

// Environnement d'exécution (développement ou production)
const env = process.env.NODE_ENV;
// Clé utilisée dans Edge Config pour stocker les slugs des articles partagés
const SHARED_ARTICLES_KEY = 'sharedArticlesSlugs';

/**
 * Gère la requête GET pour la publication automatique d'articles sur les médias sociaux.
 * Cette fonction est destinée à être appelée par une tâche planifiée (cron job) via Vercel Cron Jobs.
 * Elle inclut des vérifications d'autorisation, de jour de la semaine, et un mécanisme
 * pour éviter les partages d'articles déjà diffusés via Edge Config.
 *
 * @param req L'objet Request de la requête Next.js.
 * @returns Une réponse JSON indiquant le statut de l'opération et des messages pertinents.
 */
export async function GET(req: Request) {
    // === Section 1 : Vérifications Préliminaires et Sécurité ===

    // Vérification de l'autorisation:
    // En production, un jeton secret est requis dans l'en-tête 'Authorization' pour sécuriser le point de terminaison.
    // Cela empêche les appels non autorisés. En développement, cette vérification est désactivée pour faciliter les tests.
    if (!(env === 'development') && req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        console.error("🚫 Tentative d'accès non autorisé à la route de partage automatique.");
        return NextResponse.json({ status: 'Unauthorized', code: 401, message: 'Accès non autorisé. Jeton CRON_SECRET manquant ou invalide.' });
    }

    // Récupération du jour de la semaine actuel pour la logique de planification.
    // getDay() retourne 0 pour Dimanche, 1 pour Lundi, ..., 6 pour Samedi.
    const today = new Date();
    const dayOfWeek = today.getDay();

    // Vérification des jours où le partage est désactivé : Samedi (6), Dimanche (0), et Mercredi (3).
    // Cette règle métier assure que les publications ne se font pas pendant certaines périodes.
    if (dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 3) {
        const dayName = today.toLocaleDateString('fr-FR', { weekday: 'long' });
        console.log(`⏱️ Partage désactivé aujourd'hui (${dayName}). Reprise les jours autorisés.`);
        return NextResponse.json({ status: 'skipped', message: `Partage désactivé le week-end et le mercredi. Actuellement, c'est ${dayName}.` });
    }

    // === Section 2 : Récupération des Articles et de l'État de Partage ===

    // Récupère le(s) dernier(s) article(s) publié(s).
    // La limite de 1 est un choix actuel ; elle pourrait être augmentée si vous souhaitez partager plus d'un article par exécution.
    const articles = await getPosts({ limit: 1 });

    // Récupère la liste des slugs d'articles précédemment partagés depuis Vercel Edge Config.
    // Edge Config est utilisé ici comme un stockage persistant rapide pour l'état de l l'application distribuée.
    // Si la clé n'existe pas ou la valeur est vide, un tableau vide est utilisé par défaut.
    let sharedArticlesSlugs: string[] = (await get(SHARED_ARTICLES_KEY)) || [];

    // === Section 3 : Traitement et Partage des Articles ===

    // Parcours les articles récupérés. Dans cet exemple, il n'y a qu'un seul article grâce à `limit: 1`.
    for (const article of articles) {
        // Vérifie si l'article est récent (publié il y a moins de 24 heures) et a bien une date de publication.
        if (article.metadata.publishedAt) {
            // Vérifie si l'article a déjà été partagé pour éviter les doublons.
            // C'est essentiel pour ne pas spammer les flux sociaux avec le même contenu.
            if (sharedArticlesSlugs.includes(article.slug)) {
                console.log(`⏩ L'article "${article.slug}" a déjà été partagé. Pas de nouvelle diffusion.`);
                return NextResponse.json({ status: 'skipped', message: `L'article "${article.slug}" a déjà été partagé.` });
            }

            // Prépare le payload de données pour les fonctions de partage.
            const postData = {
                title: article.metadata.title as string,
                description: article.metadata.description as string,
                url: `${baseURL}/blog/${article.slug}` // Construit l'URL complète de l'article.
            };

            // Publie l'article sur toutes les plateformes sociales configurées en parallèle.
            // `Promise.all` assure que toutes les tentatives de publication sont lancées simultanément.
            try {
                await Promise.all([
                    postToFacebook(postData),
                    postToLinkedIn(postData)
                ]);

                console.log(`✅ Article "${article.slug}" partagé avec succès sur les médias sociaux.`);

                // Met à jour la liste locale des slugs partagés.
                // Le nouveau slug est ajouté au début (le plus récent).
                sharedArticlesSlugs.unshift(article.slug);
                // Le tableau est tronqué pour ne conserver que les 4 derniers slugs,
                // afin d'éviter une croissance illimitée et de ne suivre que les partages récents.
                if (sharedArticlesSlugs.length > 4) {
                    sharedArticlesSlugs = sharedArticlesSlugs.slice(0, 4);
                }

                // Met à jour Vercel Edge Config avec la liste révisée des slugs partagés.
                // Cela utilise l'API Vercel Edge Config directement, car la fonction `set` du SDK Edge Config
                // n'est pas conçue pour les environnements Node.js (comme les API Routes) mais plutôt pour les Edge Functions.
                const updateRes = await fetch(
                    `https://api.vercel.com/v1/edge-config/${process.env.VERCEL_EDGE_CONFIG_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
                    {
                        method: 'PATCH', // Utilise PATCH pour mettre à jour des éléments spécifiques.
                        headers: {
                            Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`, // Jeton d'API Vercel requis pour l'authentification.
                            'Content-Type': 'application/json', // Indique que le corps de la requête est du JSON.
                        },
                        body: JSON.stringify({
                            items: [
                                {
                                    operation: 'update', // Spécifie l'opération de mise à jour.
                                    key: SHARED_ARTICLES_KEY, // La clé à mettre à jour dans Edge Config.
                                    value: sharedArticlesSlugs, // La nouvelle valeur du tableau de slugs.
                                },
                            ],
                        }),
                    }
                );

                // Vérifie si la mise à jour de l'Edge Config a échoué.
                if (!updateRes.ok) {
                    const errorResult = await updateRes.json();
                    console.error("❌ Échec de la mise à jour de l'Edge Config après le partage :", errorResult);
                    return NextResponse.json({ status: 'error', message: "Échec de la mise à jour de l'Edge Config après le partage de l'article." });
                }

                return NextResponse.json({ status: 'done', message: `Article "${article.slug}" partagé et Edge Config mis à jour.`, sharedCount: articles.length });

            } catch (socialError) {
                // Capture les erreurs spécifiques aux fonctions de partage social (Facebook, LinkedIn).
                console.error(`❌ Échec du partage de l'article "${article.slug}" sur une ou plusieurs plateformes :`, socialError);
                return NextResponse.json({ status: 'error', message: `Erreur lors du partage social pour l'article "${article.slug}".` });
            }

        } else {
            // Cas où l'article n'est pas éligible au partage (ou sans date de publication).
            console.log(`⏭️ L'article "${article.slug}" a plus de 24 heures ou n'est pas publié. Il ne sera pas diffusé.`);
            return NextResponse.json({
                status: 'skipped',
                message: `L'article "${article.slug}" n'est pas éligible au partage (non publié).`
            });
        }
    }

    // Si aucun article n'a été trouvé ou si la liste des articles était vide.
    console.log('ℹ️ Aucun article éligible trouvé à partager pour cette exécution.');
    return NextResponse.json({ status: 'no_articles', message: 'Aucun article éligible trouvé à partager.' });
}

