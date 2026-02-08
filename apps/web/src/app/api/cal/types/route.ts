import { type NextRequest, NextResponse } from 'next/server';

const CAL_API_KEY = process.env.CAL_API_KEY;
const CAL_API_BASE_URL = 'https://api.cal.com/v2';

export type RDVContentType = {
    id: string;
    title: string;
    slug: string;
    description: string;
    duration: number;
    locations: string[];
    requiresConfirmation: boolean;
    price: number;
    currency: string;
};
  
export async function GET(_req: NextRequest) {
    if (!CAL_API_KEY) {
        return NextResponse.json({ error: 'Missing Cal.com API key' }, { status: 500 });
    }

    try {
        // Récupérer les event types de l'utilisateur connecté (authentifié via token)
        const response = await fetch(`${CAL_API_BASE_URL}/event-types`, {
            headers: {
                Authorization: `Bearer ${CAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 360000,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error }, { status: response.status });
        }

        const {data} = await response.json();
        const events = data.eventTypeGroups[0].eventTypes.filter((event: any) => !event.hidden)
            .map((event: any) => ({
                id: event.id,
                title: event.title,
                slug: event.slug,
                description: event.description,
                duration: event.length,
                locations: event.locations,
                requiresConfirmation: event.requiresConfirmation,
                price: event.price,
                currency: event.currency,
            }));
        return NextResponse.json(events, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || 'Unknown error occurred' },
            { status: 500 }
        );
    }
}
