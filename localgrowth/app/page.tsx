'use client';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import BusinessCard from '@/components/BusinessCard';
import OutreachModal from '@/components/OutreachModal';
import WatchlistPanel from '@/components/WatchlistPanel';
import { Business, OutreachMessages, WatchlistItem } from '@/lib/types';

type SortKey = 'score' | 'rating' | 'reviews';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [outreach, setOutreach] = useState<OutreachMessages | null>(null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('score');

  useEffect(() => {
    const saved = localStorage.getItem('localgrowth_watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setBusinesses([]);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore ricerca');
      setBusinesses(data.businesses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore ricerca');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (business: Business) => {
    setGeneratingFor(business.placeId);
    setSelectedBusiness(business);
    setOutreach(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOutreach(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore generazione');
      setSelectedBusiness(null);
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleSave = (business: Business) => {
    const item: WatchlistItem = { business, savedAt: new Date().toISOString() };
    const updated = [...watchlist.filter(w => w.business.placeId !== business.placeId), item];
    setWatchlist(updated);
    localStorage.setItem('localgrowth_watchlist', JSON.stringify(updated));
  };

  const handleRemove = (placeId: string) => {
    const updated = watchlist.filter(w => w.business.placeId !== placeId);
    setWatchlist(updated);
    localStorage.setItem('localgrowth_watchlist', JSON.stringify(updated));
  };

  const sorted = [...businesses].sort((a, b) => {
    if (sortBy === 'score') return b.opportunityScore - a.opportunityScore;
    if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">LocalGrowth AI</h1>
            <p className="text-xs text-gray-500">Trova attività locali che hanno bisogno dei tuoi servizi</p>
          </div>
          <button
            onClick={() => setShowWatchlist(true)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors"
          >
            <span>★</span>
            <span className="hidden sm:inline">Watchlist</span>
            {watchlist.length > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {watchlist.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {businesses.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 font-medium">{businesses.length} attività trovate</p>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-blue-400"
              >
                <option value="score">Ordina per: Opportunità</option>
                <option value="rating">Ordina per: Rating</option>
                <option value="reviews">Ordina per: Recensioni</option>
              </select>
            </div>
            <div className="space-y-4">
              {sorted.map(b => (
                <BusinessCard
                  key={b.placeId}
                  business={b}
                  onGenerate={handleGenerate}
                  onSave={handleSave}
                  isGenerating={generatingFor === b.placeId}
                  isSaved={watchlist.some(w => w.business.placeId === b.placeId)}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && businesses.length === 0 && !error && (
          <div className="mt-24 text-center text-gray-400">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-lg font-medium text-gray-600">Il tuo radar per trovare clienti</p>
            <p className="text-sm mt-2">Inizia con una ricerca: &quot;Dentisti Milano&quot;, &quot;Palestre Roma&quot;...</p>
          </div>
        )}
      </main>

      {selectedBusiness && outreach && (
        <OutreachModal
          business={selectedBusiness}
          outreach={outreach}
          onClose={() => { setSelectedBusiness(null); setOutreach(null); }}
        />
      )}

      {showWatchlist && (
        <WatchlistPanel
          items={watchlist}
          onRemove={handleRemove}
          onGenerate={handleGenerate}
          onClose={() => setShowWatchlist(false)}
        />
      )}
    </div>
  );
}
