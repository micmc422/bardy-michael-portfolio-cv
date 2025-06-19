// /app/api/github/[owner]/[repo]/route.ts
import { NextRequest } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ owner: string; repo: string }> }
) {
    const { owner, repo } = await params;

    const url = `https://api.github.com/repos/${owner}/${repo}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                // Optionnel : token GitHub si besoin d'une auth pour éviter le rate limit
                // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
            },
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: `GitHub API error: ${response.status}` }),
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('GitHub API response:', data);
        if (!data || !data.full_name) {
            return new Response(
                JSON.stringify({ error: 'Repository not found or invalid response' }),
                { status: 404 }
            );
        }
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Server error', details: (error as Error).message }),
            { status: 500 }
        );
    }
}
