// /app/api/social-share/route.ts (ou /pages/api/social-share.ts si tu es en pages router)

import { baseURL } from '@/app/resources';
import { getPosts } from '@/app/utils/serverActions';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ status: 'Unauthorized', code: 401 });
    }
    // 1. Récupère les articles publiés dans les dernières 24h
    const articles = await getPosts({ limit: 1 });

    // 2. Pour chaque article, publier sur les médias sociaux
    for (const article of articles) {
        if (article.metadata.publishedAt && isLessThan24HoursOld(article.metadata.publishedAt)) {
            await Promise.all([
                //   postToLinkedIn({ title: article.metadata.title, url: `${baseURL}/${article.slug}` }),
                postToFacebook({
                    title: article.metadata.title as string,
                    description: article.metadata.description as string,
                    url: `${baseURL}/blog/${article.slug}`
                })
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


//TODO: LinkedIn API requires a valid access token and author URN
// to post. Ensure you have these set in your environment variables.
// If you don't have access to LinkedIn API, you can comment out the LinkedIn post function.
async function postToLinkedIn(article: any) {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN!;
    const authorUrn = process.env.LINKEDIN_AUTHOR_URN!; // ex: urn:li:person:abc123
    // return null
    const postBody = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
            'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                    text: `${article.title} — ${article.url}`
                },
                shareMediaCategory: 'NONE'
            }
        },
        visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
    };

    const res = await fetch('https://api.linkedin.com/v2/posts', {
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
    }
}

async function postToFacebook(article: any) {
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

    // const url = `https://graph.facebook.com/${pageId}/feed`;
    const url = `https://graph.facebook.com/occitaweb/feed`;

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
    }
}
