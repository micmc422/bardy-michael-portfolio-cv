import { baseURL } from '@/app/resources';
import { getPosts } from '@/app/utils/serverActions';
import { NextResponse } from 'next/server';
import { postToFacebook } from './postToFacebook';
import { postToLinkedIn } from './postToLinkedIn';

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
                postToLinkedIn(postData),
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



