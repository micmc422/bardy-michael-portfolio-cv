// app/api/indexnow/route.ts
import { getPosts } from '@/app/utils/serverActions';
import { NextResponse } from 'next/server';

// Remplacez par votre clé IndexNow et le domaine de votre site
const INDEXNOW_API_KEY = "ad42fq4aefywxx8c5f742688azqtx4jp"; // Stockez ceci dans vos variables d'environnement Vercel
const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'https://occitaweb.fr'; // Ou votre domaine réel

export async function GET(request: Request) {
    // Optionnel: Sécuriser la route API avec une clé secrète Vercel Cron Job
    // Vercel envoie un en-tête `authorization` avec la clé secrète configurée dans vercel.json
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    let urlsToSubmit: string[] = []
    const lastestPost = await getPosts({})
    try {
        urlsToSubmit = lastestPost.map(post => (`${SITE_DOMAIN}/blog/${post.slug}`));
    } catch (error) {
        console.error('Erreur lors de la récupération des URLs:', error);
        return NextResponse.json({ message: 'Erreur lors de la récupération des URLs', error }, { status: 500 });
    }

    if (urlsToSubmit.length === 0) {
        return NextResponse.json({ message: 'Aucune URL à soumettre.' });
    }

    // 2. Préparer les données pour l'API IndexNow
    const indexNowEndpoint = `https://api.indexnow.org/indexnow?key=${INDEXNOW_API_KEY}&host=${new URL(SITE_DOMAIN).host}`;

    const requestBody = {
        host: new URL(SITE_DOMAIN).host,
        key: INDEXNOW_API_KEY,
        urlList: urlsToSubmit,
    };

    try {
        // 3. Envoyer la requête POST à l'API IndexNow
        const response = await fetch(indexNowEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log('URLs soumises à IndexNow avec succès!');
            return NextResponse.json({ message: 'URLs soumises à IndexNow avec succès.', submittedUrls: urlsToSubmit });
        } else {
            const errorData = await response.text();
            console.error('Erreur lors de la soumission à IndexNow:', response.status, errorData);
            return NextResponse.json(
                {
                    message: 'Erreur lors de la soumission à IndexNow',
                    status: response.status,
                    error: errorData,
                },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('Erreur réseau lors de la soumission à IndexNow:', error);
        return NextResponse.json({ message: 'Erreur réseau lors de la soumission à IndexNow', error }, { status: 500 });
    }
}