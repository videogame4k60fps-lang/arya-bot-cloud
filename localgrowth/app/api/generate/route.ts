import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Business, OutreachMessages } from '@/lib/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY non configurata' }, { status: 500 });
  }

  const { business }: { business: Business } = await request.json();
  const problemsList = business.problems.map(p => `- ${p.label}`).join('\n');

  const prompt = `Sei un consulente di marketing digitale. Scrivi messaggi di outreach commerciale personalizzati per questa attività locale.

Attività: ${business.name}
Settore: ${business.types.slice(0, 2).join(', ')}
Indirizzo: ${business.address}
Rating: ${business.rating !== undefined ? `${business.rating}/5 (${business.reviewCount ?? 0} recensioni)` : 'Non disponibile'}
Sito web: ${business.website || 'ASSENTE'}

Opportunità rilevate:
${problemsList}

Genera esattamente questo JSON (nessun testo extra):
{
  "email": {
    "subject": "oggetto breve e diretto (max 60 caratteri)",
    "body": "corpo email professionale, 3 paragrafi, inizia con il nome dell'attività, proponi soluzioni non problemi, chiudi con invito a una call esplorativa"
  },
  "linkedin": "messaggio LinkedIn max 200 caratteri, professionale e diretto",
  "whatsapp": "messaggio WhatsApp 2-3 righe, tono amichevole, emoji moderate",
  "phone": "script telefonico 60-90 secondi: presentazione, motivo della chiamata, domanda aperta finale"
}

Regole: tono professionale ma non freddo; non menzionare lo strumento di analisi; no promesse irrealistiche; personalizza col nome dell'attività.`;

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSON non trovato nella risposta');

    const outreach: OutreachMessages = JSON.parse(match[0]);
    return NextResponse.json(outreach);
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json({ error: 'Errore nella generazione messaggi' }, { status: 500 });
  }
}
