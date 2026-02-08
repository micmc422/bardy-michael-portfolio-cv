import { NextResponse } from 'next/server';

const CALCOM_API_URL = 'https://api.cal.com/v1/availability';
const CALCOM_API_KEY = process.env.CALCOM_API_KEY; // à mettre dans .env

export async function GET(req: Request) {
    const url = new URL(req.url);
    const username = url.searchParams.get('username') || 'demo'; // Nom d'utilisateur Cal.com
    const start = url.searchParams.get('start'); // format ISO
    const end = url.searchParams.get('end'); // format ISO

    if (!start || !end) {
        return NextResponse.json({ error: 'Missing start or end date' }, { status: 400 });
    }

    const apiUrl = `${CALCOM_API_URL}?username=${username}&start=${start}&end=${end}`;

    const res = await fetch(apiUrl, {
        headers: {
            Authorization: `Bearer ${CALCOM_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        return NextResponse.json({ error: 'Failed to fetch Cal.com availability' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
}
