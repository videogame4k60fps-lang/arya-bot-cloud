import { Problem, Business } from './types';

type RawBusiness = Omit<Business, 'opportunityScore' | 'problems'>;

const PREMIUM_TYPES = [
  'dentist', 'lawyer', 'gym', 'hotel', 'spa', 'doctor',
  'physiotherapist', 'veterinary', 'accounting', 'real_estate_agency',
  'insurance_agency', 'beauty_salon', 'hair_care',
];

export function calculateOpportunityScore(b: RawBusiness): { score: number; problems: Problem[] } {
  const problems: Problem[] = [];
  let score = 0;

  if (!b.website) {
    score += 30;
    problems.push({ type: 'no_website', label: 'Sito web assente', points: 30 });
  }

  if (b.rating === undefined) {
    score += 10;
    problems.push({ type: 'low_rating', label: 'Rating non disponibile', points: 10 });
  } else if (b.rating < 3.5) {
    score += 20;
    problems.push({ type: 'low_rating', label: `Rating basso (${b.rating}/5)`, points: 20 });
  }

  if (b.reviewCount === undefined) {
    score += 15;
    problems.push({ type: 'few_reviews', label: 'Nessuna recensione', points: 15 });
  } else if (b.reviewCount < 15) {
    score += 20;
    problems.push({ type: 'few_reviews', label: `Poche recensioni (${b.reviewCount})`, points: 20 });
  } else if (b.reviewCount < 50) {
    score += 8;
  }

  const missing = [!b.phone, !b.address].filter(Boolean).length;
  if (missing > 0) {
    const pts = missing * 7;
    score += pts;
    problems.push({ type: 'incomplete_info', label: 'Informazioni incomplete', points: pts });
  }

  const isPremium = b.types.some(t => PREMIUM_TYPES.some(p => t.includes(p)));
  if (isPremium) {
    score += 15;
    problems.push({ type: 'premium_category', label: 'Settore ad alto valore', points: 15 });
  }

  return { score: Math.min(100, score), problems };
}
