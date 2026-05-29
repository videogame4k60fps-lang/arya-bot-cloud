export interface Problem {
  type: 'no_website' | 'low_rating' | 'few_reviews' | 'incomplete_info' | 'premium_category';
  label: string;
  points: number;
}

export interface Business {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  types: string[];
  opportunityScore: number;
  problems: Problem[];
  lat?: number;
  lng?: number;
}

export interface OutreachMessages {
  email: { subject: string; body: string };
  linkedin: string;
  whatsapp: string;
  phone: string;
}

export interface WatchlistItem {
  business: Business;
  savedAt: string;
}
