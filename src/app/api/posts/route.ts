import { getPosts } from "@/app/utils/serverActions"

export const dynamic = 'force-static'

export async function GET() {
    const data = await getPosts(["src", "app", "blog", "posts"])

    return Response.json(data)
}