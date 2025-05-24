import { getPosts } from "@/app/utils/serverActions"

export const dynamic = 'force-static'

export async function GET() {
    const data = await getPosts(["src", "app", "work", "projects"])

    return Response.json(data)
}