import { NextRequest, NextResponse } from 'next/server';
import { calculateOpportunityScore } from '@/lib/opportunityScore';
import { Business } from '@/lib/types';

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  geometry?: { location?: { lat?: number; lng?: number } };
}

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE = 'https://maps.googleapis.com/maps/api/place';

async function fetchDetails(placeId: string): Promise<{ phone?: string; website?: string }> {
  const url = `${BASE}/details/json?place_id=${placeId}&fields=formatted_phone_number,website&key=${API_KEY}&language=it`;
  const res = await fetch(url);
  const data = await res.json();
  const r = data.result || {};
  return { phone: r.formatted_phone_number, website: r.website };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');

  if (!query) return NextResponse.json({ error: 'Query mancante' }, { status: 400 });
  if (!API_KEY) return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY non configurata' }, { status: 500 });

  try {
    const searchUrl = `${BASE}/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}&language=it`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      return NextResponse.json({ error: `Google Places: ${searchData.status}` }, { status: 502 });
    }

    const raw: PlaceResult[] = (searchData.results || []).slice(0, 10);
    const details = await Promise.all(raw.map(r => fetchDetails(r.place_id)));

    const businesses: Business[] = raw.map((r, i) => {
      const base = {
        placeId: r.place_id,
        name: r.name,
        address: r.formatted_address,
        phone: details[i].phone,
        website: details[i].website,
        rating: r.rating,
        reviewCount: r.user_ratings_total,
        types: r.types || [],
        lat: r.geometry?.location?.lat,
        lng: r.geometry?.location?.lng,
      };
      const { score, problems } = calculateOpportunityScore(base);
      return { ...base, opportunityScore: score, problems };
    });

    businesses.sort((a, b) => b.opportunityScore - a.opportunityScore);
    return NextResponse.json({ businesses, total: businesses.length });
  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json({ error: 'Errore durante la ricerca' }, { status: 500 });
  }
}
