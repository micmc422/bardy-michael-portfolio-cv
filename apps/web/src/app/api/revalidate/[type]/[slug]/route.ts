import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ type: string, slug: string }> }
) {
    const { type, slug } = await params
    const path = `/${type}/${slug}`;
    if (path) {
        revalidatePath(path)
        return Response.json({ revalidated: true, now: Date.now(), path })
    }

    return Response.json({
        revalidated: false,
        now: Date.now(),
        message: 'Missing path to revalidate',
    })
}