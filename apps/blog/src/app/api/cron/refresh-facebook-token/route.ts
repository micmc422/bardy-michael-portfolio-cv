// /app/api/refresh-facebook-token/route.ts
import { NextResponse } from "next/server";
import { getAll, has, get } from '@vercel/edge-config';

// On récupère les identifiants de l'app Facebook
const facebook_app_id = process.env.FACEBOOK_APP_ID!;
const facebook_app_secret = process.env.FACEBOOK_APP_SECRET!;

// Route GET appelée par une tâche cron Vercel
export async function GET() {
    try {
        // Vérifie si un token existe déjà dans l'Edge Config
        const hasFacebookToken = await has('facebook_token');

        if (hasFacebookToken) {
            const oldToken = await get('facebook_token') as string;

            // On tente de renouveler le token
            const result = await updateFacebookToken(oldToken);

            if (result?.success) {
                return NextResponse.json({
                    facebookToken: result.newToken,
                    status: 'success',
                    message: 'Token Facebook renouvelé.'
                });
            } else {
                return NextResponse.json({
                    status: 'error',
                    message: 'Échec du renouvellement du token Facebook.'
                }, { status: 500 });
            }
        }

        // Aucun token Facebook trouvé → retour d'état
        const configItems = await getAll();
        return NextResponse.json({
            configItems,
            status: 'ok',
            message: 'Aucun token Facebook à rafraîchir.'
        });
    } catch (err: any) {
        console.error('Erreur lors du rafraîchissement du token :', err);
        return NextResponse.json({
            status: 'error',
            message: 'Erreur serveur lors de la tentative de rafraîchissement.'
        }, { status: 500 });
    }
}

// Fonction qui appelle l'API Facebook pour renouveler le token
async function updateFacebookToken(oldToken: string): Promise<{ success: boolean, newToken?: string }> {
    try {
        // Appel à Facebook pour échanger le token
        const res = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${facebook_app_id}&client_secret=${facebook_app_secret}&fb_exchange_token=${oldToken}`);
        const data = await res.json();

        if (!data.access_token) {
            console.error('Réponse invalide de Facebook :', data);
            return { success: false };
        }

        // Mise à jour dans l’Edge Config
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
                            key: 'facebook_token',
                            value: data.access_token,
                        },
                    ],
                }),
            }
        );

        const result = await updateRes.json();

        if (updateRes.ok) {
            return { success: true, newToken: data.access_token };
        } else {
            console.error('Échec de la mise à jour Vercel Edge:', result);
            return { success: false };
        }
    } catch (error) {
        console.error('Erreur dans updateFacebookToken:', error);
        return { success: false };
    }
}
