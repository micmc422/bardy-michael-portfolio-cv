import { get } from '@vercel/edge-config';
import ogs from 'open-graph-scraper';

export async function postToLinkedIn(article: any) {
    const accessToken = (await get('linkedin_token')) as string;
    const personURN = process.env.LINKEDIN_AUTHOR_URN!; // ex: urn:li:person:abc123

    // 1️⃣ Récupérer les données OpenGraph
    const ogResult = await ogs({ url: article.url });
    const ogData = ogResult.result;

    // console.log('OpenGraph Data:', ogData);

    // fallback en cas de champs manquants
    const ogTitle = ogData.ogTitle || article.title;
    const ogDescription = ogData.ogDescription || article.description;
    let ogImage: string | undefined;
    if (ogData.ogImage && Array.isArray(ogData.ogImage) && typeof ogData.ogImage[0] === 'object' && ogData.ogImage[0] !== null && 'url' in ogData.ogImage[0]) {
        ogImage = ogData.ogImage[0].url;
    }

    // 2️⃣ Construire le post UGC avec OG
    const postBody = {
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
                        ...(ogImage && {
                            thumbnails: [
                                { resolvedUrl: ogImage }
                            ]
                        })
                    }
                ]
            }
        },
        visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
    };

    // 3️⃣ Envoi vers LinkedIn
    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
    });

    if (!res.ok) {
        const error = await res.text();
        console.error(`LinkedIn post failed: ${res.status}`, error);
        throw new Error(`LinkedIn post failed: ${res.status} - ${error}`);
    }

    console.log('LinkedIn post succeeded!');
}

