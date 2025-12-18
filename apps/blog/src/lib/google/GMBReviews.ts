"use server"

import { GoogleAuth } from 'google-auth-library';

export default async function GMBReviews() {
    const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const GOOGLE_LOCATION_ID = process.env.GOOGLE_LOCATION_ID;

    if (!GOOGLE_SERVICE_ACCOUNT_KEY || !GOOGLE_LOCATION_ID) {
        console.error('Missing Google Service Account Key or Location ID in environment variables.');
        throw new Error("Variables d'environnements non défini !")
    }

    try {
        const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);

        // Initialiser l'authentification avec le compte de service
        const auth = new GoogleAuth({
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            },
            scopes: ['https://www.googleapis.com/auth/business.manage'], // Scope pour Google Business Profile
        });

        // Obtenir un jeton d'accès
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();

        // Utiliser le jeton d'accès dans l'en-tête Authorization
        const apiUrl = `https://mybusiness.googleapis.com/v4/${GOOGLE_LOCATION_ID}/reviews`;

        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Google API Error:', errorData);
            throw new Error('Failed to fetch reviews from Google API');
        }

        const data = await response.json();

        const reviews = data.reviews.map((review: any) => ({
            reviewerName: review.reviewer.displayName,
            profilePhotoUrl: review.reviewer.profilePhotoUrl,
            starRating: review.starRating,
            comment: review.comment,
            createTime: review.createTime,
        }));

        return ({ reviews });

    } catch (error) {
        console.error('Server error fetching Google reviews:', error);
        throw new Error("Server error fetching Google reviews")
    }
}