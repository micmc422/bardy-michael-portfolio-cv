import { get } from '@vercel/edge-config';

export async function postToFacebook(article: any) {
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
