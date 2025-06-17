import { baseURL } from '@/app/resources';
import { getPosts } from '@/app/utils/serverActions';
import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';
import ogs from 'open-graph-scraper';

const env = process.env.NODE_ENV

export async function GET(req: Request) {
    if (!(env === 'development') && req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ status: 'Unauthorized', code: 401 });
    }
    // 1. Récupère les articles publiés dans les dernières 24h
    const articles = await getPosts({ limit: 1 });

    // 2. Pour chaque article, publier sur les médias sociaux
    for (const article of articles) {
        if (article.metadata.publishedAt && isLessThan24HoursOld(article.metadata.publishedAt)) {
            const postData = {
                title: article.metadata.title as string,
                description: article.metadata.description as string,
                url: `${baseURL}/blog/${article.slug}`
            };
            await Promise.all([
                // postToLinkedIn(postData),
                postToFacebook(postData)
            ]);
            return NextResponse.json({ status: 'done', count: articles.length });
        } else {
            console.log(`Article ${article.slug} is older than 24 hours, skipping social share.`);
            return NextResponse.json({ status: 'skipped', mrssage: articles.length + ' articles found, but none were less than 24 hours old.' });
        }
    }

}

function isLessThan24HoursOld(dateString: string): boolean {
    const publishedDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - publishedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 24;
}



async function postToLinkedIn(article: any) {
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
        lifecycleState: 'DRAFT',
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

async function postToFacebook(article: any) {
    const accessToken = await get('facebook_token') as string;
    const pageId = process.env.FACEBOOK_PAGE_ID!;

    const url = `https://graph.facebook.com/${pageId}/feed`;

    const params = new URLSearchParams({
        message:
            `${article.title}

${article.description}`,
        link: article.url,
        access_token: accessToken
    });
    const res = await fetch(`${url}?${params.toString()}`, {
        method: 'POST'
    });

    if (!res.ok) {
        const error = await res.text();
        console.error(`Facebook post failed: ${res.status}`, error);
        throw new Error(`Facebook post failed: ${res.status} - ${error}`);
    }
}
